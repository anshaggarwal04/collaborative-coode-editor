"use client";

import { useAuthContext } from "@/context/AuthContext";
import LoginForm from "@/components/LoginForm";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-white">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-medium"
        >
          ✅ Already logged in — Redirecting...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* 🔹 Left Panel: Branding / Background */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 relative text-white">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 animate-gradient-xy" />
        
        {/* Particle Overlay (faux code rain dots) */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3),transparent_70%)] animate-pulse" />

        {/* Branding Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-8"
        >
          <h1 className="text-6xl font-extrabold tracking-tight drop-shadow-xl">
            Collab<span className="text-pink-300">Editor</span>
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-md mx-auto">
            A futuristic collaborative code editor — built for developers, powered by teamwork 🚀
          </p>
        </motion.div>
      </div>

      {/* 🔹 Right Panel: Login Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 py-12 bg-[#0f172a] relative">
        {/* Glow Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,92,246,0.2),transparent)]" />

        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent"
          >
            Welcome Back 👋
          </motion.h2>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl p-8"
          >
            <LoginForm />
          </motion.div>

          {/* Footer Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-sm text-gray-400 text-center"
          >
            Don’t have an account?{" "}
            <a
              href="/auth/register"
              className="text-indigo-400 hover:text-indigo-300 transition"
            >
              Register here
            </a>
          </motion.p>
        </div>
      </div>
    </div>
  );
}