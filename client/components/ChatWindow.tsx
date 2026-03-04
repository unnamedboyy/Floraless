"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { socket } from "@/lib/socket";

export default function ChatWindow({
  onClose,
}: {
  onClose: () => void;
}) {
  const { user } = useAuth();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loadingRoom, setLoadingRoom] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const joinedRef = useRef(false);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Init room
  useEffect(() => {
    async function initRoom() {
      if (!user?.id || !API) return;

      try {
        setLoadingRoom(true);

        const res = await fetch(`${API}/room-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ pelanggan: user.id }),
        });

        const data = await res.json();
        setRoom(data);

        if (!joinedRef.current) {
          socket.emit("join_chat_room", { roomId: data._id });
          joinedRef.current = true;
        }

        const chatRes = await fetch(`${API}/chat/${data._id}`, {
          credentials: "include",
        });

        const chatData = await chatRes.json();
        setMessages(Array.isArray(chatData) ? chatData : []);
      } catch (err) {
        console.error("Init room error:", err);
      } finally {
        setLoadingRoom(false);
      }
    }

    initRoom();
  }, [user]);

  // Listen message
  useEffect(() => {
    function handleReceive(msg: any) {
      setMessages((prev) => [...prev, msg]);
    }

    socket.on("chat_receive", handleReceive);

    return () => {
      socket.off("chat_receive", handleReceive);
    };
  }, []);

  function sendMessage() {
    if (!text.trim() || !room) return;

    socket.emit("chat_send", {
      roomId: room._id,
      isi_chat: text.trim(),
    });

    setText("");
  }

  return (
    <div
      className="fixed bottom-24 right-6 w-[380px] h-[520px]
                 bg-white rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.12)]
                 flex flex-col overflow-hidden z-[999]"
    >
      {/* Header */}
      <div className="bg-white border-b px-5 py-4 flex justify-between items-center">
        <div>
          <p className="font-semibold text-sm text-neutral-900">
            Live Chat
          </p>
          <p className="text-xs text-neutral-400">
            {loadingRoom ? "Connecting..." : "Admin online"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-black transition"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-white">
        {messages.map((msg) => {
          const isUser = msg.sender_role === "pelanggan";

          return (
            <div
              key={msg._id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 text-sm break-words
                  rounded-2xl transition-all
                  ${
                    isUser
                      ? "bg-[#C9AE63] text-white rounded-br-sm shadow-md"
                      : "bg-white text-neutral-800 border border-neutral-200 shadow-sm rounded-bl-sm"
                  }`}
              >
                {msg.isi_chat}
              </div>
            </div>
          );
        })}

        {messages.length === 0 && !loadingRoom && (
          <p className="text-xs text-neutral-400 text-center mt-10">
            Start conversation 👋
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t bg-white flex items-center gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-neutral-100 rounded-full px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#C9AE63]"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-[#C9AE63] text-white px-5 py-2 rounded-full text-sm
                     hover:opacity-90 transition shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}