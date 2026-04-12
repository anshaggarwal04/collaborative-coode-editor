"use client";

import { useRef, useEffect } from "react";
import { Terminal as TerminalIcon, ShieldCheck } from "lucide-react";

export default function Terminal({ output }: { output: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [output]);

  return (
    <div className="h-full flex flex-col bg-[#050505]/80 backdrop-blur-2xl">
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">
          <TerminalIcon size={12} className="text-emerald-400" /> System Output
        </div>
        <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-gray-700">
           <ShieldCheck size={10} /> Secure Environment
        </div>
      </div>
      <div 
        ref={ref} 
        className="flex-1 overflow-auto px-6 py-6 font-mono text-[11px] leading-relaxed selection:bg-emerald-500/30"
      >
        <pre className="whitespace-pre-wrap text-emerald-400/90 drop-shadow-[0_0_8px_rgba(52,211,153,0.15)]">
          {output || "> System ready. Awaiting execution..."}
        </pre>
      </div>
    </div>
  );
}