"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Mail, Lock, Loader2, UserPlus, ChevronRight } from "lucide-react";

export default function RegisterForm() {
  const { login } = useAuthContext();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      login(res.data.token, res.data.user);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleRegister} className="space-y-6">
        {/* Registry Selection */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-3 bg-white/20 block" /> Registry_Alias
            </label>
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Type: AlphaNumeric</span>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 w-1 bg-white/0 group-focus-within:bg-white transition-all duration-300" />
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 transition-colors group-focus-within:text-white" />
            <input
              type="text"
              placeholder="System Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/[0.01] border border-white/5 py-4 pl-12 pr-4 text-[13px] text-white placeholder-gray-800 outline-none focus:bg-white/[0.03] focus:border-white/10 transition-all font-mono"
              required
            />
          </div>
        </div>

        {/* Contact Vector */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-3 bg-white/20 block" /> Contact_Vector
            </label>
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Type: Email</span>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 w-1 bg-white/0 group-focus-within:bg-white transition-all duration-300" />
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 transition-colors group-focus-within:text-white" />
            <input
              type="email"
              placeholder="Communication Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.01] border border-white/5 py-4 pl-12 pr-4 text-[13px] text-white placeholder-gray-800 outline-none focus:bg-white/[0.03] focus:border-white/10 transition-all font-mono"
              required
            />
          </div>
        </div>

        {/* Secure Key */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-3 bg-white/20 block" /> Secure_Key_Gen
            </label>
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Type: Hash</span>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 w-1 bg-white/0 group-focus-within:bg-white transition-all duration-300" />
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 transition-colors group-focus-within:text-white" />
            <input
              type="password"
              placeholder="Access Sequence"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.01] border border-white/5 py-4 pl-12 pr-4 text-[13px] text-white placeholder-gray-800 outline-none focus:bg-white/[0.03] focus:border-white/10 transition-all font-mono"
              required
            />
          </div>
        </div>

        {/* Action Panel */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full overflow-hidden bg-white hover:bg-white/95 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-[11px] uppercase tracking-[0.4em] py-5 transition-all active:scale-[0.99] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <span className="relative z-10">Initialize_Account</span>
                <ChevronRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <div className="mt-4 flex items-center justify-between text-[8px] font-black text-white/10 uppercase tracking-widest">
            <span>Protocol: Account_Init</span>
            <span>Security: AES-256</span>
          </div>
        </div>
      </form>
    </div>
  );
}