"use client";

import { useAuthContext } from "@/context/AuthContext";
import LoginForm from "@/components/LoginForm";
import InteractiveGlow from "@/components/InteractiveGlow";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0c0f] text-white">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-lg font-medium"
        >
          ✅ You’re already logged in — redirecting...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0b0c0f] overflow-hidden text-white">
      <InteractiveGlow color="sky" intensity={0.18} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative flex flex-col lg:flex-row items-center justify-between 
                   w-[90%] lg:w-[75%] max-w-6xl mx-auto
                   rounded-3xl border border-white/10 backdrop-blur-2xl bg-white/[0.03]
                   shadow-[0_0_80px_rgba(255,255,255,0.05)] overflow-hidden"
      >
        {/* Branding */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left px-16 py-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="relative z-10 max-w-md mx-auto lg:mx-0"
          >
            <div className="inline-block rounded-2xl bg-white/[0.04] backdrop-blur-md 
                            border border-white/10 px-10 py-8 shadow-[0_0_60px_rgba(100,150,255,0.08)] 
                            hover:shadow-[0_0_80px_rgba(150,200,255,0.15)] transition-shadow duration-700">
              <h1 className="text-6xl font-extrabold tracking-tight mb-4 leading-tight">
                <span className="text-white">Collab</span>
                <span className="text-sky-400">Editor</span>
              </h1>
              <p className="text-white/70 text-base leading-relaxed">
                Reimagine collaboration. Code with clarity, create beautifully, and
                work in perfect flow.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-16 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-sm rounded-2xl p-8 bg-[#101113]/90 
                       border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <h2 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-[#b8dfff] via-[#ffeec2] to-[#ffd7a2] bg-clip-text text-transparent">
              Welcome Back 👋
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Sign in to continue your journey.
            </p>

            <LoginForm />

            <p className="mt-6 text-center text-sm text-gray-400">
              Don’t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-sky-300 hover:text-sky-200 font-medium transition"
              >
                Register
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}