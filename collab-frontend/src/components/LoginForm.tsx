"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function LoginForm() {
  const { login } = useAuthContext();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await api.post("/auth/login", payload);

      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.username}! 👋`);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Login failed");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 w-full max-w-sm mx-auto"
    >
      {/* Title */}
      <h1 className="text-center text-3xl font-extrabold bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-md mb-2">
        Login
      </h1>

      {/* Email / Username */}
      <input
        type="text"
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        className="input input-bordered w-full bg-[#1a1c1f] border border-gray-700/60 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500 transition-all duration-300"
        required
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full bg-[#1a1c1f] border border-gray-700/60 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500 transition-all duration-300"
        required
      />

      {/* Button */}
      <button
        type="submit"
        className={`btn w-full mt-2 font-semibold text-white rounded-xl shadow-lg border-0 transition-all duration-300 
        ${
          loading
            ? "bg-gradient-to-r from-indigo-400 to-indigo-500 cursor-not-allowed"
            : "bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-[1.02]"
        }`}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      
    </form>
  );
}