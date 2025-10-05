"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

type GlowProps = {
  /** Tailwind color keyword or custom hex (used for the glow hue) */
  color?: "sky" | "pink" | "indigo" | "emerald" | "amber" | string;
  /** 0 → barely visible | 1 → strong neon */
  intensity?: number;
  /** optional: size of glow circle in px */
  size?: number;
};

/**
 * ✨ InteractiveGlow — reusable animated background
 * - Follows cursor with soft blur and aurora gradients
 * - Accepts color & intensity props for easy per-page theming
 */
export default function InteractiveGlow({
  color = "sky",
  intensity = 0.15,
  size = 600,
}: GlowProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const glowX = useTransform(mouseX, (v) => v - size / 2);
  const glowY = useTransform(mouseY, (v) => v - size / 2);

  // Pick base hue by name → fallback to provided string
  const colorMap: Record<string, string> = {
    sky: "rgba(125, 211, 252,",
    pink: "rgba(244, 114, 182,",
    indigo: "rgba(165, 180, 252,",
    emerald: "rgba(110, 231, 183,",
    amber: "rgba(252, 211, 77,",
  };
  const base = colorMap[color] || color;

  return (
    <>
      {/* Ambient Aurora */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(147,197,253,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(255,200,150,0.05),transparent_60%)] animate-[gradient_25s_ease_infinite]" />

      {/* Cursor-follow glow */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 rounded-full blur-3xl mix-blend-screen"
        style={{
          x: glowX,
          y: glowY,
          width: size,
          height: size,
          background: `radial-gradient(circle at center, ${base}${intensity}) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)`,
        }}
      />
    </>
  );
}