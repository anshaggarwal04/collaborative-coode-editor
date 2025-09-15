"use client";

import { useAuth } from "@/hooks/useAuth";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  const { isAuthenticated, loading } = useAuth(false);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (isAuthenticated) {
    return <p className="text-center mt-10">Already registered Redirecting...</p>;
  }

  return <RegisterForm />;
}