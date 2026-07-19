"use client";

import {
  CalendarDays,
  MapPin,
  User2,
  ClipboardList,
  Clock3,
  X,
  FileText,
} from "lucide-react";

import BaseModal from "@/components/form/BaseModal";

/* =========================================================
   TYPES
========================================================= */

interface Props {

  open: boolean;

  onClose: () => void;

  data: any;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function DetailJadwalModal({

  open,

  onClose,

  data

}: Props) {

  if (!open || !data) return null;

  /* =====================================================
     STATUS STYLE
  ===================================================== */

  const statusMap: any = {

    available: {

      label: "Available",

      className: `

        bg-emerald-50
        border-emerald-200
        text-emerald-700
      `,
    },

    booked: {

      label: "Booked",

      className: `

        bg-amber-50
        border-amber-200
        text-amber-700
      `,
    },

    ongoing: {

      label: "Ongoing",

      className: `

        bg-blue-50
        border-blue-200
        text-blue-700
      `,
    },

    done: {

      label: "Done",

      className: `

        bg-slate-100
        border-slate-200
        text-slate-700
      `,
    },
  };

  const currentStatus =

    statusMap[data.status] ||

    statusMap.available;

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formattedDate =

    data.tanggal_acara

      ? new Date(
          data.tanggal_acara
        )

        .toLocaleDateString(

          "id-ID",

          {

            weekday: "long",

            year: "numeric",

            month: "long",

            day: "numeric",
          }
        )

      : "-";

  /* =====================================================
     RESOLVE DETAIL ACARA
     (fallback ke DetailTicket jika data jadwal
     tidak membawa field ini secara langsung)
  ===================================================== */

  const namaAcara =
    data.nama_acara ||
    data.title ||
    data.ticketId?.detail?.nama_acara ||
    data.ticketId?.layananId?.nama ||
    "-";

  const lokasiAcara =
    data.lokasi ||
    data.ticketId?.detail?.lokasi ||
    "-";

  const jamAcara =
    data.jam_mulai && data.jam_selesai
      ? `${data.jam_mulai} - ${data.jam_selesai}`
      : data.ticketId?.detail?.jam_mulai &&
        data.ticketId?.detail?.jam_selesai
      ? `${data.ticketId.detail.jam_mulai} - ${data.ticketId.detail.jam_selesai}`
      : "-";

  const catatanAcara =
    data.catatan ||
    data.ticketId?.detail?.catatan ||
    "Belum ada catatan";

  /* =====================================================
     UI
  ===================================================== */

  return (

    <BaseModal

      open={open}

      onClose={onClose}

      maxWidth="max-w-4xl"
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="

        px-8
        py-7

        border-b
        border-slate-200

        flex
        items-start
        justify-between

      ">

        <div>

          <div className="

            flex
            items-center

            gap-3
            flex-wrap

          ">

            <h2 className="

              text-[38px]
              leading-none

              font-bold

              tracking-tight

              text-[#0F172A]

            ">

              Detail{" "}

              <span className="
                text-[#C9AE63]
              ">
                jadwal
              </span>

            </h2>


          </div>

          <p className="
            text-slate-500
            text-sm
            mt-3
          ">
            Informasi lengkap jadwal acara dan penugasan
          </p>

        </div>

        <button

          onClick={onClose}

          className="

            w-12
            h-12

            rounded-2xl

            border
            border-slate-200

            flex
            items-center
            justify-center

            text-slate-500

            hover:bg-slate-100

            transition

          "
        >

          <X size={20} />

        </button>

      </div>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="

        px-8
        py-8

        space-y-7

        overflow-y-auto

      ">

        {/* =====================================================
            DETAIL ACARA
        ===================================================== */}

        <Section title="Detail Acara">

          <div className="

            grid
            grid-cols-1
            md:grid-cols-2

            gap-5

          ">

            <FieldCard

              icon={
                <ClipboardList
                  size={18}
                />
              }

              label="Nama Acara"

              value={namaAcara}
            />

            <FieldCard

              icon={
                <MapPin
                  size={18}
                />
              }

              label="Lokasi"

              value={lokasiAcara}
            />

            <FieldCard

              icon={
                <CalendarDays
                  size={18}
                />
              }

              label="Tanggal Acara"

              value={
                formattedDate
              }
            />

            <FieldCard

              icon={
                <Clock3
                  size={18}
                />
              }

              label="Jam Acara"

              value={jamAcara}
            />

            <div className="md:col-span-2">

              <FieldCard

                icon={
                  <FileText
                    size={18}
                  />
                }

                label="Catatan"

                value={catatanAcara}

                multiline
              />

            </div>

          </div>

        </Section>

        {/* =====================================================
            PENUGASAN
        ===================================================== */}

        <Section title="Penugasan">

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">

            <FieldCard

              icon={
                <User2
                  size={18}
                />
              }

              label="Pegawai"

              value={
                data.pegawaiId
                  ?.nama || "-"
              }
            />

          </div>

        </Section>

        {/* =====================================================
            TIMESTAMP
        ===================================================== */}

        <div className="

          rounded-[30px]

          border
          border-blue-200

          bg-blue-50

          p-5

          flex
          items-start

          gap-4

        ">

          <div className="

            w-11
            h-11

            rounded-2xl

            bg-blue-100

            flex
            items-center
            justify-center

            text-blue-700

            shrink-0

          ">

            <Clock3 size={20} />

          </div>

          <div>

            <h4 className="

              text-sm
              font-semibold

              text-blue-900

            ">
              Informasi Jadwal
            </h4>

            <p className="

              text-sm

              text-blue-700

              mt-1

              leading-relaxed

            ">

              Dibuat pada{" "}

              {

                data.createdAt

                  ? new Date(
                      data.createdAt
                    )

                    .toLocaleString(
                      "id-ID"
                    )

                  : "-"
              }

            </p>

          </div>

        </div>

      </div>

    </BaseModal>
  );
}

/* =========================================================
   SECTION
========================================================= */

function Section({

  title,

  children,

}: any) {

  return (

    <div className="

      border
      border-slate-200

      rounded-[30px]

      p-6

      bg-white

      space-y-5

    ">

      <h3 className="

        text-xl
        font-bold

        text-[#0F172A]

      ">
        {title}
      </h3>

      {children}

    </div>
  );
}

/* =========================================================
   FIELD CARD
========================================================= */

function FieldCard({

  label,

  value,

  icon,

  multiline = false,

}: any) {

  return (

    <div className="

      border
      border-slate-200

      rounded-2xl

      p-5

      bg-slate-50/70

      space-y-3

    ">

      <div className="

        flex
        items-center

        gap-2

        text-slate-500

      ">

        {icon}

        <span className="
          text-sm
          font-medium
        ">
          {label}
        </span>

      </div>

      <div className={`

        text-[15px]
        font-semibold

        text-slate-900

        ${
          multiline
            ? "leading-relaxed whitespace-pre-wrap"
            : ""
        }

      `}>

        {value}

      </div>

    </div>
  );
}