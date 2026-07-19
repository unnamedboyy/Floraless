"use client";

import {
  CalendarDays,
  MapPin,
  User2,
  ClipboardList,
  Clock3,
  X,
  FileText,
  Activity,
  Calendar,
  Ticket,
} from "lucide-react";

import BaseModal from "@/components/form/BaseModal";

/* =========================================================
   TYPES
========================================================= */

interface Props {
  open: boolean;
  onClose: () => void;
  data: any;
  loading?: boolean; // Menambahkan support state loading
}

/* =========================================================
   STATUS STYLE MAP
========================================================= */

const statusMap: any = {
  available: {
    label: "Available",
    className: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  booked: {
    label: "Booked",
    className: "bg-amber-50 border-amber-200 text-amber-700",
  },
  ongoing: {
    label: "Ongoing",
    className: "bg-blue-50 border-blue-200 text-blue-700",
  },
  done: {
    label: "Done",
    className: "bg-slate-100 border-slate-200 text-slate-700",
  },
};

/* =========================================================
   COMPONENT
========================================================= */

export default function DetailJadwalModal({
  open,
  onClose,
  data,
  loading = false,
}: Props) {
  
  if (!open) return null;

  // Resolve status config jika data tersedia
  const currentStatus = data
    ? statusMap[data.status] || statusMap.available
    : statusMap.available;

  /* =====================================================
      FORMAT DATE
  ===================================================== */
  const formattedDate = data?.tanggal_acara
    ? new Date(data.tanggal_acara).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  /* =====================================================
      RESOLVE DETAIL ACARA & TICKET FALLBACKS
  ===================================================== */
  const namaAcara =
    data?.nama_acara ||
    data?.title ||
    data?.ticketId?.detail?.nama_acara ||
    data?.ticketId?.layananId?.nama ||
    "-";

  const jenisAcara = 
    data?.ticketId?.detail?.jenis_acara || 
    "-";

  const lokasiAcara = 
    data?.lokasi || 
    data?.ticketId?.detail?.lokasi || 
    "-";

  const jamAcara =
    data?.jam_mulai && data?.jam_selesai
      ? `${data.jam_mulai} - ${data.jam_selesai}`
      : data?.ticketId?.detail?.jam_mulai && data?.ticketId?.detail?.jam_selesai
      ? `${data.ticketId.detail.jam_mulai} - ${data.ticketId.detail.jam_selesai}`
      : "-";

  const catatanAcara =
    data?.catatan ||
    data?.ticketId?.detail?.catatan ||
    "Belum ada catatan";

  // Data tambahan dari ticket yang terkait penugasan jadwal
  const pelangganNama = data?.ticketId?.pelangganId?.nama || "-";
  const layananNama = data?.ticketId?.layananId?.nama || "-";

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="max-w-7xl"
      className="h-[94vh]"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="shrink-0 px-10 py-7 border-b border-gray-200 bg-[#FCFCFD]">
        <div className="flex items-start justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center gap-4 flex-wrap">
              <h2 className="text-[44px] leading-none tracking-tight font-bold text-[#0F172A]">
                Detail <span className="text-[#C9AE63]">Jadwal</span>
              </h2>

              {!loading && data && (
                <div className={`h-12 px-5 rounded-2xl flex items-center gap-2 text-[15px] font-semibold border shadow-sm ${currentStatus.className}`}>
                  <Activity size={16} />
                  {currentStatus.label}
                </div>
              )}
            </div>
            <p className="text-[16px] text-gray-500">
              Informasi lengkap jadwal acara dan penugasan pegawai
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-14 h-14 rounded-2xl border border-gray-300 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* =====================================================
          BODY
      ===================================================== */}
      <div className="flex-1 overflow-y-auto px-10 py-8 space-y-7 bg-[#FCFCFD]">
        
        {/* LOADING STATE */}
        {loading && (
          <div className="rounded-[28px] border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-[16px] font-medium text-gray-500">
              Loading detail jadwal...
            </p>
          </div>
        )}

        {/* DATA STATE */}
        {!loading && !data && (
          <div className="rounded-[28px] border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-[16px] font-medium text-gray-500">
              Data jadwal tidak ditemukan.
            </p>
          </div>
        )}

        {!loading && data && (
          <>
            {/* =====================================================
                HERO SECTION (SUMMARY JADWAL)
            ===================================================== */}
            <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                <div className="flex items-start gap-5">
                  <div className="w-24 h-24 rounded-[32px] bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <CalendarDays size={42} />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[38px] leading-tight font-bold text-[#0F172A]">
                        {namaAcara}
                      </h3>
                      <p className="mt-2 text-gray-500">
                        Agenda penugasan dan koordinasi lapangan
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium">
                        Pelanggan: {pelangganNama}
                      </div>
                      <div className="px-4 py-2 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-700 text-sm font-medium">
                        Layanan: {layananNama}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================
                DETAIL ACARA
            ===================================================== */}
            <Section title="Detail Acara">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldCard
                  icon={<ClipboardList size={18} />}
                  label="Nama Acara"
                  value={namaAcara}
                />
                <FieldCard
                  icon={<Ticket size={18} />}
                  label="Jenis Acara"
                  value={jenisAcara}
                />
                <FieldCard
                  icon={<MapPin size={18} />}
                  label="Lokasi"
                  value={lokasiAcara}
                />
                <FieldCard
                  icon={<Calendar size={18} />}
                  label="Tanggal Acara"
                  value={formattedDate}
                />
                <FieldCard
                  icon={<Clock3 size={18} />}
                  label="Jam Acara"
                  value={jamAcara}
                />
                <div className="md:col-span-2">
                  <FieldCard
                    icon={<FileText size={18} />}
                    label="Catatan"
                    value={catatanAcara}
                    multiline
                  />
                </div>
              </div>
            </Section>

            {/* =====================================================
                PENUGASAN PEGAWAI
            ===================================================== */}
            <Section title="Penugasan Tim">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldCard
                  icon={<User2 size={18} />}
                  label="Pegawai / PIC Utama"
                  value={data.pegawaiId?.nama || "-"}
                />
                <FieldCard
                  icon={<ClipboardList size={18} />}
                  label="Status Penugasan"
                  value={currentStatus.label}
                />
              </div>
            </Section>

            {/* =====================================================
                TIMESTAMP
            ===================================================== */}
            <div className="rounded-[30px] border border-blue-200 bg-blue-50 p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <Clock3 size={20} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900">
                  Informasi Sistem
                </h4>
                <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                  Jadwal ini dibuat pada{" "}
                  {data.createdAt
                    ? new Date(data.createdAt).toLocaleString("id-ID")
                    : "-"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </BaseModal>
  );
}

/* =========================================================
   SECTION SUB-COMPONENT
========================================================= */
function Section({ title, children }: any) {
  return (
    <div className="border border-slate-200 rounded-[30px] p-6 bg-white space-y-5">
      <h3 className="text-xl font-bold text-[#0F172A]">{title}</h3>
      {children}
    </div>
  );
}

/* =========================================================
   FIELD CARD SUB-COMPONENT
========================================================= */
function FieldCard({ label, value, icon, multiline = false }: any) {
  return (
    <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/70 space-y-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div
        className={`text-[15px] font-semibold text-slate-900 ${
          multiline ? "leading-relaxed whitespace-pre-wrap" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}