"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";

// Dynamically import Monaco only on client
const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (v: string) => void;
  roomId?: string; // optional — for emitting to socket if passed
}

export default function CodeEditor({ language, value, onChange, roomId }: CodeEditorProps) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<any>(null);

  // 🔹 Send code updates with debounce for smooth collab
  const broadcast = (code: string) => {
    try {
      if (!roomId) return; // keep reusable
      const socket = getSocket();
      socket.emit("codeChange", { roomId, code });
    } catch (err) {
      console.warn("Socket not ready:", err);
    }
  };

  // 🔹 Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // 🔹 Handle typing changes
  const handleChange = (newValue?: string) => {
    const next = newValue || "";
    onChange(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => broadcast(next), 250);
  };

  // 🔹 Store editor ref on mount
  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus(); // auto focus
  };

  return (
    <div className="h-full w-full bg-[#0d0f14]">
      <Monaco
        height="100%"
        width="100%"
        theme="vs-dark"
        language={language}
        value={value}
        onChange={handleChange}
        onMount={handleEditorMount}
        options={{
          fontSize: 15,
          fontLigatures: true,
          minimap: { enabled: false },
          smoothScrolling: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "all",
          cursorBlinking: "smooth",
          cursorStyle: "line",
          roundedSelection: true,
          tabSize: 2,
          lineNumbers: "on",
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
        }}
      />
    </div>
  );
}