"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ identifier: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = form.identifier.includes("@")
        ? { email: form.identifier, password: form.password }
        : { username: form.identifier, password: form.password };

      const res = await api.post("/auth/login", payload);
      const data = res.data;

      login(data.token, data.user); // ✅ update context + localStorage
      toast.success(`Welcome back, ${data.user.username}!`);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed";
        toast.error(errorMessage);
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="identifier"
              placeholder="Email or Username"
              value={form.identifier}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}