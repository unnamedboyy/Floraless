"use client";

import { Search, Filter, Download } from "lucide-react";

type Props = {
  view: "list" | "grid";
  setView: (v: "list" | "grid") => void;
  onSearch?: (value: string) => void; // ✅ TAMBAH INI
};

export default function TableToolbar({
  view,
  setView,
  onSearch, // ✅ TERIMA DI SINI
}: Props) {
  return (
    <div className="flex items-center justify-between mb-4">

      {/* LEFT */}
      <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 w-[250px]">
        <Search size={16} className="text-gray-400" />

        <input
          placeholder="Search..."
          onChange={(e) => onSearch?.(e.target.value)} // ✅ AMAN
          className="outline-none text-sm w-full"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        <button className="flex items-center gap-2 px-3 py-2 border rounded-xl text-sm hover:bg-gray-50">
          <Filter size={16} /> Filter
        </button>

        <button className="flex items-center gap-2 px-3 py-2 border rounded-xl text-sm hover:bg-gray-50">
          <Download size={16} /> Export
        </button>

        {/* TOGGLE VIEW */}
        <div className="flex border rounded-xl overflow-hidden">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-2 text-sm ${
              view === "list" ? "bg-black text-white" : ""
            }`}
          >
            List
          </button>

          <button
            onClick={() => setView("grid")}
            className={`px-3 py-2 text-sm ${
              view === "grid" ? "bg-black text-white" : ""
            }`}
          >
            Grid
          </button>
        </div>

      </div>
    </div>
  );
}