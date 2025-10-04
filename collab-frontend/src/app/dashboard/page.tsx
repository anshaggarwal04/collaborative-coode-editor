"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Users, PlusCircle } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-white flex items-center justify-center px-6 py-16">
      <div className="max-w-4xl w-full space-y-10">
        {/* Welcome Header */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Welcome back, {user?.username || "Developer"} 👋
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Jump right back into collaboration, or start something new.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Join Rooms */}
          <button
            onClick={() => router.push("/rooms/join")}
            className="group p-8 rounded-2xl bg-[#111827]/80 border border-gray-700 shadow-lg hover:shadow-purple-500/20 transition transform hover:scale-[1.02] text-left"
          >
            <div className="flex items-center gap-3 mb-3 text-indigo-400">
              <Users size={28} className="group-hover:scale-110 transition" />
              <h2 className="text-xl font-semibold">Join a Room</h2>
            </div>
            <p className="text-gray-400">
              Enter a Room ID or browse your joined rooms.
            </p>
          </button>

          {/* Create Room */}
          <button
            onClick={() => router.push("/rooms/create")}
            className="group p-8 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-purple-700 shadow-lg hover:shadow-pink-500/20 transition transform hover:scale-[1.02] text-left"
          >
            <div className="flex items-center gap-3 mb-3 text-pink-400">
              <PlusCircle size={28} className="group-hover:scale-110 transition" />
              <h2 className="text-xl font-semibold">Create a Room</h2>
            </div>
            <p className="text-gray-400">
              Spin up a fresh collab session and invite your team.
            </p>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-12">
          🚀 Built for developers, teams, and creators ✨
        </p>
      </div>
    </div>
  );
}