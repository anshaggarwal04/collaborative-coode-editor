"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CodeEditor({
  language,
  value,
  onChange,
}: {
  language: string;
  value: string;
  onChange: (v: string) => void;
}) {
  // debounce emit "codeChange" for smooth collab typing
  const timer = useRef<NodeJS.Timeout | null>(null);

  const broadcast = (code: string) => {
    try {
      const socket = getSocket();
      // you'll call this from the page with roomId—so only broadcast via page
      // here we only update local state and let page decide when to emit if needed
      // (we keep this component pure and reusable)
      socket.emit; // noop to satisfy types in some setups
    } catch {}
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="bg-[#0d0f14]">
      <Monaco
        height="100%"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(v) => {
          const next = v || "";
          onChange(next);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => broadcast(next), 150);
        }}
        options={{
          fontSize: 14,
          fontLigatures: true,
          minimap: { enabled: false },
          smoothScrolling: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "all",
        }}
      />
    </div>
  );
}