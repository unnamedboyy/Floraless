"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function UserLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "pelanggan") {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "pelanggan") {
    return null;
  }

  return (
    <>
      <main className="min-h-screen">
        {children}
      </main>
    </>
  );
}