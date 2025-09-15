"use client";

import { Toaster, toast } from "react-hot-toast";
import React from "react";

export const notify = {
  success: (msg: string) =>
    toast.success(msg, {
      style: {
        borderRadius: "12px",
        background: "rgba(245, 245, 247, 0.9)",
        color: "#000",
        fontSize: "14px",
        fontWeight: 500,
        backdropFilter: "blur(10px)",
      },
      iconTheme: {
        primary: "#007aff", // iOS blue
        secondary: "#fff",
      },
    }),
  error: (msg: string) =>
    toast.error(msg, {
      style: {
        borderRadius: "12px",
        background: "rgba(245, 245, 247, 0.9)",
        color: "#000",
        fontSize: "14px",
        fontWeight: 500,
        backdropFilter: "blur(10px)",
      },
      iconTheme: {
        primary: "#ff3b30", // iOS red
        secondary: "#fff",
      },
    }),
};

// ✅ React component wrapper
export const ToasterProvider: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "12px",
          background: "rgba(245, 245, 247, 0.9)",
          color: "#000",
          backdropFilter: "blur(10px)",
        },
      }}
    />
  );
};