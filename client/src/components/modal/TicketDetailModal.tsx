"use client";

import { useEffect, useState,} from "react";
import api from "@/lib/axios";
import { saveAs } from "file-saver";

import {
  Calendar,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Ticket,
  User2,
  Wallet,
  X,
  XCircle,
  Camera,
  Activity,
  BadgeCheck,
} from "lucide-react";

import {
  getTicketFull,
} from "@/services/ticket.service";

import BaseModal from "@/components/form/BaseModal";

/* =====================================================
   TYPES
===================================================== */

type Props = {
  open: boolean;
  ticketId: string | null;
  onClose: () => void;
};

/* =====================================================
   HELPERS
===================================================== */

const formatRupiah = (
  num: number
) =>
  "Rp " +
  (num || 0).toLocaleString(
    "id-ID"
  );

const statusConfig = {

  pending: {

    label: "Pending",

    icon:
      <Clock3 size={16} />,

    className: `
      bg-gray-100
      text-gray-700
      border-gray-200
    `,
  },

  approved: {

    label: "Approved",

    icon:
      <BadgeCheck size={16} />,

    className: `
      bg-yellow-50
      text-yellow-700
      border-yellow-200
    `,
  },

  in_progress: {

    label: "In Progress",

    icon:
      <Clock3 size={16} />,

    className: `
      bg-blue-50
      text-blue-700
      border-blue-200
    `,
  },

  done: {

    label: "Done",

    icon:
      <CheckCircle2 size={16} />,

    className: `
      bg-emerald-50
      text-emerald-700
      border-emerald-200
    `,
  },

  rejected: {

    label: "Rejected",

    icon:
      <XCircle size={16} />,

    className: `
      bg-red-50
      text-red-700
      border-red-200
    `,
  },
};

const getLogActionConfig = (
  action: string
) => {
  const map: any = {
    CREATE_TICKET: {
      label: "Ticket Dibuat",
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
    },

    ASSIGN_PIC: {
      label: "Assign PIC",
      className:
        "bg-purple-50 text-purple-700 border-purple-200",
    },

    UPDATE_STATUS: {
      label: "Update Status",
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200",
    },

    UPDATE_PROGRESS: {
      label: "Update Progress",
      className:
        "bg-indigo-50 text-indigo-700 border-indigo-200",
    },

    CREATE_PAYMENT: {
      label: "Pembayaran",
      className:
        "bg-green-50 text-green-700 border-green-200",
    },
  };

  return (
    map[action] || {
      label: action,
      className:
        "bg-gray-50 text-gray-700 border-gray-200",
    }
  );
};

/* =====================================================
   COMPONENT
===================================================== */

export default function TicketDetailModal({
  open,
  ticketId,
  onClose,
}: Props) {

  /* =====================================================
     STATE
  ===================================================== */

  const [
    data,
    setData,
  ] = useState<any>(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  /* =====================================================
     FETCH
  ===================================================== */

  useEffect(() => {

    if (
      open &&
      ticketId
    ) {

      fetchDetail();
    }

  }, [open, ticketId]);

  const fetchDetail =
    async () => {

      try {

        setLoading(true);

        const res =
          await getTicketFull(
            ticketId!
          );

        setData(
          res.data
        );

      } catch (err) {

        console.error(err);

        alert(
          "Gagal ambil detail"
        );

      } finally {

        setLoading(false);
      }
    };

  /* =====================================================
     CLOSE
  ===================================================== */

  if (!open)
    return null;

  /* =====================================================
     DATA
  ===================================================== */

  const ticket =
    data?.ticket;

  const pelanggan =
    ticket?.pelangganId;

  const layanan =
    ticket?.layananId;

  const detail =
    data?.detail;

  const payments =
    data?.payments || [];

  const summary =
    data?.paymentSummary;

  const logs =
    data?.logs || [];

  const status =
    statusConfig[
      ticket?.status as keyof typeof statusConfig
    ] || statusConfig.pending;

  const progress =
    summary?.totalHarga > 0

      ? Math.min(
          (
            summary.totalDibayar /
            summary.totalHarga
          ) * 100,
          100
        )

      : 0;

  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="max-w-7xl"
      className="
        h-[94vh]
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="
        shrink-0
        px-10
        py-7
        border-b
        border-gray-200
        bg-[#FCFCFD]
      ">

        <div className="
          flex
          items-start
          justify-between
          gap-5
        ">

          <div className="
            space-y-3
          ">

            <div className="
              flex
              items-center
              gap-4
              flex-wrap
            ">

              <h2 className="
                text-[44px]
                leading-none
                tracking-tight
                font-bold
                text-[#0F172A]
              ">
                Ticket
              </h2>

              <div className={`
                h-12
                px-5
                rounded-2xl
                flex
                items-center
                gap-2
                text-[15px]
                font-semibold
                border
                shadow-sm

                ${status.className}
              `}>

                {status.icon}

                {status.label}

              </div>

            </div>

            <p className="
              text-[16px]
              text-gray-500
            ">
              Informasi lengkap ticket pelanggan
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              w-14 h-14
              rounded-2xl
              border
              border-gray-300
              bg-white
              flex
              items-center
              justify-center
              text-gray-500
              hover:bg-gray-50
              hover:text-gray-700
              transition-all
            "
          >
            <X size={24} />
          </button>

        </div>

      </div>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="
        flex-1
        overflow-y-auto
        px-10
        py-8
        space-y-7
        bg-[#FCFCFD]
      ">

        {/* LOADING */}
        {
          loading && (

            <div className="
              rounded-[28px]
              border
              border-gray-200
              bg-white
              p-10
              text-center
              shadow-sm
            ">

              <p className="
                text-[16px]
                font-medium
                text-gray-500
              ">
                Loading detail ticket...
              </p>

            </div>
          )
        }

        {
          !loading && (

            <>

              {/* HERO */}
              <div className="
                rounded-[28px]
                border
                border-gray-200
                bg-white
                p-8
                shadow-sm
              ">

                <div className="
                  flex
                  flex-col
                  xl:flex-row
                  xl:items-center
                  xl:justify-between
                  gap-8
                ">

                  <div className="
                    flex
                    items-start
                    gap-5
                  ">

                    <div className="
                      w-24
                      h-24
                      rounded-[32px]
                      bg-slate-100
                      text-slate-700
                      flex
                      items-center
                      justify-center
                      shrink-0
                    ">
                      <Camera size={42} />
                    </div>

                    <div className="
                      space-y-4
                    ">

                      <div>

                        <h3 className="
                          text-[38px]
                          leading-tight
                          font-bold
                          text-[#0F172A]
                        ">
                          {
                            layanan?.nama ||
                            "-"
                          }
                        </h3>

                        <p className="
                          mt-2
                          text-gray-500
                        ">
                          Ticket event pelanggan
                        </p>

                      </div>

                      <div className="
                        flex
                        items-center
                        gap-3
                        flex-wrap
                      ">

                        <div className="
                          px-4
                          py-2
                          rounded-2xl
                          bg-slate-100
                          border
                          border-slate-200
                          text-slate-700
                          text-sm
                          font-medium
                        ">

                          {
                            pelanggan?.nama ||
                            "-"
                          }

                        </div>

                        <div className="
                          px-4
                          py-2
                          rounded-2xl
                          bg-neutral-100
                          border
                          border-neutral-200
                          text-neutral-700
                          text-sm
                          font-medium
                        ">

                          {
                            formatRupiah(
                              layanan?.harga || 0
                            )
                          }

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* PAYMENT */}
                  <div className="
                    xl:w-[360px]
                    space-y-5
                  ">

                    <div className="
                      flex
                      items-center
                      justify-between
                    ">

                      <div>

                        <p className="
                          text-sm
                          text-gray-500
                        ">
                          Progress Pembayaran
                        </p>

                        <h3 className="
                          mt-1
                          text-[34px]
                          leading-none
                          font-bold
                          text-[#111827]
                        ">
                          {
                            progress.toFixed(
                              0
                            )
                          }%
                        </h3>

                      </div>

                      <div className="
                        w-16
                        h-16
                        rounded-3xl
                        bg-emerald-50
                        text-emerald-600
                        flex
                        items-center
                        justify-center
                      ">
                        <Wallet size={30} />
                      </div>

                    </div>

                    <div className="
                      w-full
                      h-4
                      rounded-full
                      overflow-hidden
                      bg-gray-200
                    ">

                      <div
                        style={{
                          width: `${progress}%`,
                        }}
                        className="
                          h-full
                          rounded-full
                          bg-[#111827]
                          transition-all
                          duration-500
                        "
                      />

                    </div>

                    <div className="
                      grid
                      grid-cols-2
                      gap-4
                    ">

                      <MiniSummary
                        label="Dibayar"
                        value={
                          formatRupiah(
                            summary?.totalDibayar || 0
                          )
                        }
                      />

                      <MiniSummary
                        label="Sisa"
                        value={
                          formatRupiah(
                            summary?.sisa || 0
                          )
                        }
                      />

                    </div>

                  </div>

                </div>

              </div>

              {/* INFORMASI */}
              <Section title="Informasi Ticket">

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
                ">

                  <Field
                    icon={
                      <User2 size={18} />
                    }
                    label="Pelanggan"
                    value={
                      pelanggan?.nama
                    }
                  />

                  <Field
                    icon={
                      <Camera size={18} />
                    }
                    label="Layanan"
                    value={
                      layanan?.nama
                    }
                  />

                  <Field
                    icon={
                      <Wallet size={18} />
                    }
                    label="Harga"
                    value={
                      formatRupiah(
                        layanan?.harga || 0
                      )
                    }
                  />

                </div>

              </Section>

              {/* DETAIL ACARA */}
              <Section title="Detail Acara">

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
                ">

                  <Field
                    icon={
                      <FileText size={18} />
                    }
                    label="Nama Acara"
                    value={
                      detail?.nama_acara
                    }
                  />

                  <Field
                    icon={
                      <Ticket size={18} />
                    }
                    label="Jenis Acara"
                    value={
                      detail?.jenis_acara
                    }
                  />

                  <Field
                    icon={
                      <MapPin size={18} />
                    }
                    label="Lokasi"
                    value={
                      detail?.lokasi
                    }
                  />

                  <Field
                    icon={
                      <Calendar size={18} />
                    }
                    label="Tanggal Acara"
                    value={
                      detail?.tanggal_acara

                        ? new Date(
                            detail.tanggal_acara
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )

                        : "-"
                    }
                  />

                  <Field
                    icon={
                      <Clock3 size={18} />
                    }
                    label="Jam Acara"
                    value={
                      detail?.jam_mulai && detail?.jam_selesai
                        ? `${detail.jam_mulai} - ${detail.jam_selesai}`
                        : "-"
                    }
                  />

                  <Field
                    icon={
                      <FileText size={18} />
                    }
                    label="Catatan"
                    value={
                      detail?.catatan
                    }
                    multiline
                  />

                </div>

              </Section>

              {/* PAYMENT SUMMARY */}
              <Section title="Payment Summary">

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-4
                  gap-5
                ">

                  <SummaryCard
                    icon={
                      <Wallet size={22} />
                    }
                    label="Total Harga"
                    value={
                      formatRupiah(
                        summary?.totalHarga || 0
                      )
                    }
                  />

                  <SummaryCard
                    icon={
                      <BadgeCheck size={22} />
                    }
                    label="Total Dibayar"
                    value={
                      formatRupiah(
                        summary?.totalDibayar || 0
                      )
                    }
                  />

                  <SummaryCard
                    icon={
                      <Clock3 size={22} />
                    }
                    label="Sisa Tagihan"
                    value={
                      formatRupiah(
                        summary?.sisa || 0
                      )
                    }
                  />

                  <SummaryCard
                    icon={
                      <Ticket size={22} />
                    }
                    label="Status"
                    value={
                      summary?.status || "-"
                    }
                  />

                </div>

              </Section>

              {/* PAYMENTS */}
              {
                payments.length >
                  0 && (

                  <Section title="Riwayat Pembayaran">

                    <div className="
                      space-y-5
                    ">

                      {
                        payments.map(
                          (
                            item: any
                          ) => {

                            const paymentStatus =
                              statusConfig[
                                item.status as keyof typeof statusConfig
                              ] ||
                              statusConfig.pending;

                            return (

                              <div
                                key={
                                  item._id
                                }
                                className="
                                  rounded-[28px]
                                  border
                                  border-gray-200
                                  bg-[#FCFCFD]
                                  p-6
                                "
                              >

                                <div className="
                                  flex
                                  flex-col
                                  lg:flex-row
                                  lg:items-start
                                  lg:justify-between
                                  gap-6
                                ">

                                  <div className="
                                    flex-1
                                    space-y-5
                                  ">

                                    <div className="
                                      flex
                                      items-center
                                      gap-3
                                      flex-wrap
                                    ">

                                      <h4 className="
                                        text-[24px]
                                        font-bold
                                        text-[#111827]
                                      ">

                                        {
                                          item.tipe
                                        }

                                      </h4>

                                      <div className={`
                                        px-4 py-2
                                        rounded-2xl
                                        border
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-medium

                                        ${paymentStatus.className}
                                      `}>

                                        {
                                          paymentStatus.icon
                                        }

                                        {
                                          paymentStatus.label
                                        }

                                      </div>

                                    </div>

                                    <div>

                                      <h3 className="
                                        text-[36px]
                                        leading-none
                                        font-bold
                                        text-[#0F172A]
                                      ">

                                        {
                                          formatRupiah(
                                            item.jumlah
                                          )
                                        }

                                      </h3>

                                      <p className="
                                        mt-3
                                        text-gray-500
                                      ">

                                        {
                                          item.createdAt

                                            ? new Date(
                                                item.createdAt
                                              ).toLocaleString(
                                                "id-ID"
                                              )

                                            : "-"
                                        }

                                      </p>

                                    </div>

                                    {
                                      item.catatan && (

                                        <div className="
                                          rounded-[24px]
                                          border
                                          border-gray-200
                                          bg-white
                                          p-5
                                          space-y-3
                                        ">

                                          <div className="
                                            flex
                                            items-center
                                            gap-2
                                            text-gray-500
                                          ">

                                            <FileText
                                              size={
                                                16
                                              }
                                            />

                                            <div className="
                                              text-xs
                                              font-semibold
                                              uppercase
                                              tracking-wider
                                            ">
                                              Catatan
                                            </div>

                                          </div>

                                          <p className="
                                            text-[15px]
                                            leading-7
                                            text-[#111827]
                                          ">

                                            {
                                              item.catatan
                                            }

                                          </p>

                                        </div>
                                      )
                                    }

                                  </div>

                                </div>

                              </div>
                            );
                          }
                        )
                      }

                    </div>

                  </Section>
                )
              }

              {/* LOGS */}
              {
                logs.length > 0 && (
                  <Section title="Activity Logs">
                    <div className="space-y-5">

                      {
                        logs.map((log: any) => {

                          const action =
                            getLogActionConfig(
                              log.action
                            );

                          return (

                            <div
                              key={log._id}
                              className="
                                rounded-[28px]
                                border
                                border-gray-200
                                bg-[#FCFCFD]
                                p-6
                              "
                            >

                              <div className="
                                flex
                                items-start
                                gap-4
                              ">

                                <div
                                  className={`
                                    w-14
                                    h-14
                                    rounded-2xl
                                    border
                                    flex
                                    items-center
                                    justify-center
                                    shrink-0

                                    ${
                                      log.action ===
                                      "UPDATE_PROGRESS"

                                        ? `
                                          bg-indigo-50
                                          text-indigo-600
                                          border-indigo-200
                                        `

                                        : `
                                          bg-white
                                          text-gray-500
                                          border-gray-200
                                        `
                                    }
                                  `}
                                >

                                  {
                                    log.action ===
                                    "UPDATE_PROGRESS"

                                      ? (
                                        <FileText
                                          size={22}
                                        />
                                      )

                                      : (
                                        <Activity
                                          size={22}
                                        />
                                      )
                                  }

                                </div>

                                <div className="
                                  flex-1
                                  space-y-3
                                ">

                                  <div className="
                                    flex
                                    items-center
                                    gap-3
                                    flex-wrap
                                  ">

                                    <span
                                      className={`
                                        px-3
                                        py-1.5
                                        rounded-xl
                                        border
                                        text-xs
                                        font-semibold

                                        ${action.className}
                                      `}
                                    >
                                      {action.label}
                                    </span>

                                    {
                                      log.userId?.nama && (

                                        <span className="
                                          text-sm
                                          text-gray-500
                                        ">
                                          oleh {log.userId.nama}
                                        </span>

                                      )
                                    }

                                  </div>

                                  <p className="
                                    text-[15px]
                                    leading-7
                                    text-gray-700
                                  ">
                                    {
                                      log.description ||
                                      "-"
                                    }
                                  </p>

                                  <p className="
                                    text-sm
                                    text-gray-400
                                  ">
                                    {
                                      log.createdAt

                                        ? new Date(
                                            log.createdAt
                                          ).toLocaleString(
                                            "id-ID"
                                          )

                                        : "-"
                                    }
                                  </p>

                                </div>

                              </div>

                            </div>

                          );
                        })
                      }

                    </div>

                  </Section>
                )
              }

            </>
          )
        }

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="
        shrink-0
        px-10
        py-5
        border-t
        border-gray-200
        bg-white/90
        backdrop-blur-sm
        flex
        items-center
        justify-between
      ">

        <p className="
          text-sm
          text-gray-500
        ">
          Detail informasi ticket pelanggan
        </p>

        <div className="
          flex
          items-center
          gap-3
        ">

          {/* EXPORT PDF */}

          <button

            onClick={async () => {

              try {

                const res =
                  await api.get(

                    `/reports/invoice/${ticket._id}`,

                    {
                      responseType:
                        "blob",
                    }
                  );

                const file =
                  new Blob(
                    [res.data],
                    {
                      type:
                        "application/pdf",
                    }
                  );

                saveAs(
                  file,
                  `invoice-${ticket._id}.pdf`
                );

              } catch (err) {

                console.error(err);

                alert(
                  "Gagal export invoice"
                );
              }
            }}

            className="
              h-12
              px-6

              rounded-2xl

              border
              border-gray-200

              bg-white

              flex
              items-center
              gap-2

              text-sm
              font-semibold
              text-[#111827]

              shadow-sm

              hover:bg-gray-50
              transition-all
            "
          >

            <FileText size={16} />

            Export Invoice

          </button>

          {/* CLOSE */}

          <button
            onClick={onClose}
            className="
              h-12
              px-8
              rounded-2xl
              bg-[#111827]
              text-white
              font-medium
              hover:bg-black
              transition-all
            "
          >
            Tutup
          </button>

        </div>

      </div>

    </BaseModal>
  );
}

/* =====================================================
   SECTION
===================================================== */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {

  return (

    <div className="
      rounded-[24px]
      border
      border-gray-200
      bg-white
      p-7
      space-y-6
      shadow-sm
    ">

      <h3 className="
        text-[28px]
        font-semibold
        text-[#111827]
      ">
        {title}
      </h3>

      {children}

    </div>
  );
}

/* =====================================================
   FIELD
===================================================== */

function Field({
  label,
  value,
  icon,
  multiline,
}: {
  label: string;
  value?: any;
  icon?: React.ReactNode;
  multiline?: boolean;
}) {

  return (

    <div className="
      rounded-2xl
      border
      border-gray-200
      bg-[#FCFCFD]
      p-5
      space-y-3
    ">

      <div className="
        flex
        items-center
        gap-2
        text-gray-500
      ">

        {icon}

        <div className="
          text-xs
          font-semibold
          uppercase
          tracking-wider
        ">
          {label}
        </div>

      </div>

      <div
        className={`
          text-[15px]
          font-semibold
          text-[#111827]
          break-words

          ${
            multiline
              ? "leading-7"
              : ""
          }
        `}
      >

        {value || "-"}

      </div>

    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {

  return (

    <div className="
      rounded-[24px]
      border
      border-gray-200
      bg-[#FCFCFD]
      p-6
      space-y-4
    ">

      <div className="
        flex
        items-center
        justify-between
      ">

        <div className="
          text-xs
          font-semibold
          uppercase
          tracking-wider
          text-gray-500
        ">
          {label}
        </div>

        <div className="
          text-gray-500
        ">
          {icon}
        </div>

      </div>

      <div className="
        text-[26px]
        font-bold
        text-[#111827]
        break-words
      ">
        {value}
      </div>

    </div>
  );
}

/* =====================================================
   MINI SUMMARY
===================================================== */

function MiniSummary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div className="
      rounded-2xl
      border
      border-gray-200
      bg-[#FCFCFD]
      p-4
      space-y-2
    ">

      <div className="
        text-xs
        font-semibold
        uppercase
        tracking-wider
        text-gray-500
      ">
        {label}
      </div>

      <div className="
        text-[18px]
        font-bold
        text-[#111827]
        break-words
      ">
        {value}
      </div>

    </div>
  );
}