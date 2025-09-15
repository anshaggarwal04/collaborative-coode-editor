import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="p-6 container mx-auto">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}