"use client";

import { useState } from "react";
import { useReviews } from "@/hooks/useReviews";

export default function ReviewPage() {
  const { data, loading, toggle, remove } = useReviews(); // ✅ FIX DI SINI

  const [search, setSearch] = useState("");
  const [layananFilter, setLayananFilter] = useState("");

  // ambil list layanan unik
  const layananList = Array.from(
    new Set(
      data
        .map((r: any) => r.ticketId?.layananId?.nama)
        .filter(Boolean)
    )
  );

  const filtered = data.filter((r: any) => {
    const matchSearch =
      r.komentar?.toLowerCase().includes(search.toLowerCase()) ||
      r.pelangganId?.nama?.toLowerCase().includes(search.toLowerCase());

    const matchLayanan =
      !layananFilter ||
      r.ticketId?.layananId?.nama === layananFilter;

    return matchSearch && matchLayanan;
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Kelola Review</h1>

      {/* FILTER */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search komentar / nama..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          value={layananFilter}
          onChange={(e) => setLayananFilter(e.target.value)}
        >
          <option value="">Semua Layanan</option>
          {layananList.map((l: any) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Pelanggan</th>
              <th className="p-2">Layanan</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Komentar</th>
              <th className="p-2">Status</th>
              <th className="p-2">Tanggal</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              filtered.map((r: any) => (
                <tr key={r._id} className="border-t">
                  <td className="p-2">
                    {r.pelangganId?.nama || "-"}
                  </td>

                  <td className="p-2">
                    {r.ticketId?.layananId?.nama || "-"}
                  </td>

                  <td className="p-2">⭐ {r.rating}</td>

                  <td className="p-2">{r.komentar}</td>

                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        r.isActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      {r.isActive ? "Active" : "Non-active"}
                    </span>
                  </td>

                  <td className="p-2">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => toggle(r._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Toggle
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Yakin hapus review?")) {
                          remove(r._id);
                        }
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}