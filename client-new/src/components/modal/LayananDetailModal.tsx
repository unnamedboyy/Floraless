"use client";

import Image from "next/image";

type Props = {
  open: boolean;
  onClose: () => void;
  data: any;
};

const formatRupiah =
  (num: number) =>

    "Rp " +

    (num || 0).toLocaleString(
      "id-ID"
    );

export default function DetailLayananModal({

  open,

  onClose,

  data,

}: Props) {

  if (!open || !data)
    return null;

  const statusClass =
    data.isActive

      ? `
        bg-green-100
        text-green-700
        border-green-200
      `

      : `
        bg-red-100
        text-red-700
        border-red-200
      `;

  const imageUrl =

    data.thumbnail ||

    "/service-default.jpg";

  return (

    <div className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/50
      backdrop-blur-sm
      p-4
    ">

      {/* =================================================
         CARD
      ================================================= */}

      <div className="
        w-full
        max-w-4xl
        overflow-hidden
        rounded-[36px]
        bg-white
        shadow-2xl
        animate-in
        fade-in
        zoom-in-95
        duration-200
      ">

        {/* =================================================
           IMAGE
        ================================================= */}

        <div className="
          relative
          h-[320px]
          overflow-hidden
        ">

          <Image
            src={imageUrl}
            alt={data.nama}
            fill
            className="
              object-cover
            "
          />

          {/* OVERLAY */}
          <div className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-black/20
            to-transparent
          " />

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="
              absolute
              right-6
              top-6
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              bg-white/20
              text-white
              backdrop-blur
              transition
              hover:bg-white/30
            "
          >
            ✕
          </button>

          {/* CONTENT */}
          <div className="
            absolute
            inset-x-0
            bottom-0
            p-8
            text-white
          ">

            <p className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-[#D4B36A]
            ">
              Floraless Service
            </p>

            <div className="
              mt-4
              flex
              flex-col
              gap-5
              md:flex-row
              md:items-end
              md:justify-between
            ">

              <div>

                <h2 className="
                  text-4xl
                  font-semibold
                  tracking-tight
                ">
                  {data.nama || "-"}
                </h2>

                <p className="
                  mt-3
                  text-3xl
                  font-bold
                ">
                  {
                    formatRupiah(
                      data.harga
                    )
                  }
                </p>

              </div>

              <div
                className={`
                  inline-flex
                  w-fit
                  items-center
                  rounded-full
                  border
                  px-5
                  py-2
                  text-sm
                  font-medium
                  backdrop-blur
                  ${statusClass}
                `}
              >

                {data.isActive

                  ? "Layanan Aktif"

                  : "Layanan Nonaktif"}

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
           BODY
        ================================================= */}

        <div className="
          p-7
          space-y-7
        ">

          {/* =================================================
             DESCRIPTION
          ================================================= */}

          <div className="
            rounded-[30px]
            border
            border-[#EFE7DA]
            bg-[#FAF7F2]
            p-6
          ">

            <div className="
              flex
              items-center
              justify-between
              gap-4
            ">

              <div>

                <p className="
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  text-[#C9AE63]
                ">
                  Description
                </p>

                <h3 className="
                  mt-3
                  text-2xl
                  font-semibold
                ">
                  Detail Layanan
                </h3>

              </div>

              <div className="
                hidden
                rounded-full
                bg-black
                px-5
                py-2
                text-xs
                font-medium
                tracking-[0.2em]
                text-white
                md:block
              ">
                FLORALESS
              </div>

            </div>

            <div className="
              mt-6
              text-[15px]
              leading-relaxed
              text-neutral-600
              whitespace-pre-wrap
            ">

              {data.deskripsi ||

                "Tidak ada deskripsi layanan."}

            </div>

          </div>

          {/* =================================================
             INFO GRID
          ================================================= */}

          <div className="
            grid
            gap-5
            md:grid-cols-2
          ">

            <Field
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

        </div>

        {/* =================================================
           FOOTER
        ================================================= */}

        <div className="
          flex
          justify-end
          border-t
          px-7
          py-5
        ">

          <button
            onClick={onClose}
            className="
              rounded-2xl
              bg-black
              px-6
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:opacity-90
            "
          >
            Tutup
          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({

  label,

  value,

}: {

  label: string;

  value?: any;
}) {

  return (

    <div className="
      rounded-[28px]
      border
      border-[#EFE7DA]
      bg-white
      p-6
      shadow-sm
    ">

      <p className="
        text-xs
        uppercase
        tracking-[0.25em]
        text-neutral-400
      ">
        {label}
      </p>

      <p className="
        mt-4
        text-base
        font-semibold
        leading-relaxed
        text-black
        break-words
      ">
        {value || "-"}
      </p>

    </div>
  );
}