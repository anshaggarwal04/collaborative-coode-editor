"use client";

import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthContext();

  return (
    <div className="navbar bg-base-100 shadow-md px-6">
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold text-primary">
          CollabEditor
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <>
            <span className="text-sm">Hi, {user?.username}</span>
            <button onClick={logout} className="btn btn-sm btn-outline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="btn btn-sm btn-outline">
              Login
            </Link>
            <Link href="/auth/register" className="btn btn-sm btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}