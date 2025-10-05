"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { initSocket, getSocket } from "@/lib/socket";
import { useAuthContext } from "@/context/AuthContext";
import TopBar from "@/components/ide/TopBar";
import CodeEditor from "@/components/ide/CodeEditor";
import Terminal from "@/components/ide/Terminal";
import { motion } from "framer-motion";
import { Layers, FileCode2 } from "lucide-react";

type JudgeLang = { id: number; label: string; monaco: string };

const LANGS: JudgeLang[] = [
  { id: 71, label: "Python", monaco: "python" },
  { id: 63, label: "JavaScript", monaco: "javascript" },
  { id: 62, label: "Java", monaco: "java" },
  { id: 54, label: "C++", monaco: "cpp" },
];

export default function RoomPage() {
  const { id } = useParams();
  const roomId = String(id);
  const router = useRouter();
  useAuthContext();

  const [code, setCode] = useState("");
  const [lang, setLang] = useState<JudgeLang>(LANGS[0]);
  const [output, setOutput] = useState<string>("⚡ Run your code to see output...");
  const latestCodeRef = useRef(code);

  useEffect(() => {
    latestCodeRef.current = code;
  }, [code]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = initSocket(token);
    socket.emit("joinRoom", { roomId });

    socket.on("roomHistory", (history: { event: string; payload?: string }[]) => {
      const last = [...history].reverse().find(h => h.event === "codeChange" && h.payload)?.payload;
      if (last) setCode(last);
    });

    socket.on("codeUpdate", (incoming: string) => setCode(incoming));
    socket.on("requestLatestCode", () => {
      try {
        getSocket().emit("codeChange", { roomId, code: latestCodeRef.current });
      } catch {}
    });

    socket.on("codeResult", (result) => {
      let out = "";
      if (result.stdout) out += result.stdout;
      if (result.stderr) out += (out ? "\n" : "") + `‼️ Error:\n${result.stderr}`;
      if (result.compile_output)
        out += (out ? "\n" : "") + `ℹ️ Compile Output:\n${result.compile_output}`;
      setOutput(out || "No output.");
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("roomHistory codeUpdate requestLatestCode codeResult");
    };
  }, [roomId]);

  const runCode = () => {
    try {
      const s = getSocket();
      setOutput("⏳ Running…");
      s.emit("runCode", {
        roomId,
        language_id: lang.id,
        source_code: latestCodeRef.current,
        stdin: "",
      });
    } catch {
      setOutput("Socket not connected.");
    }
  };

  const shareRoom = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setOutput("✅ Room ID copied to clipboard.");
    } catch {
      setOutput("Could not copy Room ID.");
    }
  };

  const leaveRoom = () => {
    try {
      getSocket().emit("leaveRoom", { roomId });
    } catch {}
    router.push("/");
  };

  return (
    <div className="relative h-screen w-screen text-gray-200 bg-gradient-to-br from-[#0b0d10] via-[#0d1117] to-[#0e131a] overflow-hidden">

      {/* ✨ Subtle background grid + glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 blur-3xl" />
      </div>

      {/* Main layout grid */}
      <div className="relative z-10 grid grid-rows-[56px_1fr_200px] h-full">

        <TopBar
          roomId={roomId}
          langs={LANGS}
          lang={lang}
          onLangChange={setLang}
          onRun={runCode}
          onShare={shareRoom}
          onLeave={leaveRoom}
        />

        {/* Editor Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative grid grid-cols-[260px_1fr] overflow-hidden"
        >
          {/* Sidebar / Explorer */}
          <aside className="border-r border-white/10 bg-[#0d1117]/70 backdrop-blur-sm flex flex-col">
            <div className="px-4 py-3 flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 border-b border-white/5">
              <Layers size={14} className="text-indigo-400" />
              Explorer
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 text-sm">
              <div className="flex items-center gap-2 text-gray-300 hover:text-indigo-300 transition cursor-pointer">
                <FileCode2 size={14} />
                main.py
              </div>
              <div className="text-gray-400/70 text-xs ml-5">src/utils.py</div>
              <div className="text-gray-400/70 text-xs ml-5">README.md</div>
            </div>
          </aside>

          {/* Monaco editor container */}
          <div className="relative bg-[#0e131a]/60">
            <CodeEditor language={lang.monaco} value={code} onChange={setCode} />
          </div>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative border-t border-white/10 bg-[#0b0d10]/80 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
          <Terminal output={output} />
        </motion.div>
      </div>
    </div>
  );
}