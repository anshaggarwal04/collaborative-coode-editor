"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useRooms } from "@/hooks/useRooms";
import { Users, PlusCircle, FolderOpen, ArrowUpRight, Clock, Box, Terminal, Activity, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { rooms, loading } = useRooms();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-[#050505] text-white selection:bg-white/10 selection:text-white">
      {/* 🧩 Refined Layout Background Layers */}
      <div className="absolute inset-0 z-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-grid pointer-events-none opacity-40" />

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl w-full mx-auto px-6 py-20"
      >
        {/* Header Section */}
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
               <Activity size={12} className="text-emerald-500" /> System / Dashboard
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
               Developer <span className="text-gray-500">Workspace</span>
            </h1>
            <p className="text-gray-600 text-[11px] font-bold uppercase tracking-[0.2em] max-w-xl leading-relaxed">
              Authorized User: {user?.username || "Researcher_01"} // Collaborative Engine v2.4.9 Active
            </p>
          </div>

          <div className="flex gap-4">
             <div className="px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center min-w-[120px]">
                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest mb-1">Latency</span>
                <span className="text-xs font-mono font-bold text-emerald-500">12ms</span>
             </div>
             <div className="px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center min-w-[120px]">
                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest mb-1">Status</span>
                <span className="text-xs font-mono font-bold text-blue-500 uppercase">Synchronized</span>
             </div>
          </div>
        </header>

        {/* ⚡ Primary Actions: Engineering Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl mb-24">
          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            onClick={() => router.push("/rooms/create")}
            className="group relative p-12 bg-[#0a0a0a] text-left transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={24} className="text-white" />
            </div>
            <div className="flex flex-col h-full space-y-8">
               <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-black">
                  <PlusCircle size={24} strokeWidth={2.5} />
               </div>
               <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Initialize Environment</h2>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed max-w-sm">
                    Spawn a new collaborative sandbox. Dedicated RTC tunnel and Yjs CRDT synchronization.
                  </p>
               </div>
               <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Terminal size={12} /> Action / Request_Create
               </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
            onClick={() => router.push("/rooms/join")}
            className="group relative p-12 bg-[#0a0a0a] text-left transition-all border-l border-white/5 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={24} className="text-white" />
            </div>
            <div className="flex flex-col h-full space-y-8">
               <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-white">
                  <Users size={24} strokeWidth={2.5} />
               </div>
               <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Bridge Session</h2>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed max-w-sm">
                    Join an existing collaborative node via ID. Multi-user concurrent editing layer.
                  </p>
               </div>
               <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2">
                  <ShieldCheck size={12} /> Protocol / Handshake
               </div>
            </div>
          </motion.button>
        </div>

        {/* 🧩 Recent Activity Section */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <Clock size={18} className="text-gray-700" />
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Persistent History</h3>
             </div>
             {rooms.length > 0 && (
               <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[9px] font-black uppercase tracking-widest text-gray-600">
                  {rooms.length} NODES_ACTIVE
               </div>
             )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-2xl bg-white/[0.01] border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-24 rounded-[32px] border border-dashed border-white/5 text-center">
              <FolderOpen size={48} className="text-gray-900 mb-6" />
              <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">No History Fragments Found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.slice(0, 6).map((room) => (
                <motion.div
                  key={room.id}
                  whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.01)" }}
                  className="group relative p-8 rounded-[24px] border border-white/5 bg-[#0a0a0a] transition-all cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/rooms/${room.id}`)}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                    <div className="flex items-start justify-between">
                       <h4 className="text-md font-black uppercase tracking-tight text-gray-300 group-hover:text-white transition-colors truncate max-w-[180px]">
                         {room.name}
                       </h4>
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest leading-none mb-1">Owner</span>
                           <span className="text-[10px] font-bold text-gray-500 font-mono tracking-tighter truncate max-w-[100px]">{room.createdBy}</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest leading-none mb-1">Fragment</span>
                           <span className="text-[10px] font-bold text-gray-500 font-mono tracking-tighter">#{room.id.slice(0, 4)}</span>
                        </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Global System Metadata Footer */}
        <div className="mt-40 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-gray-700">
               <span>AES-256 Cloud Relay</span>
               <span className="hidden md:inline">v2.4.9 Stable Build</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-800 italic">Connected to global.registry.north-vcl</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
}