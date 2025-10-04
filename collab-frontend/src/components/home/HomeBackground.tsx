"use client";

import { useEffect, useRef } from "react";

export default function HomeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
    const mouseMoveHandler = (e: MouseEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    };
    window.addEventListener("mousemove", mouseMoveHandler);

    const draw = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.25)"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = keywords[Math.floor(Math.random() * keywords.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const posX = i * fontSize;
        const posY = y * fontSize;

        ctx.fillStyle = color;

        // Cursor "freeze" effect
        if (Math.abs(cursor.x - posX) < fontSize * 2 && cursor.y < posY) {
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.fillText(text, posX, posY);
          return;
        }

        ctx.fillText(text, posX, posY);

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
      window.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10" />;
}