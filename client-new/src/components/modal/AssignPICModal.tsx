"use client";

import { useEffect, useState } from "react";
import { getPegawaiList } from "@/services/pegawai.service";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (pegawaiId: string) => void;
};

export default function AssignPICModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [pegawai, setPegawai] = useState<any[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (open) {
      fetchPegawai();
    }
  }, [open]);

  const fetchPegawai = async () => {
    const res = await getPegawaiList();
    setPegawai(res.data.data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px] space-y-3">
        <h2 className="font-bold">Assign PIC</h2>

        <select
          className="border p-2 w-full"
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Pilih Pegawai</option>
          {pegawai.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nama}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => onSubmit(selected)}
            className="bg-black text-white px-4 py-2 w-full"
          >
            Simpan
          </button>

          <button
            onClick={onClose}
            className="border px-4 py-2 w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}