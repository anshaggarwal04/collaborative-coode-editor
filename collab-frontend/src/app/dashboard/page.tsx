"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Users, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import InteractiveGlow from "@/components/InteractiveGlow";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0b0c0f] text-white">
      <InteractiveGlow color="indigo" intensity={0.15} />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl w-full mx-auto text-center px-6 py-16"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-sky-300 via-indigo-300 to-pink-300 bg-clip-text text-transparent">
          Welcome back, {user?.username || "Developer"} 
        </h1>
        <p className="mt-4 text-gray-400 text-lg">
          Your creative hub — collaborate, create, and code beautifully.
        </p>

        <div className="grid sm:grid-cols-2 gap-8 mt-16">
          <motion.button
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => router.push("/rooms/join")}
            className="group relative overflow-hidden p-10 rounded-3xl bg-[#111315]/80 backdrop-blur-2xl border border-white/10 text-left shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:shadow-[0_0_60px_rgba(56,189,248,0.15)] transition-all duration-500"
          >
            <div className="flex items-center gap-3 text-sky-300">
              <Users size={28} className="group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-semibold">Join a Room</h2>
            </div>
            <p className="text-gray-400 mt-2">
              Instantly connect with your team and start building.
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => router.push("/rooms/create")}
            className="group relative overflow-hidden p-10 rounded-3xl bg-[#111315]/80 backdrop-blur-2xl border border-white/10 text-left shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:shadow-[0_0_60px_rgba(255,150,255,0.2)] transition-all duration-500"
          >
            <div className="flex items-center gap-3 text-pink-300">
              <PlusCircle size={28} className="group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-semibold">Create a Room</h2>
            </div>
            <p className="text-gray-400 mt-2">
              Start a new workspace, invite collaborators, and innovate freely.
            </p>
          </motion.button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-12">
          ✨ Built with love for developers.
        </p>
      </motion.div>
    </div>
  );
}