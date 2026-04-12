"use client";

import "@/styles/globals.css";
import { Outfit } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import ToasterProvider from "@/components/ToasterProvider";

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className="bg-[#050505] antialiased">
      <body className={`${outfit.className} bg-[#050505] text-white selection:bg-white selection:text-black`}>
        <AuthProvider>
          <ToasterProvider />
          <Navbar />
          <main className="relative w-full h-full min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}