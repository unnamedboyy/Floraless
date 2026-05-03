"use client";

import { useState } from "react";
import { useCashback } from "@/hooks/useCashback";
import {
  approveCashback,
  rejectCashback,
} from "@/services/cashback.service";
import CashbackDetailModal from "@/components/modal/CashbackDetailModal";

export default function CashbackPage() {
  const { data, reload } = useCashback();
  const [selected, setSelected] = useState<any>(null);

  const handleApprove = async (id: string, bukti: string) => {
    if (!bukti) return alert("Bukti wajib diisi");
    await approveCashback(id, bukti);
    reload();
    setSelected(null);
  };

  const handleReject = async (id: string, alasan: string) => {
    if (!alasan) return alert("Alasan wajib diisi");
    await rejectCashback(id, alasan);
    reload();
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Cashback Claim</h1>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th>Pelanggan</th>
            <th>Kode</th>
            <th>Bank</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row._id} className="border-t">
              <td>{row.pelangganId?.nama}</td>
              <td>{row.kode_voucher}</td>
              <td>{row.bank}</td>
              <td>{row.status}</td>

              <td>
                <button
                  onClick={() => setSelected(row)}
                  className="text-blue-500"
                >
                  Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CashbackDetailModal
        open={!!selected}
        data={selected}
        onClose={() => setSelected(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}