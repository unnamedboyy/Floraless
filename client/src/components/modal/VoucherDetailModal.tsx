"use client";

import BaseModal from "@/components/form/BaseModal";

import {

  X,

  TicketPercent,

  User2,

  Wallet,

  CalendarDays,

  CheckCircle2,

  XCircle,

  Sparkles,

  Clock3,

} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Props = {

  open: boolean;

  onClose: () => void;

  data: any;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function DetailVoucherModal({

  open,

  onClose,

  data,

}: Props) {

  /* =====================================================
     GUARD
  ===================================================== */

  if (!open || !data) return null;

  /* =====================================================
     STATE
  ===================================================== */

  const isExpired =

    data.expiredAt

      ? new Date(data.expiredAt) < new Date()

      : false;

  /* =====================================================
     RENDER
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

        bg-[#FCFCFD]

        shrink-0

      ">

        <div className="

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

                text-[40px]

                leading-none

                tracking-tight

                font-bold

                text-[#0F172A]

              ">

                Detail

              </h2>

              <h2 className="

                text-[40px]

                leading-none

                tracking-tight

                font-bold

                text-emerald-600

              ">

                voucher

              </h2>

            </div>

            <p className="

              mt-3

              text-[15px]

              text-slate-500

            ">

              Informasi lengkap voucher pelanggan

            </p>

          </div>

          <button

            onClick={onClose}

            className="

              w-14
              h-14

              rounded-2xl

              border
              border-slate-200

              bg-white

              flex
              items-center
              justify-center

              text-slate-500

              hover:bg-slate-100

              transition-all

            "
          >

            <X size={22} />

          </button>

        </div>

      </div>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="

        flex-1

        overflow-y-auto

        px-8
        py-8

        space-y-7

        bg-[#FCFCFD]

      ">

        {/* =====================================================
            HERO
        ===================================================== */}

        <div className="

          rounded-[32px]

          border
          border-emerald-200

          bg-gradient-to-br
          from-emerald-50
          via-white
          to-white

          p-7

          overflow-hidden

          relative

        ">

          {/* BG */}
          <div className="

            absolute

            right-[-40px]
            top-[-40px]

            w-[180px]
            h-[180px]

            rounded-full

            bg-emerald-100/50

          " />

          <div className="

            relative

            flex
            items-start

            gap-5

          ">

            {/* ICON */}
            <div className="

              w-20
              h-20

              rounded-[28px]

              bg-white

              border
              border-emerald-200

              shadow-sm

              flex
              items-center
              justify-center

              text-emerald-600

              shrink-0

            ">

              <Sparkles
                size={34}
              />

            </div>

            {/* CONTENT */}
            <div className="
              flex-1
            ">

              <div className="

                flex
                items-center

                gap-3

                flex-wrap

              ">

                <div className="

                  h-11

                  px-5

                  rounded-2xl

                  bg-white

                  border
                  border-emerald-200

                  inline-flex
                  items-center

                  text-sm
                  font-semibold

                  text-emerald-700

                ">

                  Voucher Cashback

                </div>

                {/* STATUS */}
                <StatusBadge
                  active={!data.isUsed}
                  successLabel="Belum Digunakan"
                  failedLabel="Sudah Digunakan"
                />

                {/* EXPIRED */}
                <StatusBadge
                  active={!isExpired}
                  successLabel="Masih Berlaku"
                  failedLabel="Expired"
                />

              </div>

              <h3 className="

                mt-5

                text-[42px]

                leading-none

                tracking-tight

                font-bold

                text-[#0F172A]

              ">

                {

                  data.code ||

                  "-"
                }

              </h3>

              <div className="

                mt-5

                inline-flex
                items-center

                gap-2

                rounded-2xl

                bg-white

                border
                border-emerald-200

                px-5
                py-3

                text-emerald-700

                font-semibold

                shadow-sm

              ">

                <Wallet size={18} />

                Rp {

                  Number(
                    data.amount || 0
                  ).toLocaleString(
                    "id-ID"
                  )
                }

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            INFORMASI
        ===================================================== */}

        <Section title="Informasi Voucher">

          <div className="

            grid
            grid-cols-1
            md:grid-cols-2

            gap-5

          ">

            <Field

              icon={
                <TicketPercent
                  size={18}
                />
              }

              label="Kode Voucher"

              value={data.code}

            />

            <Field

              icon={
                <Wallet size={18} />
              }

              label="Nominal Cashback"

              value={`Rp ${

                Number(
                  data.amount || 0
                ).toLocaleString(
                  "id-ID"
                )
              }`}

            />

            <Field

              icon={
                <CalendarDays
                  size={18}
                />
              }

              label="Tanggal Expired"

              value={

                data.expiredAt

                  ? new Date(
                      data.expiredAt
                    ).toLocaleDateString(
                      "id-ID"
                    )

                  : "-"
              }

            />

            <Field

              icon={
                isExpired

                  ? <XCircle size={18} />

                  : <Clock3 size={18} />
              }

              label="Status Expired"

              value={

                isExpired

                  ? "Sudah Expired"

                  : "Masih Berlaku"
              }

            />

          </div>

        </Section>

        {/* =====================================================
            PELANGGAN
        ===================================================== */}

        <Section title="Informasi Pelanggan">

          <div className="

            rounded-[28px]

            border
            border-slate-200

            bg-[#FCFCFD]

            p-6

            flex
            items-start

            gap-5

          ">

            <div className="

              w-16
              h-16

              rounded-3xl

              bg-white

              border
              border-slate-200

              flex
              items-center
              justify-center

              text-slate-500

              shadow-sm

              shrink-0

            ">

              <User2
                size={28}
              />

            </div>

            <div className="
              flex-1
            ">

              <div className="

                text-xs

                font-semibold

                uppercase

                tracking-wider

                text-slate-400

              ">

                Pemilik Voucher

              </div>

              <h3 className="

                mt-2

                text-[28px]

                leading-tight

                font-bold

                tracking-tight

                text-[#0F172A]

              ">

                {

                  data.pelangganId?.nama ||

                  "-"
                }

              </h3>

              <div className="

                mt-4

                flex
                flex-wrap

                items-center

                gap-3

              ">

                {

                  data.pelangganId?.email && (

                    <div className="

                      h-11

                      px-4

                      rounded-2xl

                      bg-white

                      border
                      border-slate-200

                      inline-flex
                      items-center

                      text-sm
                      font-medium

                      text-slate-700

                    ">

                      {
                        data.pelangganId.email
                      }

                    </div>
                  )
                }

                {

                  data.pelangganId?.no_telp && (

                    <div className="

                      h-11

                      px-4

                      rounded-2xl

                      bg-white

                      border
                      border-slate-200

                      inline-flex
                      items-center

                      text-sm
                      font-medium

                      text-slate-700

                    ">

                      {
                        data.pelangganId.no_telp
                      }

                    </div>
                  )
                }

              </div>

            </div>

          </div>

        </Section>

        {/* =====================================================
            SYSTEM
        ===================================================== */}

        <Section title="Informasi Sistem">

          <div className="

            grid
            grid-cols-1
            md:grid-cols-2

            gap-5

          ">

            <Field

              icon={
                data.isUsed

                  ? (
                    <CheckCircle2
                      size={18}
                    />
                  )

                  : (
                    <Clock3
                      size={18}
                    />
                  )
              }

              label="Status Penggunaan"

              value={

                data.isUsed

                  ? "Sudah Digunakan"

                  : "Belum Digunakan"
              }

            />

            <Field

              icon={
                <CalendarDays
                  size={18}
                />
              }

              label="Dibuat"

              value={

                data.createdAt

                  ? new Date(
                      data.createdAt
                    ).toLocaleString(
                      "id-ID"
                    )

                  : "-"
              }

            />

            <Field

              icon={
                <CalendarDays
                  size={18}
                />
              }

              label="Terakhir Update"

              value={

                data.updatedAt

                  ? new Date(
                      data.updatedAt
                    ).toLocaleString(
                      "id-ID"
                    )

                  : "-"
              }

            />

          </div>

        </Section>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="

        shrink-0

        px-8
        py-5

        border-t
        border-slate-200

        bg-white/90

        backdrop-blur-sm

        flex
        items-center
        justify-between

      ">

        <p className="

          text-sm

          text-slate-500

        ">

          Detail informasi voucher cashback

        </p>

        <button

          onClick={onClose}

          className="

            h-12

            px-7

            rounded-2xl

            bg-[#0F172A]

            text-white

            text-sm
            font-semibold

            hover:opacity-90

            transition-all

          "
        >

          Tutup

        </button>

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

      rounded-[30px]

      border
      border-slate-200

      bg-white

      p-7

      space-y-6

      shadow-sm

    ">

      <h3 className="

        text-[28px]
        font-semibold

        text-[#0F172A]

      ">

        {title}

      </h3>

      {children}

    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({

  icon,

  label,

  value,

}: any) {

  return (

    <div className="

      rounded-2xl

      border
      border-slate-200

      bg-[#FCFCFD]

      p-5

      space-y-3

    ">

      <div className="

        flex
        items-center

        gap-2

        text-slate-400

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

        text-[#0F172A]

        break-words

      ">

        {value || "-"}

      </div>

    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({

  active,

  successLabel,

  failedLabel,

}: any) {

  return (

    <div className={`

      h-11

      px-4

      rounded-2xl

      inline-flex
      items-center

      text-sm
      font-semibold

      border

      ${
        active

          ? `
            bg-emerald-50
            border-emerald-200
            text-emerald-700
          `

          : `
            bg-red-50
            border-red-200
            text-red-700
          `
      }

    `}>

      {

        active

          ? successLabel

          : failedLabel
      }

    </div>
  );
}