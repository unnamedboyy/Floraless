"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { socket } from "@/lib/socket";

export default function AdminChatPage() {
  const { user } = useAuth();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ===== Auto scroll =====
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===== Listen message =====
  useEffect(() => {
    function handleReceive(msg: any) {
      setMessages((prev) => [...prev, msg]);
    }

    socket.on("chat_receive", handleReceive);

    return () => {
      socket.off("chat_receive", handleReceive);
    };
  }, []);

  // ===== Load rooms =====
  useEffect(() => {
    async function loadRooms() {
      const res = await fetch(`${API}/room-chat`, {
        credentials: "include",
      });
      const data = await res.json();
      setRooms(data);
    }

    loadRooms();
  }, []);

  // ===== Load messages =====
  async function loadMessages(roomId: string) {
    const res = await fetch(`${API}/chat/${roomId}`, {
      credentials: "include",
    });
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
  }

  // ===== Select room =====
  function handleSelectRoom(room: any) {
    setSelectedRoom(room);
    socket.emit("join_chat_room", { roomId: room._id });
    loadMessages(room._id);
  }

  // ===== Send message =====
  function sendMessage() {
    if (!text.trim() || !selectedRoom) return;

    socket.emit("chat_send", {
      roomId: selectedRoom._id,
      isi_chat: text.trim(),
    });

    setText("");
  }

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white">

      {/* ================= SIDEBAR ================= */}
      <div className="w-[320px] border-r bg-white flex flex-col">

        <div className="px-6 py-5 border-b">
          <h2 className="text-lg font-semibold text-neutral-900">
            Conversations
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {rooms.length} rooms
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {rooms.map((room) => (
            <div
              key={room._id}
              onClick={() => handleSelectRoom(room)}
              className={`px-6 py-4 cursor-pointer transition
                ${
                  selectedRoom?._id === room._id
                    ? "bg-neutral-100"
                    : "hover:bg-neutral-50"
                }`}
            >
              <p className="text-sm font-medium text-neutral-800">
                {room.pelanggan?.username}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CHAT AREA ================= */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="px-8 py-6 border-b bg-white">
          <h3 className="text-lg font-semibold text-neutral-900">
            {selectedRoom
              ? selectedRoom.pelanggan?.username
              : "Select a conversation"}
          </h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-neutral-50">
          {selectedRoom ? (
            messages.map((msg) => {
              const isUser = msg.sender_role === "pelanggan";

              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isUser ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[60%] px-5 py-3 text-sm break-words
                      rounded-2xl shadow-sm
                      ${
                        isUser
                          ? "bg-white border border-neutral-200 text-neutral-800"
                          : "bg-[#C9AE63] text-white"
                      }`}
                  >
                    {msg.isi_chat}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex items-center justify-center text-neutral-400">
              Select a room to view messages
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {selectedRoom && (
          <div className="px-8 py-6 border-t bg-white flex gap-4">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-neutral-100 rounded-lg px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#C9AE63]"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-[#C9AE63] text-white px-6 py-3 rounded-lg
                         hover:opacity-90 transition"
            >
              Send
            </button>
          </div>
        )}

      </div>
    </div>
  );
}