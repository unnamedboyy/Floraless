"use client";

import { useCashback } from "@/hooks/useCashback";
import { processCashback } from "@/services/cashback.service";

export default function CashbackPage() {
  const { data, loading, reload } = useCashback();

  /* ================= ACTION ================= */

  const handleApprove = async (id: string) => {
    await processCashback(id, {
      status: "approved",
      bukti_tf: "https://dummy.com/bukti.jpg",
    });

    reload();
  };

  const handleReject = async (id: string) => {
    const alasan = prompt("Alasan penolakan?");
    if (!alasan) return;

    await processCashback(id, {
      status: "rejected",
      alasan,
    });

    reload();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">
        Verifikasi Cashback
      </h1>

      {/* ================= LOADING ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Pelanggan</th>
              <th>Kode Voucher</th>
              <th>Bank</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Tidak ada data
                </td>
              </tr>
            )}

            {data?.map((row: any) => (
              <tr key={row._id}>
                <td>{row.pelangganId?.nama || "-"}</td>
                <td>{row.kode_voucher}</td>
                <td>{row.bank}</td>
                <td>{row.status}</td>

                <td className="space-x-2">
                  {row.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleApprove(row._id)
                        }
                        className="text-green-600"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleReject(row._id)
                        }
                        className="text-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {row.status !== "pending" && "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}