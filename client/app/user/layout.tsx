"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function UserLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "user") {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "user") {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}