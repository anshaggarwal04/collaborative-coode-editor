"use client";

import CodeEditor from "./CodeEditor";
import CompilerPanel from "./CompilerPanel";

type Props = {
  code: string;
  setCode: (value: string) => void;
  roomId: string;
};

export default function VSCodeLayout({ code, setCode, roomId }: Props) {
  return (
    <div className="flex h-screen w-screen bg-[#111]">
      {/* Left - Editor */}
      <div className="flex-1 border-r border-gray-800">
        <CodeEditor roomId={roomId} code={code} setCode={setCode} />
      </div>

      {/* Right - Compiler */}
      <div className="w-[35%] flex flex-col">
        <CompilerPanel roomId={roomId} code={code} />
      </div>
    </div>
  );
}