"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import InteractiveGlow from "@/components/InteractiveGlow";

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const { user } = useAuthContext();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const snippets = [
      "function init() {",
      "const user = login();",
      "if(res.ok){ return data; }",
      "console.log('Connected');",
      "for(let i=0;i<lines;i++){",
      "def main():",
      "class Solution:",
      "public static void main()",
      "try { fetch('/api'); }",
    ];

    const colors = [
      "rgba(0, 255, 198,", // cyan
      "rgba(255, 196, 107,", // amber
      "rgba(200, 200, 255,", // pale white-blue
      "rgba(180, 255, 220,", // mint tint
    ];

    const cursor = { x: -999, y: -999 };
    window.addEventListener("mousemove", (e) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    });

    const makeLayer = (count: number, depth: number) =>
      Array.from({ length: count }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        text: snippets[Math.floor(Math.random() * snippets.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: (0.04 + Math.random() * 0.15) * depth, // ⏬ slowed down
        blur: depth === 0.5 ? 3 : depth === 1 ? 1.5 : 0,
      }));

    const layers = [
      makeLayer(Math.floor(canvas.width * 0.05), 0.5),
      makeLayer(Math.floor(canvas.width * 0.08), 1),
      makeLayer(Math.floor(canvas.width * 0.04), 2),
    ];

    const draw = () => {
      ctx.fillStyle = "rgba(12,15,20,0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "15px 'JetBrains Mono', monospace";
      ctx.textBaseline = "top";

      layers.forEach((layer) => {
        for (const snip of layer) {
          const dist = Math.hypot(cursor.x - snip.x, cursor.y - snip.y);
          const glow = Math.max(0, 1 - dist / 250);
          const alpha = 0.06 + glow * 0.4;
          ctx.fillStyle = `${snip.color}${alpha})`;
          ctx.shadowBlur = snip.blur;
          ctx.shadowColor = `${snip.color}0.3)`;
          ctx.fillText(snip.text, snip.x, snip.y);

          snip.y += snip.speed;
          if (snip.y > canvas.height) {
            snip.y = -20;
            snip.x = Math.random() * canvas.width;
          }
        }
      });
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  const goJoin = () => (user ? router.push("/rooms/join") : router.push("/auth/login"));
  const goStarted = () => (user ? router.push("/dashboard") : router.push("/auth/login"));

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0b0d10] text-white select-none">
      {/* ✨ Matching soft glow from Dashboard */}
      <InteractiveGlow color="amber" intensity={0.08} size={700} />

      {/* Code Rain Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
        <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight mb-5 text-[#00ffc6] drop-shadow-[0_0_25px_rgba(0,255,198,0.25)]">
          CollabEditor
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
          Real-time collaborative coding — immersive, minimal, and made for developers.
        </p>

        <div className="flex gap-4">
          <button
            onClick={goJoin}
            className="px-6 py-3 rounded-lg bg-[#181c23] hover:bg-[#222833] text-white 
                       font-semibold border border-gray-700 transition-transform hover:scale-105"
          >
            🚀 Join a Room
          </button>
          <button
            onClick={goStarted}
            className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 
                       hover:bg-gray-800/40 transition-transform hover:scale-105"
          >
            Get Started
          </button>
        </div>

        <p className="mt-10 text-xs text-gray-500">
          Designed for engineers who love clarity and collaboration ✨
        </p>
      </div>
    </div>
  );
}