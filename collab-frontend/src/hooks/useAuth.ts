"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth(redirectIfNoAuth: boolean = true) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);

    if (!savedToken && redirectIfNoAuth) {
      router.push("/auth/login");
    }

    setLoading(false);
  }, [router, redirectIfNoAuth]);

  return { token, loading, isAuthenticated: !!token };
}