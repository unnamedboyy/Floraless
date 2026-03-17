"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Ticket,
  CreditCard,
  Info,
  CircleDollarSign
} from "lucide-react";

type TicketType = {
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
  ticket: TicketType;
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

    router.push(`/user/payments?ticket=${ticket._id}&type=${type}`);

  }



  function formatRupiah(value: number) {

    return `Rp ${value?.toLocaleString("id-ID")}`;

  }



  const progress =
    summary && summary.total_harga
      ? (summary.total_dibayar / summary.total_harga) * 100
      : 0;



  function statusBadge(status: string) {

    switch (status) {

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "approved":
        return "bg-blue-100 text-blue-700";

      case "dp1_paid":
      case "dp2_paid":
        return "bg-purple-100 text-purple-700";

      case "fully_paid":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-neutral-100 text-neutral-600";

    }

  }



  return (

    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="px-8 py-6 border-b">

          <h2 className="text-xl font-semibold">
            Detail Booking
          </h2>

          <p className="text-sm text-neutral-500 mt-1">
            Informasi lengkap pesanan Anda
          </p>

        </div>



        <div className="p-8 space-y-8">


          {/* DETAIL BOOKING */}
          <div className="space-y-5">

            <h3 className="font-medium text-sm text-neutral-500 tracking-wide">
              INFORMASI BOOKING
            </h3>


            {!detail && (
              <p className="text-sm text-neutral-400">
                Memuat data...
              </p>
            )}


            {detail && (

              <div className="grid grid-cols-2 gap-y-5 text-sm">


                <div className="space-y-1">
                  <p className="text-neutral-500 flex items-center gap-2">
                    <Ticket size={14} />
                    ID Ticket
                  </p>

                  <p className="font-medium">
                    #{ticket._id.slice(-6)}
                  </p>
                </div>


                <div className="space-y-1">
                  <p className="text-neutral-500">
                    Status
                  </p>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${statusBadge(
                      detail.ticket.status
                    )}`}
                  >
                    {detail.ticket.status}
                  </span>
                </div>


                <div className="space-y-1">
                  <p className="text-neutral-500">
                    Layanan
                  </p>

                  <p className="font-medium">
                    {detail.ticket.layanan?.nama_layanan}
                  </p>
                </div>


                <div className="space-y-1">
                  <p className="text-neutral-500 flex items-center gap-2">
                    <CalendarDays size={14} />
                    Tanggal Acara
                  </p>

                  {detail.jadwal?.map((j: any, i: number) => (

                    <p key={i} className="font-medium">
                      {new Date(j.tanggal_acara).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>

                  ))}

                </div>


                <div className="col-span-2 space-y-1">

                  <p className="text-neutral-500 flex items-center gap-2">
                    <Info size={14} />
                    Info Acara
                  </p>

                  <p className="font-medium">
                    {detail.ticket.info_acara || "-"}
                  </p>

                </div>

              </div>

            )}

          </div>



          {/* PAYMENT */}
          {summary && (

            <div className="space-y-5 border-t pt-6">

              <h3 className="font-medium text-sm text-neutral-500 tracking-wide">
                PROGRESS PEMBAYARAN
              </h3>


              <div className="space-y-4 text-sm">

                <div className="flex justify-between">
                  <span className="text-neutral-500">
                    Total Harga
                  </span>
                  <span className="font-medium">
                    {formatRupiah(summary.total_harga)}
                  </span>
                </div>


                <div className="flex justify-between">
                  <span className="text-neutral-500">
                    Sudah Dibayar
                  </span>
                  <span className="font-medium">
                    {formatRupiah(summary.total_dibayar)}
                  </span>
                </div>


                <div className="flex justify-between">
                  <span className="text-neutral-500">
                    Sisa
                  </span>
                  <span className="font-medium text-red-500">
                    {formatRupiah(summary.sisa)}
                  </span>
                </div>


                {/* PROGRESS BAR */}
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">

                  <div
                    className="bg-[#C9AE63] h-full transition-all"
                    style={{ width: `${progress}%` }}
                  />

                </div>


                <p className="text-xs text-neutral-400 text-right">
                  {progress.toFixed(0)}% pembayaran selesai
                </p>

              </div>



              {/* BUTTONS */}
              <div className="flex gap-3 pt-4">

                {ticket.status === "approved" && (

                  <button
                    onClick={() => goPayment("dp1")}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90"
                  >
                    <CreditCard size={16} />
                    Bayar DP1
                  </button>

                )}

                {ticket.status === "dp1_verified" && (

                  <button
                    onClick={() => goPayment("dp2")}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90"
                  >
                    <CreditCard size={16} />
                    Bayar DP2
                  </button>

                )}

                {ticket.status === "dp2_verified" && (

                  <button
                    onClick={() => goPayment("pelunasan")}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90"
                  >
                    <CircleDollarSign size={16} />
                    Bayar Pelunasan
                  </button>

                )}

              </div>

            </div>

          )}

        </div>



        {/* FOOTER */}
        <div className="px-8 py-5 border-t flex justify-end">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg text-sm hover:bg-neutral-100 transition"
          >
            Tutup
          </button>

        </div>

      </div>

    </div>

  );

}