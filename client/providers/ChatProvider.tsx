"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { useAuth } from "./AuthProvider";

type ChatContextType = {
  connected: boolean;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (loading) return;

    const socket = getSocket();

    if (user) {
      socket.connect();
      socket.on("connect", () => setConnected(true));
      socket.on("disconnect", () => setConnected(false));
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [user, loading]);

  return (
    <ChatContext.Provider value={{ connected }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used inside ChatProvider");
  }
  return ctx;
}
