"use client";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";   // ✅ your axios instance
import axios from "axios";       // ✅ real axios for isAxiosError
import toast from "react-hot-toast";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-base-100 px-6 text-center">
      {/* Headline */}
      <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-base-content">
        Collab<span className="text-primary">Editor</span>
      </h1>

      {/* Tagline */}
      <p className="mt-6 max-w-2xl text-lg md:text-xl text-base-content/70 leading-relaxed">
        A real-time collaborative code editor.  
        Simple. Fast. Beautiful. Powered by <span className="font-medium">Judge0</span>.
      </p>

      {/* Call-to-action */}
      <div className="mt-10 flex gap-4">
        <Link
          href="/rooms"
          className="btn btn-primary rounded-full px-8 text-lg shadow-md hover:scale-105 transition-transform"
        >
          Join a Room
        </Link>
        <Link
          href="/auth/register"
          className="btn btn-outline rounded-full px-8 text-lg hover:scale-105 transition-transform"
        >
          Get Started
        </Link>
      </div>

      {/* Subtle footer hint */}
      <p className="mt-16 text-sm text-base-content/50">
        Built for developers, teams, and creators ✨
      </p>
    </main>
  );
}