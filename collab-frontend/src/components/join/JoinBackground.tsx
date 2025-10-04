"use client";

import { useEffect, useRef } from "react";

export default function JoinBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: width / 2, y: height / 2 };

    const nodes: { x: number; y: number; dx: number; dy: number }[] = [];
    const nodeCount = 70;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }

    // shockwave state
    let ripple: { x: number; y: number; radius: number; active: boolean } = {
      x: 0,
      y: 0,
      radius: 0,
      active: false,
    };

    const draw = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)"; // deep background
      ctx.fillRect(0, 0, width, height);

      // Links
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);

          if (dist < 150) {
            let intensity = 1 - dist / 150;

            // boost if ripple passes through
            if (
              ripple.active &&
              Math.abs(Math.hypot(a.x - ripple.x, a.y - ripple.y) - ripple.radius) < 25
            ) {
              intensity = 1; // max glow
            }

            ctx.strokeStyle = `rgba(124, 58, 237, ${intensity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach((n) => {
        const distToMouse = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        const nearMouse = distToMouse < 120;

        const distToRipple = Math.abs(
          Math.hypot(n.x - ripple.x, n.y - ripple.y) - ripple.radius
        );
        const rippleBoost = ripple.active && distToRipple < 25;

        ctx.beginPath();
        ctx.arc(n.x, n.y, rippleBoost ? 6 : nearMouse ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = rippleBoost
          ? "#f472b6" // pink flash
          : nearMouse
          ? "#a78bfa" // purple glow near cursor
          : "#38bdf8"; // cyan default
        ctx.fill();
      });

      // Move nodes
      nodes.forEach((n) => {
        n.x += n.dx;
        n.y += n.dy;
        if (n.x < 0 || n.x > width) n.dx *= -1;
        if (n.y < 0 || n.y > height) n.dy *= -1;
      });

      // expand ripple
      if (ripple.active) {
        ripple.radius += 8;
        if (ripple.radius > Math.max(width, height)) {
          ripple.active = false;
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      ripple = { x: e.clientX, y: e.clientY, radius: 0, active: true };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}