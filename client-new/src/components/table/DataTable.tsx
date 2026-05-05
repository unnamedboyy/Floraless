"use client";

import AvatarCell from "./AvatarCell";

type Column = {
  label: string;
  key: string;
};

type Props = {
  columns: Column[];
  data: any[];

  onView?: (row: any) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
};

export default function DataTable({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
}: Props) {
  /* ================= HELPER ================= */

  const getValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-xl border overflow-hidden">

      {/* HEADER */}
      <div className="grid grid-cols-12 px-4 py-3 text-sm font-medium text-gray-500 border-b">
        {columns.map((col) => (
          <div key={col.key} className="col-span-4">
            {col.label}
          </div>
        ))}

        {(onView || onEdit || onDelete) && (
          <div className="col-span-4 text-right">Action</div>
        )}
      </div>

      {/* BODY */}
      {data.map((row, i) => (
        <div
          key={i}
          className="grid grid-cols-12 px-4 py-3 items-center border-b hover:bg-gray-50"
        >
          {columns.map((col) => {
            const value = getValue(row, col.key);

            return (
              <div key={col.key} className="col-span-4 text-sm">

                {/* 🔥 KHUSUS NAMA → PAKAI AVATAR */}
                {col.key === "nama" ? (
                  <AvatarCell
                    name={value || row.userId?.username}
                  />
                ) : (
                  value || "-"
                )}

              </div>
            );
          })}

          {/* ACTION */}
          {(onView || onEdit || onDelete) && (
            <div className="col-span-4 text-right text-sm space-x-2">

              {onView && (
                <button
                  onClick={() => onView(row)}
                  className="text-blue-500"
                >
                  Detail
                </button>
              )}

              {onEdit && (
                <button
                  onClick={() => onEdit(row)}
                  className="text-green-500"
                >
                  Edit
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(row)}
                  className="text-red-500"
                >
                  Delete
                </button>
              )}

            </div>
          )}
        </div>
      ))}

      {/* EMPTY */}
      {data.length === 0 && (
        <div className="p-6 text-center text-sm text-gray-500">
          Tidak ada data
        </div>
      )}
    </div>
  );
}