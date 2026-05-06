"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  data: any;
};

const formatRupiah = (num: number) =>
  "Rp " + (num || 0).toLocaleString("id-ID");

export default function DetailLayananModal({
  open,
  onClose,
  data,
}: Props) {

  if (!open || !data) return null;

  const statusClass = data.isActive
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-red-100 text-red-700 border-red-200";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      {/* CARD */}
      <div className="
        w-full
        max-w-2xl
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        animate-in fade-in zoom-in-95 duration-200
      ">

        {/* HEADER */}
        <div className="px-6 py-5 border-b flex items-start justify-between">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Detail Layanan
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Informasi lengkap layanan dekorasi
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              w-10 h-10
              rounded-2xl
              hover:bg-gray-100
              transition
              text-gray-500
            "
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* TOP */}
          <div className="flex items-start justify-between gap-4">

            <div className="space-y-2">

              <div className="text-2xl font-semibold text-gray-900">
                {data.nama || "-"}
              </div>

              <div className="text-3xl font-bold text-black">
                {formatRupiah(data.harga)}
              </div>

            </div>

            <div
              className={`
                px-4 py-2
                rounded-full
                border
                text-sm
                font-medium
                ${statusClass}
              `}
            >
              {data.isActive
                ? "Aktif"
                : "Nonaktif"}
            </div>

          </div>

          {/* DESKRIPSI */}
          <div className="
            border rounded-2xl
            p-5
            bg-gray-50/70
            space-y-2
          ">

            <div className="text-sm font-medium text-gray-700">
              Deskripsi
            </div>

            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {data.deskripsi || "-"}
            </div>

          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Field
              label="Dibuat"
              value={
                data.createdAt
                  ? new Date(
                      data.createdAt
                    ).toLocaleString()
                  : "-"
              }
            />

            <Field
              label="Terakhir Update"
              value={
                data.updatedAt
                  ? new Date(
                      data.updatedAt
                    ).toLocaleString()
                  : "-"
              }
            />

          </div>

        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-4 flex justify-end">

          <button
            onClick={onClose}
            className="
              px-5 py-2.5
              rounded-2xl
              bg-black
              text-white
              hover:opacity-90
              transition
              text-sm
              font-medium
            "
          >
            Tutup
          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
}: {
  label: string;
  value?: any;
}) {

  return (
    <div className="
      border rounded-2xl p-4
      bg-gray-50/70
      space-y-1
    ">

      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </div>

      <div className="text-sm font-semibold text-gray-900 break-words">
        {value || "-"}
      </div>

    </div>
  );
}