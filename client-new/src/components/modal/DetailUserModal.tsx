"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  data: any;
  title?: string;
};

export default function DetailUserModal({
  open,
  onClose,
  data,
  title = "Detail User",
}: Props) {

  if (!open || !data) return null;

  const badgeClass = (active: boolean) =>
    active
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      {/* CARD */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* HEADER */}
        <div className="border-b px-6 py-5 flex items-start justify-between">

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Informasi lengkap pengguna
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

          {/* PROFILE */}
          <div className="flex items-center gap-4">

            <div className="
              w-16 h-16
              rounded-2xl
              bg-black
              text-white
              flex items-center justify-center
              text-2xl font-semibold
            ">
              {data.nama?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="space-y-1">

              <h3 className="text-lg font-semibold text-gray-900">
                {data.nama || "-"}
              </h3>

              <p className="text-sm text-gray-500">
                {data.no_telp || "-"}
              </p>

              <div className="flex gap-2 pt-1">

                <span
                  className={`
                    px-3 py-1 rounded-full text-xs border font-medium
                    ${badgeClass(data.userId?.isActive)}
                  `}
                >
                  {data.userId?.isActive
                    ? "User Aktif"
                    : "User Nonaktif"}
                </span>

                <span
                  className={`
                    px-3 py-1 rounded-full text-xs border font-medium
                    ${badgeClass(data.isActive)}
                  `}
                >
                  {data.isActive
                    ? "Data Aktif"
                    : "Data Nonaktif"}
                </span>

              </div>

            </div>

          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Field
              label="Username"
              value={data.userId?.username}
            />

            <Field
              label="Role"
              value={data.userId?.role}
            />

            <Field
              label="Dibuat"
              value={
                data.userId?.createdAt
                  ? new Date(
                      data.userId.createdAt
                    ).toLocaleString()
                  : "-"
              }
            />

            <Field
              label="Terakhir Update"
              value={
                data.userId?.updatedAt
                  ? new Date(
                      data.userId.updatedAt
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