"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "rgba(15, 15, 20, 0.85)",
          color: "#fff",
          backdropFilter: "blur(14px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          padding: "12px 18px",
          fontSize: "15px",
          letterSpacing: "0.3px",
          boxShadow:
            "0 0 30px rgba(100,150,255,0.08), 0 0 60px rgba(255,255,255,0.04)",
          transition: "all 0.4s ease",
        },

        // 🌿 Success
        success: {
          iconTheme: {
            primary: "#34d399",
            secondary: "transparent",
          },
          style: {
            color: "#a7f3d0",
            textShadow: "0 0 10px rgba(52,211,153,0.6)",
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(56,189,248,0.1))",
            border: "1px solid rgba(34,197,94,0.3)",
            boxShadow:
              "0 0 20px rgba(34,197,94,0.25), 0 0 60px rgba(56,189,248,0.15)",
          },
        },

        // 💥 Error
        error: {
          iconTheme: {
            primary: "#f87171",
            secondary: "transparent",
          },
          style: {
            color: "#fecaca",
            textShadow: "0 0 10px rgba(248,113,113,0.7)",
            background:
              "linear-gradient(135deg, rgba(248,113,113,0.12), rgba(239,68,68,0.08))",
            border: "1px solid rgba(248,113,113,0.3)",
            boxShadow:
              "0 0 20px rgba(239,68,68,0.2), 0 0 60px rgba(239,68,68,0.1)",
          },
        },

        // 🌌 Loading
        loading: {
          iconTheme: {
            primary: "#a78bfa",
            secondary: "transparent",
          },
          style: {
            color: "#ddd6fe",
            textShadow: "0 0 12px rgba(167,139,250,0.8)",
            background:
              "linear-gradient(135deg, rgba(167,139,250,0.1), rgba(147,197,253,0.1))",
            border: "1px solid rgba(167,139,250,0.3)",
            boxShadow:
              "0 0 20px rgba(147,197,253,0.2), 0 0 60px rgba(167,139,250,0.1)",
          },
        },
      }}
    />
  );
}