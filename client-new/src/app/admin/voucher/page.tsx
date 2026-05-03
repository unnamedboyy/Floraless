"use client";

import { useState } from "react";
import { useVoucher } from "@/hooks/useVoucher";
import {
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "@/services/voucher.service";
import VoucherFormModal from "@/components/modal/VoucherFormModal";

export default function VoucherPage() {
  const { data, reload } = useVoucher();

  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const handleSubmit = async (form: any) => {
    if (selected) {
      await updateVoucher(selected._id, form);
    } else {
      await createVoucher(form);
    }

    setOpenForm(false);
    setSelected(null);
    reload();
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Hapus voucher?")) return;
    await deleteVoucher(row._id);
    reload();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Voucher</h1>

      <button
        onClick={() => setOpenForm(true)}
        className="bg-black text-white px-4 py-2"
      >
        + Tambah Voucher
      </button>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th>Code</th>
            <th>Pelanggan</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Expired</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row._id} className="border-t">

              <td>{row.code}</td>
              <td>{row.pelangganId?.nama}</td>
              <td>Rp {row.amount?.toLocaleString()}</td>

              <td>
                {row.isUsed ? "Used" : "Available"}
              </td>

              <td>
                {row.expiredAt
                  ? new Date(row.expiredAt).toLocaleDateString()
                  : "-"}
              </td>

              <td className="space-x-2">
                <button
                  onClick={() => {
                    setSelected(row);
                    setOpenForm(true);
                  }}
                  className="text-blue-500"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(row)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <VoucherFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
        initialData={selected}
      />
    </div>
  );
}