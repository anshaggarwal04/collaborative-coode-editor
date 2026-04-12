"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { Zap, Users, Code2, Globe, Shield, Cpu, ChevronRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthContext();

  const goJoin = () => (user ? router.push("/rooms/join") : router.push("/auth/login"));
  const goStarted = () => (user ? router.push("/dashboard") : router.push("/auth/login"));

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505] text-white selection:bg-white selection:text-black">
      {/* 🧩 Refined Layout Background Layers */}
      <div className="absolute inset-0 z-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-grid pointer-events-none opacity-40" />
      
      {/* 🔦 Dynamic Beam / Radial Glow */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[1000px] h-[600px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-20">
        
        {/* Animated System Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md mb-12"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">System v2.4.9 // Network Ready</span>
        </motion.div>

        {/* Hero Title: Heavy & Industrial */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center space-y-6 mb-16"
        >
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
            Engineering <br />
            <span className="text-gray-600">Sync Layer.</span>
          </h1>
          <p className="text-gray-500 text-xs md:text-sm max-w-lg mx-auto font-bold uppercase tracking-[0.3em] leading-relaxed pt-4">
             // High-performance collaborative environment <br />
             // Real-time CRDT synchronization for modern teams.
          </p>
        </motion.div>

        {/* Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-px bg-white/5 border border-white/5 p-px rounded-2xl overflow-hidden shadow-2xl transition-all"
        >
          <button
            onClick={goStarted}
            className="px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-gray-200 active:scale-95 flex items-center gap-2"
          >
            Initialize Workspace <ChevronRight size={14} />
          </button>
          
          <button
            onClick={goJoin}
            className="px-10 py-5 bg-[#0a0a0a] text-white text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-white/[0.03] active:scale-95 border-l border-white/5"
          >
            Access Session ID
          </button>
        </motion.div>

        {/* Technical Feature Specs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl w-full"
        >
          <div className="space-y-4 p-8 rounded-3xl bg-white/[0.01] border border-white/5 relative group hover:border-white/10 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield size={40} strokeWidth={1} />
            </div>
            <div className="flex items-center gap-3 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
               <Shield size={14} /> Trust Protocol
            </div>
            <h3 className="font-black uppercase tracking-tight text-white text-lg">E2E Collaborative Dev</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-bold">Stable, conflict-free synchronization powered by industrial-grade CRDT algorithms.</p>
          </div>

          <div className="space-y-4 p-8 rounded-3xl bg-white/[0.01] border border-white/5 relative group hover:border-white/10 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Cpu size={40} strokeWidth={1} />
            </div>
            <div className="flex items-center gap-3 text-blue-500 font-black text-[9px] uppercase tracking-widest">
               <Cpu size={14} /> Sync Engine
            </div>
            <h3 className="font-black uppercase tracking-tight text-white text-lg">Integrated Runtime</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-bold">Execution layers ready for rapid prototyping and cloud-based testing sequences.</p>
          </div>

          <div className="space-y-4 p-8 rounded-3xl bg-white/[0.01] border border-white/5 relative group hover:border-white/10 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Globe size={40} strokeWidth={1} />
            </div>
            <div className="flex items-center gap-3 text-gray-400 font-black text-[9px] uppercase tracking-widest">
               <Globe size={14} /> Global Relay
            </div>
            <h3 className="font-black uppercase tracking-tight text-white text-lg">Network Latency Edge</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed font-bold">Optimized WebSocket tunneling for global synchronization with sub-15ms overhead.</p>
          </div>
        </motion.div>
      </main>

      {/* Global Metadata Footer */}
      <footer className="absolute bottom-10 w-full flex justify-between px-10 text-[8px] font-black uppercase tracking-[0.3em] text-gray-800">
        <div className="flex gap-8">
            <span>TLS 1.3 Certified</span>
            <span>AES-256 Auth</span>
        </div>
        <span>CollabEditor // Open Source Core</span>
      </footer>
    </div>
  );
}