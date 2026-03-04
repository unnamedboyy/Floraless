"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading || !user || user.role !== "pelanggan") return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 
                   bg-[#C9AE63] text-white 
                   rounded-full shadow-2xl 
                   flex items-center justify-center
                   hover:scale-110 transition-all
                   z-[999]"
      >
        💬
      </button>

      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
}