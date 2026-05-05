"use client";

import { useState } from "react";
import TableWrapper from "@/components/table/TableWrapper";
import { useReviews } from "@/hooks/useReviews";

export default function ReviewPage() {
  /* ================= STATE ================= */

  const { data = [], loading, toggle, remove } = useReviews();

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const [layananFilter, setLayananFilter] = useState("");

  /* ================= DATA ================= */

  // 🔥 list layanan unik
  const layananList = Array.from(
    new Set(
      data
        .map((r: any) => r.ticketId?.layananId?.nama)
        .filter(Boolean)
    )
  );

  // 🔥 filter
  const filtered = data.filter((r: any) => {
    const search = query.search.toLowerCase();

    const matchSearch =
      r.komentar?.toLowerCase().includes(search) ||
      r.pelangganId?.nama?.toLowerCase().includes(search);

    const matchLayanan =
      !layananFilter ||
      r.ticketId?.layananId?.nama === layananFilter;

    return matchSearch && matchLayanan;
  });

  const total = filtered.length;

  /* ================= HANDLER ================= */

  const handleDelete = (row: any) => {
    if (!confirm("Yakin hapus review?")) return;
    remove(row._id);
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <h1 className="text-xl font-semibold">
        Kelola Review
      </h1>

      {/* FILTER TAMBAHAN */}
      <div className="flex gap-3">
        <select
          className="border px-3 py-2 rounded-xl text-sm"
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

      {/* TABLE SYSTEM */}
      <TableWrapper
        data={filtered}
        total={total}
        query={query}
        setQuery={setQuery}

        columns={[
          { label: "Pelanggan", key: "pelangganId.nama" },
          { label: "Layanan", key: "ticketId.layananId.nama" },
          { label: "Rating", key: "rating" },
          { label: "Komentar", key: "komentar" },
          { label: "Tanggal", key: "createdAt" },
        ]}

        actions={[
          {
            label: "Toggle",
            onClick: (row) => toggle(row._id),
          },
          {
            label: "Delete",
            onClick: handleDelete,
          },
        ]}

        renderItem={(row) => (
          <div className="bg-white border rounded-xl p-4 space-y-2">
            <p className="font-semibold">
              {row.pelangganId?.nama || "-"}
            </p>

            <p className="text-sm text-gray-500">
              {row.ticketId?.layananId?.nama || "-"}
            </p>

            <p className="text-sm">
              ⭐ {row.rating}
            </p>

            <p className="text-xs text-gray-500 line-clamp-2">
              {row.komentar}
            </p>

            <span
              className={`inline-block px-2 py-1 rounded text-xs ${
                row.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {row.isActive ? "Active" : "Non-active"}
            </span>
          </div>
        )}
      />

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      )}

    </div>
  );
}