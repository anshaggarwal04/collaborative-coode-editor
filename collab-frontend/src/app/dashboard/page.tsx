"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to CollabEditor 🎉</h1>

      <div className="flex gap-4">
        {/* Go to Rooms → Join Page */}
        <button
          className="btn btn-outline btn-primary"
          onClick={() => router.push("/rooms/join")}
        >
          Go to Rooms
        </button>

        {/* Redirect to Create Room Page */}
        <button
          className="btn btn-primary"
          onClick={() => router.push("/rooms/create")}
        >
          + Create Room
        </button>
      </div>
    </div>
  );
}