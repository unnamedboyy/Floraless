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
  title = "Detail",
}: Props) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[400px] shadow-lg">
        <h2 className="text-lg font-bold mb-4">{title}</h2>

        <div className="space-y-2 text-sm">
          <p>
            <b>Nama:</b> {data.nama}
          </p>

          <p>
            <b>No Telp:</b> {data.no_telp}
          </p>

          <hr className="my-2" />

          <p>
            <b>Username:</b> {data.userId?.username}
          </p>

          <p>
            <b>Role:</b> {data.userId?.role}
          </p>

          <p>
            <b>Status User:</b>{" "}
            {data.userId?.isActive ? "Aktif" : "Nonaktif"}
          </p>

          <p>
            <b>Status Data:</b>{" "}
            {data.isActive ? "Aktif" : "Nonaktif"}
          </p>

          <p>
            <b>Dibuat:</b>{" "}
            {data.userId?.createdAt
              ? new Date(data.userId.createdAt).toLocaleString()
              : "-"}
          </p>

          <p>
            <b>Update:</b>{" "}
            {data.userId?.updatedAt
              ? new Date(data.userId.updatedAt).toLocaleString()
              : "-"}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-black text-white px-4 py-2 rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}