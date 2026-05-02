"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: any;
  setForm: (val: any) => void;
  isEdit?: boolean;
};

export default function LayananFormModal({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  isEdit
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 w-96 rounded shadow">
        <h2 className="font-bold mb-4">
          {isEdit ? "Edit Layanan" : "Tambah Layanan"}
        </h2>

        <input
          placeholder="Nama"
          className="border w-full mb-2 p-2"
          value={form.nama}
          onChange={(e) =>
            setForm({ ...form, nama: e.target.value })
          }
        />

        <input
          placeholder="Harga"
          type="number"
          className="border w-full mb-2 p-2"
          value={form.harga}
          onChange={(e) =>
            setForm({ ...form, harga: e.target.value })
          }
        />

        <textarea
          placeholder="Deskripsi"
          className="border w-full mb-2 p-2"
          value={form.deskripsi}
          onChange={(e) =>
            setForm({ ...form, deskripsi: e.target.value })
          }
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Batal
          </button>

          <button
            onClick={onSubmit}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}