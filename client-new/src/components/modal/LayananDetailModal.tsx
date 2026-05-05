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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

        <h2 className="text-lg font-bold">
          Detail Layanan
        </h2>

        <div className="text-sm space-y-2">
          <p>
            <b>Nama:</b> {data.nama || "-"}
          </p>

          <p>
            <b>Harga:</b> {formatRupiah(data.harga)}
          </p>

          <p>
            <b>Deskripsi:</b> {data.deskripsi || "-"}
          </p>

          <p>
            <b>Status:</b>{" "}
            {data.isActive ? "Aktif" : "Nonaktif"}
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
          className="bg-black text-white w-full py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
}