"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";

import Navbar from "@/components/Navbar2";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { AuthProvider } from "@/context/AuthContext";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {

  const pathname = usePathname();

  const hideLayout =
    pathname === "/login" || pathname === "/register";

  return (
    <html lang="id">
      <body className="bg-white text-neutral-900">

        <AuthProvider>

          {!hideLayout && <Navbar />}

          <main>{children}</main>

          {!hideLayout && <Footer />}
          {!hideLayout && <ChatWidget />}

        </AuthProvider>

      </body>
    </html>
  );
}