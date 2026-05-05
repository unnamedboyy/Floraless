"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  data?: any;
};

export default function DetailJadwalModal({
  open,
  onClose,
  data,
}: Props) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">

        <h2 className="text-lg font-semibold">
          Detail Jadwal
        </h2>

        <div className="space-y-2 text-sm">

          <p>
            <b>Tanggal:</b>{" "}
            {data.tanggal_acara
              ? new Date(data.tanggal_acara).toLocaleDateString()
              : "-"}
          </p>

          <p>
            <b>Pegawai:</b>{" "}
            {data.pegawaiId?.nama || "-"}
          </p>

          <p>
            <b>Lokasi:</b>{" "}
            {data.lokasi || "-"}
          </p>

          <p>
            <b>Dibuat:</b>{" "}
            {data.createdAt
              ? new Date(data.createdAt).toLocaleString()
              : "-"}
          </p>

          <p>
            <b>Update:</b>{" "}
            {data.updatedAt
              ? new Date(data.updatedAt).toLocaleString()
              : "-"}
          </p>

        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-black text-white py-2 rounded"
        >
          Close
        </button>

      </div>
    </div>
  );
}