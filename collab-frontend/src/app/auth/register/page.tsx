"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";   // ✅ custom axios instance
import axios from "axios";       // ✅ needed for isAxiosError
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", form);

      localStorage.setItem("token", data.token);

      toast.success(`Welcome aboard, ${data.user.username}! 🚀`);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed";
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
          <h2 className="text-2xl font-bold text-center">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
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
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>
          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <a href="/auth/login" className="link link-primary">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}