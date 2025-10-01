"use client";

import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

export default function CodeEditor({
  code,
  setCode,
  roomId,
}: {
  code: string;
  setCode: (value: string) => void;
  roomId: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = monaco.editor.create(editorRef.current, {
      value: code,
      language: "javascript",
      theme: "vs-dark",
      fontSize: 14,
      minimap: { enabled: false },
    });

    editor.onDidChangeModelContent(() => {
      setCode(editor.getValue());
    });

    return () => editor.dispose();
  }, []);

  return <div ref={editorRef} className="h-full w-full" />;
}