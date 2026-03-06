"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { socket } from "@/lib/socket";
import { Search } from "lucide-react";

export default function AdminChatPage() {
  const { user } = useAuth();
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* ================= AUTO SCROLL ================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SOCKET LISTENER ================= */

  useEffect(() => {
    const handleReceive = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat_receive", handleReceive);

    return () => {
      socket.off("chat_receive", handleReceive);
    };
  }, []);

  /* ================= LOAD ROOMS ================= */

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

  /* ================= LOAD MESSAGE ================= */

  async function loadMessages(roomId: string) {
    const res = await fetch(`${API}/chat/${roomId}`, {
      credentials: "include",
    });

    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
  }

  /* ================= SELECT ROOM ================= */

  function handleSelectRoom(room: any) {
    setSelectedRoom(room);

    socket.emit("join_chat_room", { roomId: room._id });

    loadMessages(room._id);
  }

  /* ================= SEND MESSAGE ================= */

  function sendMessage() {
    if (!text.trim() || !selectedRoom) return;

    socket.emit("chat_send", {
      roomId: selectedRoom._id,
      isi_chat: text.trim(),
    });

    setText("");
  }

  return (
    <div className="h-full flex">

      {/* ================= LEFT PANEL ================= */}

      <div className="w-[320px] border-r border-neutral-200 bg-white flex flex-col">

        {/* HEADER */}
        <div className="px-6 py-5 border-b border-neutral-200">
          <h2 className="font-semibold text-lg text-neutral-900">
            Chat
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {rooms.length} conversations
          </p>
        </div>

        {/* SEARCH */}
        <div className="px-4 py-3 border-b border-neutral-200">

          <div className="relative">

            <Search
              size={16}
              className="absolute left-3 top-3 text-neutral-400"
            />

            <input
              placeholder="Search conversation"
              className="w-full bg-neutral-100 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none"
            />

          </div>

        </div>

        {/* ROOM LIST */}

        <div className="flex-1 overflow-y-auto">

          {rooms.map((room) => {

            const username = room.pelanggan?.username;

            return (
              <div
                key={room._id}
                onClick={() => handleSelectRoom(room)}
                className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition
                ${
                  selectedRoom?._id === room._id
                    ? "bg-neutral-100"
                    : "hover:bg-neutral-50"
                }`}
              >

                {/* AVATAR */}
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium text-neutral-600">
                  {username?.charAt(0).toUpperCase()}
                </div>

                {/* USER */}
                <div className="flex-1">

                  <p className="text-sm font-medium text-neutral-800">
                    {username}
                  </p>

                  <p className="text-xs text-neutral-400">
                    Customer conversation
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* ================= CHAT AREA ================= */}

      <div className="flex-1 flex flex-col bg-white">

        {/* CHAT HEADER */}

        <div className="px-8 py-5 border-b border-neutral-200 flex items-center gap-3">

          {selectedRoom && (
            <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium text-neutral-600">
              {selectedRoom.pelanggan?.username
                ?.charAt(0)
                .toUpperCase()}
            </div>
          )}

          <div>

            <p className="font-medium text-neutral-900">
              {selectedRoom
                ? selectedRoom.pelanggan?.username
                : "Select conversation"}
            </p>

            <p className="text-xs text-neutral-400">
              Floraless Customer Support
            </p>

          </div>

        </div>

        {/* MESSAGES */}

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
                    className={`max-w-[60%] px-4 py-3 text-sm rounded-2xl shadow-sm break-words
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
            <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
              Select a conversation to start chatting
            </div>
          )}

          <div ref={bottomRef} />

        </div>

        {/* INPUT */}

        {selectedRoom && (

          <div className="px-8 py-5 border-t border-neutral-200 bg-white">

            <div className="flex gap-4">

              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-neutral-100 rounded-lg px-4 py-3 text-sm focus:outline-none"
              />

              <button
                onClick={sendMessage}
                className="bg-[#C9AE63] text-white px-6 py-3 rounded-lg text-sm hover:opacity-90 transition"
              >
                Send
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}