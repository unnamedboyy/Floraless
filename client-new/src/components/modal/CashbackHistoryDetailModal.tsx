"use client";

import {
  X,
  Clock3,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

type Props = {

  open: boolean;

  data: any;

  onClose: () => void;
};

export default function CashbackHistoryDetailModal({

  open,

  data,

  onClose,

}: Props) {

  if (!open || !data)
    return null;

  const statusConfig = {

    pending: {

      label: "Pending",

      icon:
        <Clock3 size={15} />,

      className: `
        bg-yellow-100
        text-yellow-700
        border-yellow-200
      `,
    },

    approved: {

      label: "Approved",

      icon:
        <CheckCircle2 size={15} />,

      className: `
        bg-green-100
        text-green-700
        border-green-200
      `,
    },

    rejected: {

      label: "Rejected",

      icon:
        <XCircle size={15} />,

      className: `
        bg-red-100
        text-red-700
        border-red-200
      `,
    },
  };

  const status =
    statusConfig[
      data.status as keyof typeof statusConfig
    ];

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
        className="
          absolute
          inset-0
        "
      />

      {/* MODAL */}
      <div className="
        relative
        z-10
        w-full
        max-w-4xl
        overflow-hidden
        rounded-[32px]
        border
        bg-white
        shadow-2xl
      ">

        {/* HEADER */}
        <div className="
          sticky
          top-0
          z-20
          flex
          items-center
          justify-between
          border-b
          bg-white
          px-6
          py-5
        ">

          <div>

            <h2 className="
              text-2xl
              font-bold
            ">
              Detail Cashback
            </h2>

            <p className="
              mt-1
              text-sm
              text-gray-500
            ">
              Informasi claim cashback Anda
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              hover:bg-gray-100
            "
          >
            <X size={20} />
          </button>

        </div>

        {/* CONTENT */}
        <div className="
          max-h-[85vh]
          overflow-y-auto
          px-6
          py-6
        ">

          {/* STATUS */}
          <div className="
            mb-6
          ">

            <div className={`
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              px-4
              py-2
              text-sm
              font-semibold

              ${status.className}
            `}>

              {status.icon}

              {status.label}

            </div>

          </div>

          {/* GRID */}
          <div className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          ">

            <InfoCard
              title="Kode Voucher"
              value={
                data.kode_voucher || "-"
              }
            />

            <InfoCard
              title="Nominal Cashback"
              value={`Rp ${(
                data.amount || 0
              ).toLocaleString(
                "id-ID"
              )}`}
            />

            <InfoCard
              title="Bank"
              value={
                data.bank || "-"
              }
            />

            <InfoCard
              title="Nomor Rekening"
              value={
                data.nomor_rekening || "-"
              }
            />

            <InfoCard
              title="Nama Rekening"
              value={
                data.nama_rekening || "-"
              }
            />

            <InfoCard
              title="Tanggal Claim"
              value={
                new Date(
                  data.createdAt
                ).toLocaleString(
                  "id-ID"
                )
              }
            />

          </div>

          {/* BUKTI TF */}
          {
            data.bukti_tf && (

              <div className="
                mt-6
                rounded-[28px]
                border
                p-6
              ">

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  flex-wrap
                ">

                  <div>

                    <h3 className="
                      text-xl
                      font-bold
                    ">
                      Bukti Transfer
                    </h3>

                    <p className="
                      mt-1
                      text-sm
                      text-gray-500
                    ">
                      Bukti transfer cashback
                    </p>

                  </div>

                  <a
                    href={data.bukti_tf}
                    target="_blank"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-2xl
                      border
                      px-4
                      py-2
                      text-sm
                      font-medium
                      hover:bg-gray-100
                    "
                  >

                    <ExternalLink size={16} />

                    Open Image

                  </a>

                </div>

                <img
                  src={data.bukti_tf}
                  alt="Bukti Transfer"
                  className="
                    mt-5
                    w-full
                    rounded-3xl
                    border
                  "
                />

              </div>
            )
          }

          {/* REJECT */}
          {
            data.status ===
            "rejected" &&

            data.alasan && (

              <div className="
                mt-6
                rounded-[28px]
                border
                border-red-200
                bg-red-50
                p-6
              ">

                <h3 className="
                  text-xl
                  font-bold
                  text-red-700
                ">
                  Alasan Penolakan
                </h3>

                <p className="
                  mt-3
                  leading-relaxed
                  text-red-600
                ">
                  {data.alasan}
                </p>

              </div>
            )
          }

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   INFO CARD
===================================================== */

function InfoCard({

  title,

  value,

}: {

  title: string;

  value: string;
}) {

  return (

    <div className="
      rounded-[28px]
      border
      p-6
    ">

      <p className="
        text-sm
        uppercase
        tracking-widest
        text-gray-400
      ">
        {title}
      </p>

      <p className="
        mt-3
        text-2xl
        font-bold
        break-words
      ">
        {value}
      </p>

    </div>
  );
}