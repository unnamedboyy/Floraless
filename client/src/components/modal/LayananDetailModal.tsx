"use client";

import {

  X,

  Tag,

  Wallet,

  Star,

  CalendarDays,

  AlignLeft,

} from "lucide-react";

import BaseModal from "@/components/form/BaseModal";

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

export default function DetailLayananModal({

  open,

  onClose,

  data,

}: Props) {

  /* =====================================================
     GUARD
  ===================================================== */

  if (!open || !data) return null;

  /* =====================================================
     UI
  ===================================================== */

  return (

    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="max-w-5xl"
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
                layanan
              </span>
            </h2>

            {

              data.isFeatured && (

                <div className="

                  h-9

                  px-4

                  rounded-full

                  bg-amber-100

                  text-amber-700

                  inline-flex
                  items-center
                  gap-2

                  text-sm
                  font-semibold

                ">

                  <Star size={16} />

                  Featured

                </div>
              )
            }

          </div>

          <p className="

            text-slate-500
            text-sm

            mt-3

          ">
            Informasi lengkap layanan FLORALESS
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

        flex-1

        overflow-y-auto

        px-8
        py-8

        space-y-7

      ">

        {/* =====================================================
            THUMBNAIL
        ===================================================== */}

        <div className="

          rounded-[34px]

          overflow-hidden

          border
          border-slate-200

          bg-slate-100

        ">

          {
            data.thumbnail

              ? (

                <img

                  src={
                    data.thumbnail.startsWith("http")
                      ? data.thumbnail
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.thumbnail}`
                  }

                  alt={data.nama}

                  className="

                    w-full

                    aspect-[16/7]

                    object-cover

                  "
                />
              )

              : (

                <div className="

                  aspect-[16/7]

                  flex
                  items-center
                  justify-center

                  text-slate-400

                ">
                  Tidak ada thumbnail
                </div>
              )
          }

        </div>

        {/* =====================================================
            MAIN INFO
        ===================================================== */}

        <div className="

          grid
          grid-cols-1
          lg:grid-cols-3

          gap-6

        ">

          {/* =====================================================
              LEFT
          ===================================================== */}

          <div className="

            lg:col-span-2

            space-y-6

          ">

            {/* =========================
               BASIC
            ========================= */}

            <Section title="Informasi Layanan">

              <div className="space-y-5">

                <Field

                  icon={<Tag size={18} />}

                  label="Nama Layanan"

                  value={data.nama}
                />

                <Field

                  icon={<Wallet size={18} />}

                  label="Harga"

                  value={`Rp ${

                    Number(
                      data.harga || 0
                    ).toLocaleString(
                      "id-ID"
                    )
                  }`}
                />

                <Field

                  icon={<Tag size={18} />}

                  label="Kategori"

                  value={
                    data.kategori ||
                    "-"
                  }
                />

              </div>

            </Section>

            {/* =========================
               DESCRIPTION
            ========================= */}

            <Section title="Deskripsi">

              <div className="

                flex
                items-start
                gap-4

              ">

                <div className="

                  mt-1

                  text-slate-400

                ">
                  <AlignLeft size={18} />
                </div>

                <div className="

                  text-[15px]

                  leading-relaxed

                  text-slate-600

                ">
                  {

                    data.deskripsi ||

                    "Tidak ada deskripsi"
                  }
                </div>

              </div>

            </Section>

          </div>

          {/* =====================================================
              RIGHT
          ===================================================== */}

          <div className="space-y-6">

            {/* =========================
               STATUS
            ========================= */}

            <Section title="Status">

              <div className="space-y-4">

                <StatusBadge

                  label="Status"

                  active={
                    data.isActive
                  }
                />

                <StatusBadge

                  label="Featured"

                  active={
                    data.isFeatured
                  }
                />

              </div>

            </Section>

            {/* =========================
               TIMESTAMP
            ========================= */}

            <Section title="Informasi Sistem">

              <div className="space-y-5">

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

                  label="Update Terakhir"

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

        </div>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="

        px-8
        py-6

        border-t
        border-slate-200

        bg-white

        flex
        items-center
        justify-end

        sticky
        bottom-0

      ">

        <button

          onClick={onClose}

          className="

            h-12
            px-6

            rounded-2xl

            bg-[#0F172A]

            text-white

            text-sm
            font-semibold

            hover:opacity-90

            transition

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
   FIELD
========================================================= */

function Field({

  icon,

  label,

  value,

}: any) {

  return (

    <div className="

      flex
      items-start
      gap-4

    ">

      <div className="

        mt-1

        text-slate-400

      ">
        {icon}
      </div>

      <div className="space-y-1">

        <div className="

          text-xs
          font-medium

          uppercase

          tracking-wide

          text-slate-400

        ">
          {label}
        </div>

        <div className="

          text-[15px]
          font-semibold

          text-slate-700

          break-words

        ">
          {value || "-"}
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({

  label,

  active,

}: any) {

  return (

    <div className="

      flex
      items-center
      justify-between

      gap-4

    ">

      <div className="

        text-sm
        font-medium

        text-slate-600

      ">
        {label}
      </div>

      <div className={`

        h-10

        px-4

        rounded-full

        inline-flex
        items-center

        text-sm
        font-semibold

        ${
          active

            ? `
              bg-emerald-100
              text-emerald-700
            `

            : `
              bg-red-100
              text-red-700
            `
        }

      `}>

        {

          active

            ? "Aktif"

            : "Nonaktif"
        }

      </div>

    </div>
  );
}