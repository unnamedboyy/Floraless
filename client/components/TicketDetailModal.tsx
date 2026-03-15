"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

type Ticket = {
  _id: string;
  status: string;
  info_acara?: string;
  createdAt?: string;
  tanggal_acara?: string;

  layanan?: {
    nama_layanan?: string;
    harga?: number;
  };
};

export default function TicketDetailModal({
  ticket,
  onClose,
}: {
  ticket: Ticket;
  onClose: () => void;
}) {

  const router = useRouter();

  const [detail, setDetail] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    async function load() {

      try {

        const data = await apiFetch(`/ticket/${ticket._id}`);
        setDetail(data);

        const pay = await apiFetch(`/pembayaran/summary/${ticket._id}`);
        setSummary(pay);

      } catch (err) {
        console.error(err);
      }

    }

    load();

  }, [ticket]);

  function goPayment(type: string) {

    router.push(
      `/user/payments?ticket=${ticket._id}&type=${type}`
    );

  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-8 w-full max-w-lg space-y-6 shadow-xl">

        <h2 className="text-xl font-semibold">
          Detail Booking
        </h2>

        {!detail && (
          <p className="text-sm text-neutral-500">
            Memuat data...
          </p>
        )}

        {detail && (
          <div className="space-y-3 text-sm">

            <p>
              <span className="text-neutral-500">ID Ticket</span>
              <br />
              #{ticket._id.slice(-6)}
            </p>

            <p>
              <span className="text-neutral-500">Layanan</span>
              <br />
              {detail.ticket.layanan?.nama_layanan}
            </p>

            <p>
              <span className="text-neutral-500">Status</span>
              <br />
              {detail.ticket.status}
            </p>

            <p>
              <span className="text-neutral-500">Info Acara</span>
              <br />
              {detail.ticket.info_acara || "-"}
            </p>

            {detail.jadwal?.map((j: any, i: number) => (

              <p key={i}>
                <span className="text-neutral-500">
                  Tanggal Acara
                </span>
                <br />

                {new Date(
                  j.tanggal_acara
                ).toLocaleDateString("id-ID")}

              </p>

            ))}

          </div>
        )}

        {/* PAYMENT SUMMARY */}

        {summary && (

          <div className="border-t pt-4 space-y-3 text-sm">

            <h3 className="font-medium">
              Progress Pembayaran
            </h3>

            <p>
              Total Harga
              <br />
              Rp {summary.total_harga?.toLocaleString()}
            </p>

            <p>
              Sudah Dibayar
              <br />
              Rp {summary.total_dibayar?.toLocaleString()}
            </p>

            <p>
              Sisa
              <br />
              Rp {summary.sisa?.toLocaleString()}
            </p>

            {/* BUTTON PEMBAYARAN */}

            <div className="flex gap-3 pt-3">

              {ticket.status === "approved" && (

                <button
                  onClick={() => goPayment("dp1")}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                >
                  Bayar DP1
                </button>

              )}

              {ticket.status === "dp1_verified" && (

                <button
                  onClick={() => goPayment("dp2")}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                >
                  Bayar DP2
                </button>

              )}

              {ticket.status === "dp2_verified" && (

                <button
                  onClick={() => goPayment("pelunasan")}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                >
                  Bayar Pelunasan
                </button>

              )}

            </div>

          </div>

        )}

        <div className="flex justify-end pt-4">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-neutral-100"
          >
            Tutup
          </button>

        </div>

      </div>

    </div>
  );
}