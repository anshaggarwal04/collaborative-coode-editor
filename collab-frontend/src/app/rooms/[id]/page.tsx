"use client";

import { useParams, useRouter } from "next/navigation";
import { useRoomSocket } from "@/hooks/useRoomSocket";
import { useAuthContext } from "@/context/AuthContext";
import dynamic from "next/dynamic";

const CodeEditor = dynamic(() => import("@/components/ide/CodeEditor"), { ssr: false });
import Terminal from "@/components/ide/Terminal";
import ActivityBar from "@/components/ide/ActivityBar";
import StatusBar from "@/components/ide/StatusBar";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronRight, PanelBottom, SquareCode, Share2, LogOut } from "lucide-react";

const LANGS = [
  { id: 71, label: "Python", monaco: "python" },
  { id: 63, label: "JavaScript", monaco: "javascript" },
  { id: 62, label: "Java", monaco: "java" },
  { id: 54, label: "C++", monaco: "cpp" },
];

export default function RoomPage() {
  const { id } = useParams();
  const roomId = String(id);
  const router = useRouter();
  const { user } = useAuthContext();
  const { code, setCode, output, runCode, sendCode } = useRoomSocket({ roomId });

  const [activeView, setActiveView] = useState("explorer");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);

  const toggleSidebar = (view: string) => {
    if (activeView === view && sidebarOpen) {
      setSidebarOpen(false);
    } else {
      setActiveView(view);
      setSidebarOpen(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to system clipboard");
  };

  return (
    <div className="h-screen w-screen bg-[#050505] flex flex-col overflow-hidden text-gray-400 selection:bg-white/10 selection:text-white">
      {/* 🧩 Refined Layout Background Layers */}
      <div className="fixed inset-0 z-0 bg-noise pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-grid opacity-20 pointer-events-none" />

      {/* ── Main Workspace ── */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* 1. Activity Bar (Narrow Left) */}
        <ActivityBar activeView={activeView} onViewChange={toggleSidebar} />

        {/* 2. Side Bar (Collapsible) */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-[#0a0a0a] border-r border-white/5 flex flex-col overflow-hidden select-none"
            >
              <div className="h-9 px-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-black text-gray-600 bg-white/[0.01]">
                {activeView}
              </div>
              
              <div className="flex-1 overflow-hidden">
                {activeView === "explorer" && (
                   <div className="h-full flex flex-col py-4 px-2 space-y-6">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/5 text-xs text-gray-300 font-bold cursor-pointer group transition-all">
                            <SquareCode size={14} className="text-blue-400" />
                            main.py
                         </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 px-2">
                         <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700 mb-4">Active Session</h3>
                         <div className="space-y-3">
                            <div className="flex items-center gap-3 group">
                               <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[9px] font-black text-white uppercase shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                 {user?.username?.[0] || 'U'}
                               </div>
                               <div className="flex flex-col">
                                 <span className="text-[11px] font-black text-gray-400 group-hover:text-gray-200 transition-colors tracking-tight">{user?.username || 'Researcher'}</span>
                                 <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest leading-none">Primary Node</span>
                               </div>
                               <div className="ml-auto w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                         </div>
                      </div>
                   </div>
                )}
              </div>

              <div className="p-4 bg-white/[0.01] border-t border-white/5">
                 <button 
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all group"
                 >
                   <LogOut size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
                 </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 3. Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#050505]">
          
          {/* Top Tabs / Command Center */}
          <div className="h-9 bg-[#050505] border-b border-white/5 flex items-center justify-between px-2">
            <div className="flex items-center h-full">
               <div className="h-full px-4 border-r border-white/5 flex items-center gap-2 bg-[#0a0a0a] text-gray-200 text-[11px] font-bold border-t border-t-blue-500">
                  <SquareCode size={14} className="text-blue-400" />
                  <span>main.py</span>
               </div>
               
               <div className="flex items-center gap-1 px-4 text-[10px] text-gray-600 font-bold">
                  <span className="hover:text-gray-400 cursor-pointer transition-colors">Workspace</span>
                  <ChevronRight size={10} />
                  <span className="hover:text-gray-400 cursor-pointer transition-colors">{roomId.slice(0, 8)}</span>
                  <ChevronRight size={10} />
                  <span className="text-gray-400">main.py</span>
               </div>
            </div>
            
            <div className="flex items-center gap-2 pr-2">
               <button 
                 onClick={() => runCode(LANGS[0].id)}
                 className="flex items-center gap-2 px-3 py-1 rounded bg-[#007acc] hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/10"
               >
                 Run Layer
               </button>
               <div className="w-px h-4 bg-white/5 mx-1" />
               <button 
                 onClick={handleShare}
                 className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-white transition-all"
                 title="Share Environment"
               >
                 <Share2 size={16} />
               </button>
               <button 
                 onClick={() => setPanelOpen(!panelOpen)}
                 className={`p-1.5 rounded hover:bg-white/5 transition-all ${panelOpen ? 'text-blue-400' : 'text-gray-600'}`}
                 title="Toggle Console"
               >
                 <PanelBottom size={18} />
               </button>
            </div>
          </div>

          {/* Main Space (Editor + Console Split) */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            <div className="flex-1 min-h-0">
               <CodeEditor
                 language="python"
                 value={code}
                 roomId={roomId}
                 onChange={(v) => {
                   setCode(v);
                   sendCode(v);
                 }}
               />
            </div>

            <AnimatePresence>
               {panelOpen && (
                 <motion.div
                   initial={{ height: 0 }}
                   animate={{ height: 260 }}
                   exit={{ height: 0 }}
                   transition={{ duration: 0.2, ease: "easeOut" }}
                   className="border-t border-white/5 bg-[#050505] overflow-hidden flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
                 >
                   <div className="h-8 border-b border-white/5 px-4 flex items-center justify-between bg-white/[0.01]">
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 border-b border-white py-2">Runtime Console</span>
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-gray-500 cursor-pointer py-2">Debugger</span>
                      </div>
                   </div>
                   <div className="flex-1 overflow-auto">
                      <Terminal output={output} />
                   </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Status Bar Bottom ── */}
      <StatusBar roomId={roomId} language="python" />
    </div>
  );
}