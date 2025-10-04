import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.className} h-screen w-screen overflow-hidden`}>
        <AuthProvider>
          <div className="flex flex-col h-full w-full">
            <Navbar />
            <main className="flex-1 w-full h-full overflow-auto">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}