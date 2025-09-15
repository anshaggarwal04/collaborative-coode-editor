"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard 🚀</h1>
      <p className="text-gray-400">You’re logged in and ready to collaborate.</p>

      <div className="flex gap-4">
        <Link href="/rooms" className="btn btn-primary">
          Go to Rooms
        </Link>
        <Link href="/rooms" className="btn btn-outline">
          + Create Room
        </Link>
      </div>
    </div>
  );
}