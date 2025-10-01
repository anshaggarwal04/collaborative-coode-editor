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

  const [identifier, setIdentifier] = useState(""); // ✅ username OR email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Detect whether it's email or username
      const payload = identifier.includes("@")
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await api.post("/auth/login", payload);

      // Save user + token into context
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
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <form
        onSubmit={handleLogin}
        className="bg-base-100 p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="input input-bordered w-full mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full mb-6"
          required
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/auth/register" className="link link-primary">
          Register
          </a>
        </p>
      </form>
    </div>
  );
}