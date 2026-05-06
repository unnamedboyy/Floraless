"use client";

import { useEffect, useState } from "react";
import { getTicketFull } from "@/services/ticket.service";

type Props = {
  open: boolean;
  ticketId: string | null;
  onClose: () => void;
};

const formatRupiah = (num: number) =>
  "Rp " + (num || 0).toLocaleString("id-ID");

const getStatusBadge = (status: string) => {
  const map: any = {
    pending: "bg-gray-100 text-gray-700",
    approved: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-blue-100 text-blue-700",
    done: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return map[status] || "bg-gray-100 text-gray-700";
};

export default function TicketDetailModal({
  open,
  ticketId,
  onClose,
}: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && ticketId) {
      fetchDetail();
    }
  }, [open, ticketId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);

      const res = await getTicketFull(ticketId!);

      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal ambil detail");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const ticket = data?.ticket;
  const pelanggan = ticket?.pelangganId;
  const layanan = ticket?.layananId;
  const pegawai = ticket?.pegawaiId;

  const detail = data?.detail;
  const jadwal = data?.jadwal;
  const payments = data?.payments || [];
  const summary = data?.paymentSummary;
  const claims = data?.claims || [];
  const logs = data?.logs || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="
        w-full
        max-w-5xl
        max-h-[95vh]
        overflow-y-auto
        bg-white
        rounded-3xl
        shadow-2xl
        animate-in fade-in zoom-in-95 duration-200
      ">

        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-8 py-6 z-10">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Detail Ticket
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Informasi lengkap ticket pelanggan
              </p>
            </div>

            <button
              onClick={onClose}
              className="
                w-11 h-11
                rounded-2xl
                hover:bg-gray-100
                transition
                text-gray-500
                text-lg
              "
            >
              ✕
            </button>

          </div>

        </div>

        {/* LOADING */}
        {loading ? (
          <div className="p-8 text-sm text-gray-500">
            Loading...
          </div>
        ) : (

          <div className="p-8 space-y-6">

            {/* TOP */}
            <div className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-5
            ">

              {/* STATUS */}
              <div className="
                border rounded-3xl
                p-5
                bg-gray-50/70
              ">

                <p className="text-sm text-gray-500 mb-2">
                  Status Ticket
                </p>

                <span
                  className={`
                    inline-flex
                    px-3 py-1
                    rounded-xl
                    text-sm
                    font-medium
                    ${getStatusBadge(ticket?.status)}
                  `}
                >
                  {ticket?.status || "-"}
                </span>

                <p className="text-xs text-gray-400 mt-4">
                  Dibuat:
                </p>

                <p className="text-sm">
                  {ticket?.createdAt
                    ? new Date(
                        ticket.createdAt
                      ).toLocaleString()
                    : "-"}
                </p>

              </div>

              {/* PELANGGAN */}
              <div className="
                border rounded-3xl
                p-5
                bg-gray-50/70
              ">

                <h3 className="font-semibold text-gray-900">
                  Pelanggan
                </h3>

                <div className="mt-4 space-y-3 text-sm">

                  <div>
                    <p className="text-gray-500">
                      Nama
                    </p>

                    <p className="font-medium">
                      {pelanggan?.nama || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">
                      No Telp
                    </p>

                    <p className="font-medium">
                      {pelanggan?.no_telp || "-"}
                    </p>
                  </div>

                </div>

              </div>

              {/* PIC */}
              <div className="
                border rounded-3xl
                p-5
                bg-gray-50/70
              ">

                <h3 className="font-semibold text-gray-900">
                  PIC Pegawai
                </h3>

                <div className="mt-4 space-y-3 text-sm">

                  <div>
                    <p className="text-gray-500">
                      Nama Pegawai
                    </p>

                    <p className="font-medium">
                      {pegawai?.nama || "-"}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* LAYANAN */}
            <div className="
              border rounded-3xl
              p-6
              bg-gray-50/70
            ">

              <h3 className="font-semibold text-gray-900">
                Layanan
              </h3>

              <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
                mt-5
              ">

                <div>
                  <p className="text-sm text-gray-500">
                    Nama Layanan
                  </p>

                  <p className="font-medium mt-1">
                    {layanan?.nama || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Harga
                  </p>

                  <p className="font-semibold mt-1">
                    {formatRupiah(layanan?.harga)}
                  </p>
                </div>

              </div>

            </div>

            {/* DETAIL ACARA */}
            {detail && (
              <div className="
                border rounded-3xl
                p-6
                bg-gray-50/70
              ">

                <h3 className="font-semibold text-gray-900">
                  Detail Acara
                </h3>

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
                  mt-5
                ">

                  <div>
                    <p className="text-sm text-gray-500">
                      Nama Acara
                    </p>

                    <p className="font-medium mt-1">
                      {detail.nama_acara || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Tanggal Acara
                    </p>

                    <p className="font-medium mt-1">
                      {detail.tanggal_acara
                        ? new Date(
                            detail.tanggal_acara
                          ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">
                      Lokasi
                    </p>

                    <p className="font-medium mt-1">
                      {detail.lokasi || "-"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">
                      Catatan
                    </p>

                    <p className="font-medium mt-1">
                      {detail.catatan || "-"}
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* PAYMENT */}
            <div className="
              border rounded-3xl
              p-6
              bg-gray-50/70
            ">

              <div className="
                flex items-center justify-between
                mb-5
              ">

                <h3 className="font-semibold text-gray-900">
                  Pembayaran
                </h3>

                <span className="
                  text-xs
                  bg-black
                  text-white
                  px-3 py-1
                  rounded-xl
                ">
                  {payments.length} pembayaran
                </span>

              </div>

              <div className="space-y-3">

                {payments.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Belum ada pembayaran
                  </p>
                )}

                {payments.map((p: any) => (
                  <div
                    key={p._id}
                    className="
                      bg-white
                      border
                      rounded-2xl
                      p-4
                    "
                  >

                    <div className="
                      flex items-start justify-between
                    ">

                      <div>
                        <p className="font-medium">
                          {p.tipe}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {formatRupiah(p.jumlah)}
                        </p>
                      </div>

                      <span
                        className={`
                          px-3 py-1
                          rounded-xl
                          text-xs
                          font-medium
                          ${getStatusBadge(p.status)}
                        `}
                      >
                        {p.status}
                      </span>

                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* SUMMARY */}
            {summary && (
              <div className="
                border rounded-3xl
                p-6
                bg-gray-50/70
              ">

                <h3 className="font-semibold text-gray-900">
                  Ringkasan Pembayaran
                </h3>

                <div className="mt-5">

                  <div className="
                    w-full
                    h-3
                    bg-gray-200
                    rounded-full
                    overflow-hidden
                  ">

                    <div
                      className="
                        h-full
                        bg-green-500
                      "
                      style={{
                        width: `${
                          (summary.totalDibayar /
                            summary.totalHarga) *
                          100
                        }%`,
                      }}
                    />

                  </div>

                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-3
                    gap-4
                    mt-5
                  ">

                    <div>
                      <p className="text-sm text-gray-500">
                        Total Dibayar
                      </p>

                      <p className="font-semibold">
                        {formatRupiah(
                          summary.totalDibayar
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Total Harga
                      </p>

                      <p className="font-semibold">
                        {formatRupiah(
                          summary.totalHarga
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Sisa
                      </p>

                      <p className="font-semibold">
                        {formatRupiah(summary.sisa)}
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* FOOTER */}
            <div className="pt-2">

              <button
                onClick={onClose}
                className="
                  w-full
                  py-3
                  rounded-2xl
                  bg-black
                  text-white
                  text-sm
                  font-medium
                  hover:opacity-90
                  transition
                "
              >
                Tutup
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}