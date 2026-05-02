"use client";

import React from "react";

/* ================= TYPES ================= */

type Column<T> = {
  label: string;
  key: string; // 🔥 ubah ke string supaya support nested
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void; 
};

/* ================= HELPER ================= */

// 🔥 ambil value nested: "userId.username"
const getValue = (obj: any, path: string) => {
  return path.split(".").reduce((o, key) => o?.[key], obj);
};

/* ================= COMPONENT ================= */

export default function DataTable<T extends { _id: string }>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
}: Props<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        {/* HEADER */}
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className="p-3 text-left text-sm font-semibold"
              >
                {col.label}
              </th>
            ))}
            <th className="p-3 text-sm font-semibold">Action</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center p-4 text-gray-500"
              >
                Tidak ada data
              </td>
            </tr>
          )}

          {data.map((row) => (
            <tr key={row._id} className="border-t hover:bg-gray-50">
              {columns.map((col) => {
                const value = getValue(row, col.key);

                return (
                  <td key={col.key} className="p-3 text-sm">
                    {value !== undefined && value !== null
                      ? String(value)
                      : "-"}
                  </td>
                );
              })}

              {/* ACTION */}
              <td className="p-3 space-x-2">
                {onView && (
                  <button
                    onClick={() => onView(row)}
                    className="text-green-600 hover:underline"
                  >
                    Detail
                  </button>
                )}

                {onEdit && (
                  <button
                    onClick={() => onEdit(row)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => onDelete(row)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}