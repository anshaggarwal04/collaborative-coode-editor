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
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Rooms", href: "/rooms/join" },
    { name: "Create", href: "/rooms/create" },
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0b0d10]/80 backdrop-blur-xl 
                 border-b border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* ─ Brand ─ */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-white hover:text-gray-200 transition-colors"
        >
          CollabEditor
        </Link>

        {/* ─ Center Navigation ─ */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide transition-all duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="underline"
                      className="absolute left-0 -bottom-[3px] w-full h-[1.5px] bg-white rounded"
                      transition={{ duration: 0.25 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* ─ Right Section ─ */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-400">
                Hi,&nbsp;
                <span className="text-white font-semibold">
                  {user?.username}
                </span>
              </span>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 10px rgba(255,255,255,0.15)",
                }}
                whileTap={{ scale: 0.96 }}
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-white/10 
                           text-gray-300 text-sm font-medium hover:bg-white/10 hover:text-white 
                           transition-all duration-200"
              >
                <LogOut size={15} />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-white/10 
                           text-gray-300 text-sm font-medium hover:bg-white/10 hover:text-white 
                           transition-all duration-200"
              >
                <LogIn size={15} />
                Login
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/10 
                           text-white text-sm font-medium border border-white/10 
                           hover:bg-white/20 transition-all duration-200"
              >
                <UserPlus size={15} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Subtle bottom white line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10" />
    </motion.nav>
  );
}