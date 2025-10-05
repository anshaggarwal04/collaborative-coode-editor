"use client";

import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import ToasterProvider from "@/components/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${inter.className} bg-[#0b0c0f] text-white h-screen w-screen overflow-hidden`}
      >
        {/* ✅ Auth & Toast context providers */}
        <AuthProvider>
          <ToasterProvider />

          {/* ✅ Global layout */}
          <div className="flex flex-col h-full w-full">
            {/* Persistent Navbar */}
            <Navbar />

            {/* Main content area */}
            <main className="flex-1 w-full h-full overflow-auto">
              {/* Adds spacing for navbar */}
              <div className="pt-[64px] px-4 md:px-8">{children}</div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}