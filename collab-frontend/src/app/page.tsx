"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const keywords = [
      "function", "const", "return", "if", "else",
      "while", "for", "true", "false", "null",
      "=>", "{ }", "import", "export", "class"
    ];
    const fontSize = 18;
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array(columns).fill(1);

    const colors = ["#7b2ff7", "#38bdf8", "#f472b6", "#a3e635", "#facc15"];

    // Track cursor position
    const cursor = { x: -100, y: -100 };
    window.addEventListener("mousemove", (e) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    });

    const draw = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.25)"; // background trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = keywords[Math.floor(Math.random() * keywords.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const posX = i * fontSize;
        const posY = y * fontSize;

        // Default color
        ctx.fillStyle = color;

        // Stop effect near cursor (±2 columns around cursor)
        if (Math.abs(cursor.x - posX) < fontSize * 2 && cursor.y < posY) {
          // Don't move this column
          ctx.fillStyle = "rgba(255,255,255,0.8)"; // highlight it
          ctx.fillText(text, posX, posY); 
          return; // skip increment
        }

        ctx.fillText(text, posX, posY);

        // Reset drops randomly
        if (posY > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const goJoin = () => (user ? router.push("/rooms/join") : router.push("/auth/login"));
  const goStarted = () => (user ? router.push("/dashboard") : router.push("/auth/login"));

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-white">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 bg-gradient-to-t from-black/50 via-black/20 to-transparent">
        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(139,92,246,0.7)]">
          CollabEditor
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-300">
          Real-time collaborative code editor — futuristic, fast, beautiful.
        </p>

        <div className="mt-8 flex space-x-4">
          <button
            onClick={goJoin}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition transform"
          >
            🚀 Join a Room
          </button>
          <button
            onClick={goStarted}
            className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 font-semibold backdrop-blur hover:bg-gray-800 transition"
          >
            Get Started
          </button>
        </div>

        <p className="mt-10 text-xs text-gray-500">
          Built for developers, teams, and creators ✨
        </p>
      </div>
    </div>
  );
}