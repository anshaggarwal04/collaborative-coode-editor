"use client";

import Link from "next/link";
import { useAuthContext } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { LogOut, LogIn, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthContext();
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Rooms", href: "/rooms/join" },
    { name: "Create", href: "/rooms/create" },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
        >
          CollabEditor
        </Link>

        {/* Links */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition ${
                  pathname === link.href
                    ? "text-purple-400"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-purple-400 to-pink-400 rounded"
                  />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-300">
                Hi, <span className="text-white font-semibold">{user?.username}</span>
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium shadow hover:scale-105 transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition"
              >
                <LogIn size={16} /> Login
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium shadow hover:scale-105 transition"
              >
                <UserPlus size={16} /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}