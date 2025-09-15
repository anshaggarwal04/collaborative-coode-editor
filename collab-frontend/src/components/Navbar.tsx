"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-base-100/80 border-b border-base-content/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Collab<span className="text-primary">Editor</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-base-content/80">
          <Link
            href="/rooms"
            className="hover:text-primary transition-colors duration-200"
          >
            Rooms
          </Link>
          <Link
            href="/auth/login"
            className="hover:text-primary transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="btn btn-sm btn-primary rounded-full px-6 shadow-md hover:scale-105 transition-transform"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}