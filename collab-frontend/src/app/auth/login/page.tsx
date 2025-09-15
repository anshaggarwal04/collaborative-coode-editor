"use client";

import { useAuthContext } from "@/context/AuthContext";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <p className="text-lg font-medium">
          ✅ Already logged in — Redirecting...
        </p>
      </div>
    );
  }

  return <LoginForm />;
}