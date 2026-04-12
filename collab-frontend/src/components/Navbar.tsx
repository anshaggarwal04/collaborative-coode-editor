"use client";

import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { LogOut, Box, Activity, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthContext();
  const pathname = usePathname();

  const isRoomPage = pathname.startsWith("/rooms/");
  const isAuthPage = pathname.startsWith("/auth/");

  // Hide on Room pages where IDE has its own layout
  if (isRoomPage) return null;

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Explore Layers", href: "/rooms/join" },
    { name: "Initialization", href: "/rooms/create" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-[100] bg-[#050505]/60 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* ─ Brand: Engineering Style ─ */}
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-3 group transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black group-hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              <Box size={18} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-black tracking-tighter uppercase leading-none">
                Collab<span className="text-gray-500">Editor</span>
              </span>
              <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.4em] leading-normal pt-0.5">Core_Node_v2</span>
            </div>
          </Link>

          {/* ─ Links: Technical Style ─ */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative group py-2"
                  >
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                      isActive ? "text-white" : "text-gray-600 group-hover:text-gray-300"
                    }`}>
                      {link.name}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navActive"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ─ System / User Status ─ */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-4 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-xl">
                 <div className="flex flex-col items-start leading-none">
                    <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Activity size={8} className="text-emerald-500" /> Active_Node
                    </span>
                    <span className="text-[10px] font-mono font-bold text-gray-200">{user?.username}</span>
                 </div>
                 <ChevronRight size={12} className="text-gray-800" />
              </div>
              
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-red-500/10 text-gray-700 hover:text-red-400 transition-all border border-transparent"
                title="Disconnect"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            !isAuthPage && (
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
                <Link
                  href="/auth/login"
                  className="text-[10px] font-black uppercase tracking-widest px-6 py-2.5 hover:text-white text-gray-500 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="text-[10px] font-black uppercase tracking-widest px-6 py-2.5 bg-white text-black rounded-lg hover:bg-gray-200 transition-all active:scale-95 shadow-lg"
                >
                  Authorize
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </motion.nav>
  );
}