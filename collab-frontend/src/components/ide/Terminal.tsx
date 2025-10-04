"use client";

import { useRef, useEffect } from "react";

export default function Terminal({ output }: { output: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [output]);

  return (
    <div className="border-t border-[#141b22] bg-[#0e131a]/80 backdrop-blur-sm">
      <div className="px-4 py-2 text-[11px] tracking-wider text-gray-400 border-b border-[#141b22]">
        TERMINAL
      </div>
      <div ref={ref} className="h-full overflow-auto px-4 py-3 font-mono text-[12px] leading-6">
        <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
      </div>
    </div>
  );
}