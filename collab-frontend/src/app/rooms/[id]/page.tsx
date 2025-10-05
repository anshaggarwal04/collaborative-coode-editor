"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { useRoomSocket } from "@/hooks/useRoomSocket";
import TopBar from "@/components/ide/TopBar";
import CodeEditor from "@/components/ide/CodeEditor";
import Terminal from "@/components/ide/Terminal";
import { motion } from "framer-motion";
import { Layers, FileCode2 } from "lucide-react";

const LANGS = [
  { id: 71, label: "Python", monaco: "python" },
  { id: 63, label: "JavaScript", monaco: "javascript" },
  { id: 62, label: "Java", monaco: "java" },
  { id: 54, label: "C++", monaco: "cpp" },
];

export default function RoomPage() {
  const { id } = useParams();
  const roomId = String(id);
  const router = useRouter();
  const { user } = useAuthContext();
  const { code, setCode, output, runCode, sendCode } = useRoomSocket({ roomId });

  return (
    <div className="relative h-screen w-screen text-gray-100 bg-[#0b0c0f] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10131a] via-[#0f1115] to-[#151921]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.05),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.04),transparent_50%)]" />

      {/* Layout Grid */}
      <div className="relative z-10 grid grid-rows-[56px_1fr_220px] h-full">
        {/* ─ Top Command Bar ─ */}
        <TopBar
          roomId={roomId}
          langs={LANGS}
          lang={LANGS[0]}
          onLangChange={() => {}}
          onRun={() => runCode(LANGS[0].id)}
          onShare={() => navigator.clipboard.writeText(roomId)}
          onLeave={() => router.push("/")}
        />

        {/* ─ Middle Section (Editor + Explorer) ─ */}
        <div className="grid grid-cols-[260px_1fr] h-full overflow-hidden border-t border-white/10">
          {/* Left Explorer */}
          <motion.aside
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0e1117]/90 border-r border-white/10 backdrop-blur-md flex flex-col"
          >
            <div className="px-4 py-3 flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 border-b border-white/5">
              <Layers size={14} className="text-cyan-400" />
              Project Explorer
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition">
                <FileCode2 size={14} />
                main.py
              </div>
              <div className="pl-6 text-gray-500 text-xs">src/helpers.py</div>
              <div className="pl-6 text-gray-500 text-xs">README.md</div>
            </div>

            {/* Room Info */}
            <div className="px-4 py-3 border-t border-white/10 text-xs text-gray-400">
              <p>Room ID:</p>
              <p className="font-mono text-gray-300 text-sm truncate mt-1">{roomId}</p>
            </div>
          </motion.aside>

          {/* Main Editor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative bg-[#0d0f14]/80"
          >
            <CodeEditor
              language={LANGS[0].monaco}
              value={code}
              onChange={(v) => {
                setCode(v);
                sendCode(v);
              }}
            />
          </motion.div>
        </div>

        {/* ─ Bottom Terminal ─ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="border-t border-white/10 bg-[#0a0c10]/90 backdrop-blur-lg"
        >
          <Terminal output={output} />
        </motion.div>
      </div>
    </div>
  );
}