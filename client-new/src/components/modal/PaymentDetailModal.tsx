"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/axios";

import {
  X,
  Wallet,
  User2,
  Ticket,
  Calendar,
  BadgeCheck,
  Clock3,
  XCircle,
  FileText,
  CreditCard,
} from "lucide-react";

import BaseModal from "@/components/form/BaseModal";

/* =====================================================
   TYPES
===================================================== */

type Props = {
  open: boolean;
  onClose: () => void;
  data: any;
};

/* =====================================================
   FORMAT
===================================================== */

const formatRupiah = (
  num: number
) =>
  "Rp " +
  (num || 0).toLocaleString(
    "id-ID"
  );

/* =====================================================
   COMPONENT
===================================================== */

export default function PaymentDetailModal({

  open,

  onClose,

  data,

}: Props) {

  /* =====================================================
     STATE
  ===================================================== */

  const [
    payments,
    setPayments,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  /* =====================================================
     FETCH
  ===================================================== */

  useEffect(() => {

    if (open && data) {

      const ticketId =
        data?.ticketId?._id ||
        data?.ticketId;

      if (ticketId) {
        fetchPayments(ticketId);
      }
    }

  }, [open, data]);

  const fetchPayments =
    async (
      ticketId: string
    ) => {

      try {

        setLoading(true);

        const res =
          await api.get(
            `/payments/ticket/${ticketId}`
          );

        setPayments(
          res.data || []
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }
    };

  /* =====================================================
     CLOSE
  ===================================================== */

  if (!open || !data)
    return null;

  /* =====================================================
     SUMMARY
  ===================================================== */

  const total =
    payments.reduce(
      (s, p) =>
        s + p.jumlah,
      0
    );

  const approved =
    payments
      .filter(
        (p) =>
          p.status ===
          "approved"
      )
      .reduce(
        (s, p) =>
          s + p.jumlah,
        0
      );

  const sisa =
    total - approved;

  const progress =
    total > 0

      ? Math.min(
          (
            approved /
            total
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
      maxWidth="max-w-6xl"
      className="
        h-[92vh]
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
                Pembayaran
              </h2>

              <div className="
                h-12
                px-5
                rounded-2xl
                flex
                items-center
                justify-center
                text-[15px]
                font-semibold
                border
                border-slate-200
                bg-slate-100
                text-slate-700
                shadow-sm
              ">

                {
                  payments.length
                } Pembayaran

              </div>

            </div>

            <p className="
              text-[16px]
              text-gray-500
            ">
              Riwayat dan progress pembayaran ticket
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
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-8
          ">

            <div className="
              space-y-5
            ">

              <div className="
                flex
                items-center
                gap-4
              ">

                <div className="
                  w-20
                  h-20
                  rounded-[28px]
                  bg-slate-100
                  text-slate-700
                  flex
                  items-center
                  justify-center
                ">
                  <Wallet size={38} />
                </div>

                <div>

                  <h3 className="
                    text-[38px]
                    leading-none
                    font-bold
                    text-[#0F172A]
                  ">
                    {
                      progress.toFixed(
                        0
                      )
                    }%
                  </h3>

                  <p className="
                    mt-2
                    text-gray-500
                  ">
                    Progress pembayaran
                  </p>

                </div>

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
                  border
                  border-slate-200
                  bg-slate-100
                  text-slate-700
                  text-sm
                  font-medium
                ">

                  Approved:
                  {" "}
                  {
                    formatRupiah(
                      approved
                    )
                  }

                </div>

                <div className="
                  px-4
                  py-2
                  rounded-2xl
                  border
                  border-neutral-200
                  bg-neutral-100
                  text-neutral-700
                  text-sm
                  font-medium
                ">

                  Sisa:
                  {" "}
                  {
                    formatRupiah(
                      sisa
                    )
                  }

                </div>

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
                data.ticketId
                  ?.pelangganId
                  ?.nama
              }
            />

            <Field
              icon={
                <Ticket size={18} />
              }
              label="Ticket ID"
              value={
                data.ticketId
                  ?._id ||
                data.ticketId
              }
            />

          </div>

        </Section>

        {/* SUMMARY */}
        <Section title="Summary Pembayaran">

          <div className="
            space-y-6
          ">

            {/* PROGRESS */}
            <div className="
              space-y-3
            ">

              <div className="
                flex
                items-center
                justify-between
                text-sm
                font-medium
                text-gray-600
              ">

                <span>
                  Progress Pembayaran
                </span>

                <span>
                  {
                    progress.toFixed(
                      0
                    )
                  }%
                </span>

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

            </div>

            {/* GRID */}
            <div className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-5
            ">

              <SummaryCard
                icon={
                  <Wallet
                    size={22}
                  />
                }
                label="Total"
                value={
                  formatRupiah(
                    total
                  )
                }
              />

              <SummaryCard
                icon={
                  <BadgeCheck
                    size={22}
                  />
                }
                label="Approved"
                value={
                  formatRupiah(
                    approved
                  )
                }
              />

              <SummaryCard
                icon={
                  <Clock3
                    size={22}
                  />
                }
                label="Sisa"
                value={
                  formatRupiah(
                    sisa
                  )
                }
              />

            </div>

          </div>

        </Section>

        {/* LIST */}
        <Section title="Riwayat Pembayaran">

          {/* EMPTY */}
          {
            !loading &&
            payments.length ===
              0 && (

              <div className="
                rounded-[24px]
                border
                border-gray-200
                bg-[#FCFCFD]
                p-8
                text-center
              ">

                <div className="
                  w-20
                  h-20
                  mx-auto
                  rounded-3xl
                  bg-white
                  border
                  border-gray-200
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  shadow-sm
                ">
                  <CreditCard
                    size={34}
                  />
                </div>

                <h3 className="
                  mt-5
                  text-[22px]
                  font-bold
                  text-[#111827]
                ">
                  Belum Ada Pembayaran
                </h3>

                <p className="
                  mt-2
                  text-gray-500
                ">
                  Pembayaran ticket belum tersedia
                </p>

              </div>
            )
          }

          {/* LOADING */}
          {
            loading && (

              <div className="
                rounded-[24px]
                border
                border-gray-200
                bg-[#FCFCFD]
                p-8
                text-center
              ">

                <p className="
                  text-[16px]
                  font-medium
                  text-gray-500
                ">
                  Loading pembayaran...
                </p>

              </div>
            )
          }

          {/* LIST */}
          <div className="
            space-y-5
          ">

            {
              payments.map(
                (p) => {

                  const statusConfig =
                    {

                      approved: {

                        label:
                          "Approved",

                        icon:
                          <BadgeCheck
                            size={
                              15
                            }
                          />,

                        className:
                          `
                            bg-emerald-50
                            text-emerald-700
                            border-emerald-200
                          `,
                      },

                      rejected: {

                        label:
                          "Rejected",

                        icon:
                          <XCircle
                            size={
                              15
                            }
                          />,

                        className:
                          `
                            bg-red-50
                            text-red-700
                            border-red-200
                          `,
                      },

                      pending: {

                        label:
                          "Pending",

                        icon:
                          <Clock3
                            size={
                              15
                            }
                          />,

                        className:
                          `
                            bg-amber-50
                            text-amber-700
                            border-amber-200
                          `,
                      },
                    };

                  const status =
                    statusConfig[
                      p.status as keyof typeof statusConfig
                    ];

                  return (

                    <div
                      key={
                        p._id
                      }
                      className={`
                        rounded-[28px]
                        border
                        p-6
                        bg-white
                        shadow-sm
                        transition-all

                        ${
                          p._id ===
                          data._id

                            ? `
                              border-black
                            `

                            : `
                              border-gray-200
                            `
                        }
                      `}
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

                          {/* TOP */}
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
                                p.tipe
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

                              ${status.className}
                            `}>

                              {
                                status.icon
                              }

                              {
                                status.label
                              }

                            </div>

                          </div>

                          {/* VALUE */}
                          <div>

                            <h3 className="
                              text-[36px]
                              leading-none
                              font-bold
                              text-[#0F172A]
                            ">

                              {
                                formatRupiah(
                                  p.jumlah
                                )
                              }

                            </h3>

                            <p className="
                              mt-3
                              text-gray-500
                            ">

                              {
                                new Date(
                                  p.createdAt
                                ).toLocaleString(
                                  "id-ID"
                                )
                              }

                            </p>

                          </div>

                          {/* CATATAN */}
                          {
                            p.catatan && (

                              <div className="
                                rounded-[24px]
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
                                    p.catatan
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
          Detail informasi pembayaran ticket
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