"use client";

type Props = {
  data: any;
  onClose: () => void;
};

export default function LayananDetailModal({ data, onClose }: Props) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-96 rounded shadow">
        <h2 className="font-bold mb-4">Detail Layanan</h2>

        <p><b>Nama:</b> {data.nama}</p>
        <p><b>Harga:</b> Rp {data.harga}</p>
        <p><b>Deskripsi:</b> {data.deskripsi}</p>
        <p>
          <b>Status:</b>{" "}
          {data.isActive ? "Active" : "Non-active"}
        </p>

        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}