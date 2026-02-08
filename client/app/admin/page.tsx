"use client";

import { useState } from "react";

export default function AdminPage() {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  const blockDate = async () => {
    await fetch("http://localhost:5000/api/calendar-blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, reason })
    });
    alert("Tanggal diblock");
  };

  const unblockDate = async () => {
    await fetch(`http://localhost:5000/api/calendar-blocks/${date}`, {
      method: "DELETE"
    });
    alert("Tanggal dibuka");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Calendar Block</h1>

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="border p-2 mr-2"
      />

      <input
        placeholder="Alasan"
        value={reason}
        onChange={e => setReason(e.target.value)}
        className="border p-2 mr-2"
      />

      <button onClick={blockDate} className="bg-red-500 text-white px-4 py-2 mr-2">
        Block
      </button>

      <button onClick={unblockDate} className="bg-green-500 text-white px-4 py-2">
        Unblock
      </button>
    </div>
  );
}
