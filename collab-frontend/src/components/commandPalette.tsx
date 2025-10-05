"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, PlusCircle, Users, LayoutDashboard } from "lucide-react";

const actions = [
  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { name: "Join Room", path: "/rooms/join", icon: <Users size={18} /> },
  { name: "Create Room", path: "/rooms/create", icon: <PlusCircle size={18} /> },
  { name: "Logout", path: "/auth/logout", icon: <LogOut size={18} /> },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Keyboard shortcuts: "/" or "Cmd/Ctrl+K"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" && document.activeElement?.tagName !== "INPUT") ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        setOpen((p) => !p);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = actions.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-[90%] max-w-lg rounded-2xl bg-[#0e1117]/95 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            {/* Search Bar */}
            <div className="border-b border-white/10 p-3">
              <input
                type="text"
                placeholder="Type a command (e.g., join room)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-gray-200 placeholder-gray-500 outline-none text-sm"
              />
            </div>

            {/* Action List */}
            <div className="max-h-64 overflow-y-auto py-2">
              {filtered.length > 0 ? (
                filtered.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(a.path)}
                    className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
                  >
                    <span className="text-amber-300">{a.icon}</span>
                    {a.name}
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4 text-sm">
                  No commands found.
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}