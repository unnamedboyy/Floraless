"use client";

import {
  X,
  Clock3,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Wallet,
  Landmark,
  User2,
  Ticket,
  Calendar,
  FileText,
  BadgeCheck,
} from "lucide-react";

/* =====================================================
   TYPES
===================================================== */

type Props = {
  open: boolean;
  data: any;
  onClose: () => void;
};

/* =====================================================
   HELPERS
===================================================== */

const formatRupiah = (num: number) =>
  "Rp " + (num || 0).toLocaleString("id-ID");

/* =====================================================
   COMPONENT
===================================================== */

export default function CashbackHistoryDetailModal({
  open,
  data,
  onClose,
}: Props) {

  if (!open || !data) return null;

  const imageUrl =
  data?.bukti_tf

    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.bukti_tf}`

    : "";

  /* =====================================================
     STATUS CONFIG
  ===================================================== */

  const statusConfig = {
    pending: {
      label: "Pending",
      icon: <Clock3 size={16} />,
      className: `
        bg-gray-100
        text-gray-700
        border-gray-200
      `,
    },
    approved: {
      label: "Approved",
      icon: <BadgeCheck size={16} />,
      className: `
        bg-emerald-50
        text-emerald-700
        border-emerald-200
      `,
    },
    rejected: {
      label: "Rejected",
      icon: <XCircle size={16} />,
      className: `
        bg-red-50
        text-red-700
        border-red-200
      `,
    },
  };

  const status =
    statusConfig[
      data.status as keyof typeof statusConfig
    ] || statusConfig.pending;

  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="
      fixed
      inset-0
      z-[999]
      flex
      items-center
      justify-center
      bg-black/50
      backdrop-blur-sm
      p-4
    ">

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0"
      />

      {/* MODAL */}
      <div className="
        relative
        z-10
        w-full
        max-w-4xl
        max-h-[92vh]
        overflow-hidden
        rounded-[32px]
        border
        border-gray-200
        bg-white
        shadow-2xl
        flex
        flex-col
      ">

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

            <div className="space-y-3">

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
                  Cashback
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
                Informasi claim cashback Anda
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
              items-start
              gap-5
            ">

              <div className="
                w-24
                h-24
                rounded-[32px]
                bg-emerald-50
                text-emerald-600
                flex
                items-center
                justify-center
                shrink-0
              ">
                <Wallet size={42} />
              </div>

              <div className="space-y-4">

                <div>

                  <h3 className="
                    text-[38px]
                    leading-tight
                    font-bold
                    text-[#0F172A]
                  ">
                    {formatRupiah(data.amount || 0)}
                  </h3>

                  <p className="
                    mt-2
                    text-gray-500
                  ">
                    Nominal cashback Anda
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
                    Voucher: {data.kode_voucher || "-"}
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
                    {new Date(data.createdAt).toLocaleString("id-ID")}
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* INFORMASI CASHBACK */}
          <Section title="Informasi Cashback">

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            ">

              <Field
                icon={<Ticket size={18} />}
                label="Kode Voucher"
                value={data.kode_voucher}
              />

              <Field
                icon={<Wallet size={18} />}
                label="Nominal Cashback"
                value={formatRupiah(data.amount || 0)}
              />

              <Field
                icon={<Landmark size={18} />}
                label="Bank"
                value={data.bank}
              />

              <Field
                icon={<Wallet size={18} />}
                label="Nomor Rekening"
                value={data.nomor_rekening}
              />

              <Field
                icon={<User2 size={18} />}
                label="Nama Rekening"
                value={data.nama_rekening}
              />

              <Field
                icon={<Calendar size={18} />}
                label="Tanggal Claim"
                value={
                  data.createdAt
                    ? new Date(data.createdAt).toLocaleString("id-ID")
                    : "-"
                }
              />

            </div>

          </Section>

          {/* BUKTI TRANSFER */}
          {data.bukti_tf && (

            <Section title="Bukti Transfer">

              <div className="
                flex
                items-start
                justify-between
                gap-4
                flex-wrap
              ">

                <p className="
                  text-[15px]
                  text-gray-500
                ">
                  Bukti transfer cashback
                </p>

                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    h-12
                    px-5
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
                  <ExternalLink size={16} />
                  Open Image
                </a>

              </div>

              <div className="
                rounded-[28px]
                overflow-hidden
                border
                border-gray-200
                bg-gray-50
              ">
                <img
                  src={imageUrl}
                  alt="Bukti Transfer"
                  className="w-full object-cover"
                />
              </div>

            </Section>
          )}

          {/* ALASAN PENOLAKAN */}
          {data.status === "rejected" && data.alasan && (

            <Section title="Alasan Penolakan">

              <div className="
                rounded-[28px]
                border
                border-red-200
                bg-red-50
                p-6
              ">

                <div className="
                  flex
                  items-start
                  gap-4
                ">

                  <div className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-white
                    text-red-600
                    flex
                    items-center
                    justify-center
                    shrink-0
                  ">
                    <FileText size={24} />
                  </div>

                  <div>

                    <h4 className="
                      text-[22px]
                      font-bold
                      text-red-700
                    ">
                      Cashback Ditolak
                    </h4>

                    <p className="
                      mt-3
                      leading-7
                      text-red-600
                    ">
                      {data.alasan}
                    </p>

                  </div>

                </div>

              </div>

            </Section>
          )}

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

          <p className="text-sm text-gray-500">
            Detail informasi cashback Anda
          </p>

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

    </div>
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
}: {
  label: string;
  value?: any;
  icon?: React.ReactNode;
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
      <div className="
        text-[15px]
        font-semibold
        text-[#111827]
        break-words
      ">
        {value || "-"}
      </div>
    </div>
  );
}