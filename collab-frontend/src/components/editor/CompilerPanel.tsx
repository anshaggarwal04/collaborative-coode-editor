"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

type Props = {
  roomId: string;
  code: string;
};

export default function CompilerPanel({ roomId, code }: Props) {
  const [language, setLanguage] = useState("javascript");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    const socket = getSocket();
    socket.on("codeResult", (result: any) => {
      setOutput(
        result.stdout || result.stderr || result.compile_output || "No output"
      );
    });
    return () => {
      socket.off("codeResult");
    };
  }, []);

  const handleRun = () => {
    const socket = getSocket();
    socket.emit("runCode", {
      roomId,
      language_id: language === "javascript" ? 63 : 54, // JS=63, C++=54
      source_code: code,
      stdin,
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#1c1c1e] text-gray-200 p-4">
      {/* Language selector + run */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#2c2c2e] px-3 py-2 rounded-md text-sm focus:outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
        </select>
        <button
          onClick={handleRun}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-medium"
        >
          ▶ Run
        </button>
      </div>

      {/* Input */}
      <textarea
        placeholder="Enter input..."
        value={stdin}
        onChange={(e) => setStdin(e.target.value)}
        className="bg-[#2c2c2e] p-2 rounded-md text-sm h-24 resize-none mb-4 focus:outline-none"
      />

      {/* Output */}
      <div className="flex-1 bg-black rounded-md p-3 text-green-400 font-mono text-sm overflow-auto shadow-inner">
        {output || "Program output will appear here..."}
      </div>
    </div>
  );
}