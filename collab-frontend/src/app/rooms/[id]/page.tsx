"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { initSocket, getSocket } from "@/lib/socket";
import { useAuthContext } from "@/context/AuthContext";
import TopBar from "@/components/ide/TopBar";
import CodeEditor from "@/components/ide/CodeEditor";
import Terminal from "@/components/ide/Terminal";

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

  // keep latest code in ref so we can respond instantly to "requestLatestCode"
  useEffect(() => {
    latestCodeRef.current = code;
  }, [code]);

  // socket lifecycle
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = initSocket(token);
    socket.emit("joinRoom", { roomId });

    // Load last persisted snippet (if any)
    socket.on("roomHistory", (history: { event: string; payload?: string }[]) => {
      const last = [...history].reverse().find(h => h.event === "codeChange" && h.payload)?.payload;
      if (last) setCode(last);
    });

    // Live updates
    socket.on("codeUpdate", (incoming: string) => setCode(incoming));

    // Someone new joined—push current snapshot
    socket.on("requestLatestCode", () => {
      try {
        const s = getSocket();
        s.emit("codeChange", { roomId, code: latestCodeRef.current });
      } catch {}
    });

    // Compiler results
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
      socket.off("roomHistory");
      socket.off("codeUpdate");
      socket.off("requestLatestCode");
      socket.off("codeResult");
    };
  }, [roomId]);

  // run via Judge0 through your backend
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
      const s = getSocket();
      s.emit("leaveRoom", { roomId });
    } catch {}
    router.push("/");
  };

  return (
    <div className="fixed inset-0 bg-[#0b0d10] text-gray-200">
      {/* Centered, full-bleed IDE container */}
      <div className="h-full w-full grid grid-rows-[56px_1fr_200px] overflow-hidden">
        {/* Top bar (sticky height) */}
        <TopBar
          roomId={roomId}
          langs={LANGS}
          lang={lang}
          onLangChange={setLang}
          onRun={runCode}
          onShare={shareRoom}
          onLeave={leaveRoom}
        />

        {/* Editor region (no side gaps, no scroll bleed) */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-[260px_1fr] gap-0">
            {/* Explorer placeholder: subtle, minimal, non-distracting */}
            <aside className="border-r border-[#1c2430] bg-[#0e131a]/70 backdrop-blur-sm">
              <div className="px-4 py-3 text-[11px] tracking-wider text-gray-400">EXPLORER</div>
              <div className="px-4 py-1 text-sm text-gray-300/80">main.py</div>
              <div className="px-4 py-1 text-sm text-gray-300/50">src/</div>
            </aside>

            {/* Monaco */}
            <CodeEditor language={lang.monaco} value={code} onChange={setCode} />
          </div>
        </div>

        {/* Terminal (fixed height, elegant) */}
        <Terminal output={output} />
      </div>
    </div>
  );
}