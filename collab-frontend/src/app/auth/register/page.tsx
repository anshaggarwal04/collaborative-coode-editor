"use client";

import { useAuth } from "@/hooks/useAuth";
import RegisterForm from "@/components/RegisterForm";
import { motion } from "framer-motion";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const { isAuthenticated, loading } = useAuth(false);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500"
        >
          // Synching Registry...
        </motion.p>
      </div>
    );

  if (isAuthenticated)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500"
        >
          // Authorized - Redirection in Progress
        </motion.p>
      </div>
    );

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden text-white selection:bg-white selection:text-black">
      {/* 🧩 Refined Layout Background Layers */}
      <div className="absolute inset-0 z-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-grid pointer-events-none opacity-40" />
      
      {/* 🔦 Focal Glow */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg mx-auto px-6 py-12"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            <UserPlus size={24} className="fill-current" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2 text-center leading-none">Register Identity</h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Establish your developer credentials</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-1 shadow-2xl overflow-hidden relative group">
           {/* Border Beam Effect */}
           <div className="absolute -inset-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 group-hover:rotate-180 transition-transform duration-[2000ms]" />
           
           <div className="relative bg-[#0a0a0a] rounded-[22px] p-10">
              <RegisterForm />

              <div className="mt-10 pt-8 border-t border-white/5 text-center">
                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest leading-loose">
                  Already part of the network? <br />
                  <Link
                    href="/auth/login"
                    className="text-white hover:underline underline-offset-8 decoration-gray-700 transition-all font-black"
                  >
                    // Access Session Login
                  </Link>
                </p>
              </div>
           </div>
        </div>

        {/* System Metadata Footer */}
        <div className="mt-12 flex justify-between items-center px-2">
            <div className="flex gap-4">
                <span className="text-[8px] font-black uppercase text-gray-700 tracking-widest">OpenSSL 3.0</span>
                <span className="text-[8px] font-black uppercase text-gray-700 tracking-widest">PGP Compliant</span>
            </div>
            <span className="text-[8px] font-black uppercase text-gray-800 tracking-widest italic">v.alpha.registry</span>
        </div>
      </motion.div>
    </div>
  );
}