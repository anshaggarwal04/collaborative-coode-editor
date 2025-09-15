import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CollabEditor",
  description: "Real-time collaborative code editor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        {/* Navbar */}
        <Navbar /> s

        {/* Main content */}
        <main className="p-6 container mx-auto">{children}</main>

        {/* Global toast notifications */}
        <Toaster   toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}