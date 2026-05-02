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

export default function TicketDetailModal({
  open,
  ticketId,
  onClose,
}: Props) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (open && ticketId) fetchDetail();
  }, [open, ticketId]);

  const fetchDetail = async () => {
    try {
      const res = await getTicketFull(ticketId!);
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal ambil detail");
    }
  };

  if (!open) return null;

  /* ================= MAPPING ================= */
  const ticket = data?.ticket;
  const pelanggan = ticket?.pelangganId;
  const layanan = ticket?.layananId;
  const pegawai = ticket?.pegawaiId;

  const detail = data?.detail;
  const jadwal = data?.jadwal;
  const payments = data?.payments;
  const summary = data?.paymentSummary;
  const claims = data?.claims;
  const logs = data?.logs;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-[750px] max-h-[90vh] overflow-y-auto space-y-5">

        <h2 className="text-xl font-bold">Detail Ticket</h2>

        {/* ================= INFO ================= */}
        <div>
          <p><b>Status:</b> {ticket?.status}</p>
          <p>
            <b>Tanggal:</b>{" "}
            {ticket?.createdAt &&
              new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>

        {/* ================= PELANGGAN ================= */}
        <div>
          <h3 className="font-semibold">Pelanggan</h3>
          <p>{pelanggan?.nama}</p>
          <p>{pelanggan?.no_telp}</p>
        </div>

        {/* ================= LAYANAN ================= */}
        <div>
          <h3 className="font-semibold">Layanan</h3>
          <p>{layanan?.nama}</p>
          <p>{formatRupiah(layanan?.harga)}</p>
        </div>

        {/* ================= PIC ================= */}
        <div>
          <h3 className="font-semibold">PIC</h3>
          <p>{pegawai?.nama || "-"}</p>
        </div>

        {/* ================= DETAIL ACARA ================= */}
        {detail && (
          <div>
            <h3 className="font-semibold">Detail Acara</h3>
            <p><b>Nama Acara:</b> {detail.nama_acara}</p>
            <p><b>Lokasi:</b> {detail.lokasi}</p>
            <p>
              <b>Tanggal Acara:</b>{" "}
              {detail.tanggal_acara &&
                new Date(detail.tanggal_acara).toLocaleDateString()}
            </p>
            <p><b>Catatan:</b> {detail.catatan || "-"}</p>
          </div>
        )}

        {/* ================= JADWAL ================= */}
        {jadwal && (
          <div>
            <h3 className="font-semibold">Jadwal</h3>
            <p>
              {jadwal.tanggal_acara &&
                new Date(jadwal.tanggal_acara).toLocaleDateString()}
            </p>
            <p>Status: {jadwal.status}</p>
          </div>
        )}

        {/* ================= PAYMENT LIST ================= */}
        {payments?.length > 0 && (
          <div>
            <h3 className="font-semibold">Pembayaran</h3>

            {payments.map((p: any) => (
              <div
                key={p._id}
                className="border p-3 rounded mb-2 bg-gray-50"
              >
                <p><b>Tipe:</b> {p.tipe}</p>
                <p><b>Jumlah:</b> {formatRupiah(p.jumlah)}</p>
                <p><b>Status:</b> {p.status}</p>
                <p>
                  <b>Approved:</b>{" "}
                  {p.approvedAt &&
                    new Date(p.approvedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ================= SUMMARY ================= */}
        {summary && (
          <div>
            <h3 className="font-semibold">Ringkasan Pembayaran</h3>

            <div className="w-full bg-gray-200 h-3 rounded mt-2">
              <div
                className="bg-green-500 h-3 rounded"
                style={{
                  width: `${
                    (summary.totalDibayar / summary.totalHarga) * 100
                  }%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm">
              {formatRupiah(summary.totalDibayar)} /{" "}
              {formatRupiah(summary.totalHarga)}
            </p>

            <p>Sisa: {formatRupiah(summary.sisa)}</p>
            <p>Status: {summary.status}</p>
          </div>
        )}

        {/* ================= CLAIM ================= */}
        {claims?.length > 0 && (
          <div>
            <h3 className="font-semibold">Claim Cashback</h3>

            {claims.map((c: any) => (
              <div key={c._id} className="border p-3 rounded mb-2">
                <p><b>Kode:</b> {c.kode_voucher}</p>
                <p><b>Nama Rek:</b> {c.nama_rekening}</p>
                <p><b>Bank:</b> {c.bank}</p>
                <p><b>Status:</b> {c.status}</p>
                <p>
                  <b>Bukti:</b>{" "}
                  <a
                    href={c.bukti_tf}
                    target="_blank"
                    className="text-blue-500"
                  >
                    Lihat
                  </a>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ================= LOG ================= */}
        {logs?.length > 0 && (
          <div>
            <h3 className="font-semibold">Timeline Aktivitas</h3>

            <div className="border-l pl-4 space-y-3">
              {logs.map((log: any) => (
                <div key={log._id} className="relative">
                  <div className="absolute -left-2 w-3 h-3 bg-blue-500 rounded-full" />

                  <p className="font-medium">{log.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CLOSE ================= */}
        <button
          onClick={onClose}
          className="bg-black text-white px-4 py-2 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}