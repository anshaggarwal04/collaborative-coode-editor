"use client";

import { useAuth } from "@/hooks/useAuth";
import RegisterForm from "@/components/RegisterForm";
import InteractiveGlow from "@/components/InteractiveGlow";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
  const { isAuthenticated, loading } = useAuth(false);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0c0f] text-white">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-medium"
        >
          Loading...
        </motion.p>
      </div>
    );

  if (isAuthenticated)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0c0f] text-white">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-medium"
        >
          ✅ Already registered — Redirecting...
        </motion.p>
      </div>
    );

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0b0c0f] overflow-hidden text-white">
      <InteractiveGlow color="pink" intensity={0.22} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col lg:flex-row items-center justify-between 
                   w-[90%] lg:w-[75%] max-w-6xl mx-auto rounded-3xl 
                   border border-white/10 backdrop-blur-2xl bg-white/[0.03]
                   shadow-[0_0_80px_rgba(255,255,255,0.05)] overflow-hidden"
      >
        {/* Left Panel */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left px-16 py-20">
          <div className="inline-block rounded-2xl bg-white/[0.04] backdrop-blur-md 
                          border border-white/10 px-10 py-8 shadow-[0_0_60px_rgba(255,140,200,0.1)] 
                          hover:shadow-[0_0_80px_rgba(255,150,210,0.2)] transition-shadow duration-700">
            <h1 className="text-6xl font-extrabold tracking-tight mb-4 leading-tight ">
              Join <span className="text-sky-400">CollabEditor</span>
            </h1>
            <p className="text-white/70 text-base leading-relaxed">
              Build. Share. Collaborate. Start your creative journey today 🚀
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center px-16 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-sm rounded-2xl p-8 bg-[#101113]/90 
                       border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <h2 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-300 bg-clip-text text-transparent">
              Create Your Account 
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Start collaborating with your team today.
            </p>

            <RegisterForm />

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-pink-300 hover:text-pink-200 font-medium transition"
              >
                Login
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}