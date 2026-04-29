"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";

let socket: Socket;

export default function UserChatPage() {
  const { user } = useAuth();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    socket = newSocket;

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("chat_receive", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // CREATE / GET ROOM
  useEffect(() => {
    async function initRoom() {
      if (!user?.id || !socket) return;

      const res = await fetch(`${API}/room-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pelanggan: user.id }),
      });

      const data = await res.json();
      setRoom(data);

      // 🔥 WAJIB join setelah connect
      socket.emit("join_chat_room", { roomId: data._id });

      const chatRes = await fetch(`${API}/chat/${data._id}`, {
        credentials: "include",
      });

      const chatData = await chatRes.json();
      setMessages(Array.isArray(chatData) ? chatData : []);
    }

    initRoom();
  }, [user]);

  function sendMessage() {
    if (!text.trim() || !room) return;

    socket.emit("chat_send", {
      roomId: room._id,
      isi_chat: text,
    });

    setText("");
  }

  return (
    <div className="h-[80vh] border rounded-2xl flex flex-col">

      <div className="p-4 border-b font-semibold">
        Live Support
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50">
        {Array.isArray(messages) ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`max-w-xs p-3 rounded-xl text-sm ${
                msg.sender_role === "pelanggan"
                  ? "bg-[#C9AE63] text-white ml-auto"
                  : "bg-white border"
              }`}
            >
              {msg.isi_chat}
            </div>
          ))
        ) : null}

        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-[#C9AE63] text-white px-5 rounded-lg"
        >
          Send
        </button>
      </div>

    </div>
  );
}