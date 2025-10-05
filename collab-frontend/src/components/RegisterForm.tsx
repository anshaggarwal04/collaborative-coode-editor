"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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

      // ✅ Auto-login after registration
      login(res.data.token, res.data.user);

      toast.success("Account created successfully! 🎉");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleRegister}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-5 w-full"
    >
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-center bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent"
      >
        Register
      </motion.h1>

      {/* Username */}
      <div className="form-control">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input input-bordered w-full bg-[#0f1216]/80 border border-white/10 text-white placeholder-gray-500
                     focus:border-sky-400 focus:outline-none transition-all duration-300 focus:shadow-[0_0_12px_rgba(56,189,248,0.4)]"
        />
      </div>

      {/* Email */}
      <div className="form-control">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input input-bordered w-full bg-[#0f1216]/80 border border-white/10 text-white placeholder-gray-500
                     focus:border-sky-400 focus:outline-none transition-all duration-300 focus:shadow-[0_0_12px_rgba(56,189,248,0.4)]"
        />
      </div>

      {/* Password */}
      <div className="form-control">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input input-bordered w-full bg-[#0f1216]/80 border border-white/10 text-white placeholder-gray-500
                     focus:border-sky-400 focus:outline-none transition-all duration-300 focus:shadow-[0_0_12px_rgba(56,189,248,0.4)]"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        className={`btn w-full font-medium text-white mt-2 transition-all duration-300 ${
          loading
            ? "bg-gradient-to-r from-sky-800 to-blue-800 cursor-not-allowed opacity-70"
            : "bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 hover:from-sky-400 hover:to-blue-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
        }`}
      >
        {loading ? "Creating account..." : "Register"}
      </motion.button>
    </motion.form>
  );
}