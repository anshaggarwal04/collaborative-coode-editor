"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

// Dynamically import Monaco only on client
const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (v: string) => void;
  roomId?: string; // optional — for emitting to socket if passed
}

export default function CodeEditor({ language, value, onChange, roomId }: CodeEditorProps) {
  const [editorReady, setEditorReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);

  // 🔹 Handle standard non-Yjs onChange fallback
  const handleChange = (newValue?: string) => {
    const next = newValue || "";
    onChange(next);
  };

  // 🔹 Store editor ref on mount
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    setEditorReady(true);
    editor.focus(); // auto focus
  };

  // 🔹 Setup Yjs + y-monaco when editor and room are ready
  useEffect(() => {
    if (!editorReady || !roomId) return;

    // 1. Initialize Yjs
    const ydoc = new Y.Doc();
    
    // 2. Connect to the WebSocket specific for Yjs state
    // We point this to our updated backend endpoint on path /yjs
    const provider = new WebsocketProvider(
      "ws://localhost:5010/yjs",
      roomId,
      ydoc
    );
    providerRef.current = provider;

    // 3. Define a shared text type for the editor
    const ytext = ydoc.getText("monaco");

    // 4. Bind Yjs to the Monaco Editor
    const binding = new MonacoBinding(
      ytext, 
      editorRef.current.getModel(), 
      new Set([editorRef.current]), 
      provider.awareness
    );
    bindingRef.current = binding;

    return () => {
      // Cleanup bindings and provider on unmount securely
      binding.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  }, [editorReady, roomId]);

  return (
    <div className="h-full w-full bg-[#050505]">
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