"use client";

interface Props {
  open: boolean;
  onClose: () => void;
  data: any;
}

export default function DetailJadwalModal({
  open,
  onClose,
  data
}: Props) {

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Detail Jadwal
          </h2>

          <button
            onClick={onClose}
            className="text-sm text-gray-500"
          >
            Tutup
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">

          <Field
            label="Title"
            value={
              data.title ||
              data.ticketId?.layananId?.nama ||
              "-"
            }
          />

          <Field
            label="Tanggal"
            value={
              data.tanggal_acara
                ? new Date(
                    data.tanggal_acara
                  ).toLocaleDateString()
                : "-"
            }
          />

          <Field
            label="Lokasi"
            value={data.lokasi || "-"}
          />

          <Field
            label="Status"
            value={data.status || "-"}
          />

          <Field
            label="Pegawai"
            value={data.pegawaiId?.nama || "-"}
          />

          <Field
            label="Ticket"
            value={data.ticketId?._id || "-"}
          />

        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value
}: any) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">
        {label}
      </div>

      <div className="text-sm font-medium">
        {value}
      </div>
    </div>
  );
}