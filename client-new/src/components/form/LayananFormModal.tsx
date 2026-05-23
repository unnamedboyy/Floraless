"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
} from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: any) => void;
  initialData?: any;
};

const formatRupiahInput =
  (value: string) => {

    const number =
      value.replace(/\D/g, "");

    if (!number) return "";

    return new Intl.NumberFormat(
      "id-ID"
    ).format(Number(number));
  };

export default function LayananFormModal({

  open,

  onClose,

  onSubmit,

  initialData,

}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      nama: "",

      harga: "",

      deskripsi: "",

      thumbnail: "",
    });

  /* =====================================================
     EFFECT
  ===================================================== */

  useEffect(() => {

    if (initialData) {

      setForm({

        nama:
          initialData.nama || "",

        harga:
          initialData.harga

            ? String(
                initialData.harga
              )

            : "",

        deskripsi:
          initialData.deskripsi ||
          "",

        thumbnail:
          initialData.thumbnail ||
          "",
      });

    } else {

      setForm({

        nama: "",

        harga: "",

        deskripsi: "",

        thumbnail: "",
      });
    }

  }, [initialData, open]);

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async () => {

      try {

        setLoading(true);

        await onSubmit({

          ...form,

          harga: Number(

            form.harga.replace(
              /\D/g,
              ""
            )
          ),
        });

      } finally {

        setLoading(false);
      }
    };

  if (!open) return null;

  const previewImage =

    form.thumbnail ||

    "/service-default.jpg";

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/40
      backdrop-blur-sm
      p-4
    ">

      {/* CARD */}
      <div className="
        w-full
        max-w-3xl
        overflow-hidden
        rounded-[32px]
        bg-white
        shadow-2xl
        animate-in
        fade-in
        zoom-in-95
        duration-200
      ">

        {/* =================================================
           HEADER
        ================================================= */}

        <div className="
          flex
          items-start
          justify-between
          border-b
          px-7
          py-6
        ">

          <div>

            <p className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-[#C9AE63]
            ">
              Floraless Service
            </p>

            <h2 className="
              mt-3
              text-2xl
              font-semibold
              tracking-tight
              text-black
            ">

              {initialData

                ? "Edit Layanan"

                : "Tambah Layanan"}

            </h2>

            <p className="
              mt-2
              text-sm
              text-neutral-500
            ">
              Kelola informasi layanan
              dekorasi premium Floraless.
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
              rounded-2xl
              transition
              hover:bg-neutral-100
            "
          >
            ✕
          </button>

        </div>

        {/* =================================================
           BODY
        ================================================= */}

        <div className="
          max-h-[75vh]
          overflow-y-auto
          p-7
          space-y-7
        ">

          {/* IMAGE PREVIEW */}
          <div className="
            overflow-hidden
            rounded-[28px]
            border
            border-[#EFE7DA]
          ">

            <div className="
              relative
              h-[260px]
              w-full
            ">

              <Image
                src={previewImage}
                alt="Preview Thumbnail"
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
                from-black/40
                via-black/10
                to-transparent
              " />

              {/* BADGE */}
              <div className="
                absolute
                left-5
                top-5
                rounded-full
                bg-white/90
                px-4
                py-2
                text-xs
                font-medium
                tracking-[0.25em]
                text-black
                backdrop-blur
              ">
                PREVIEW
              </div>

            </div>

          </div>

          {/* =================================================
             FORM
          ================================================= */}

          <div className="
            rounded-[32px]
            border
            border-[#EFE7DA]
            bg-[#FAF7F2]
            p-6
            space-y-6
          ">

            {/* TITLE */}
            <div>

              <h3 className="
                text-lg
                font-semibold
              ">
                Informasi Layanan
              </h3>

              <p className="
                mt-1
                text-sm
                text-neutral-500
              ">
                Isi detail layanan dekorasi
                yang tersedia.
              </p>

            </div>

            {/* NAMA */}
            <FormField
              label="Nama Layanan"
            >

              <input
                placeholder="Wedding Decoration"
                value={form.nama}
                onChange={(e) =>

                  setForm({

                    ...form,

                    nama:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  bg-white
                  px-5
                  py-3.5
                  text-sm
                  outline-none
                  transition
                  focus:border-black
                "
              />

            </FormField>

            {/* HARGA */}
            <FormField
              label="Harga Layanan"
            >

              <div className="
                relative
              ">

                <div className="
                  absolute
                  left-5
                  top-1/2
                  -translate-y-1/2
                  text-sm
                  text-neutral-500
                ">
                  Rp
                </div>

                <input
                  placeholder="0"
                  value={formatRupiahInput(
                    form.harga
                  )}
                  onChange={(e) =>

                    setForm({

                      ...form,

                      harga:
                        e.target.value.replace(
                          /\D/g,
                          ""
                        ),
                    })
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    bg-white
                    py-3.5
                    pl-14
                    pr-5
                    text-sm
                    outline-none
                    transition
                    focus:border-black
                  "
                />

              </div>

            </FormField>

            {/* THUMBNAIL */}
            <FormField
              label="Thumbnail URL"
            >

              <input
                placeholder="https://..."
                value={form.thumbnail}
                onChange={(e) =>

                  setForm({

                    ...form,

                    thumbnail:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  bg-white
                  px-5
                  py-3.5
                  text-sm
                  outline-none
                  transition
                  focus:border-black
                "
              />

              <p className="
                text-xs
                text-neutral-400
              ">
                Kosongkan jika ingin
                menggunakan gambar default.
              </p>

            </FormField>

            {/* DESKRIPSI */}
            <FormField
              label="Deskripsi"
            >

              <textarea
                rows={6}
                placeholder="Masukkan deskripsi layanan..."
                value={form.deskripsi}
                onChange={(e) =>

                  setForm({

                    ...form,

                    deskripsi:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  bg-white
                  px-5
                  py-4
                  text-sm
                  outline-none
                  transition
                  focus:border-black
                "
              />

            </FormField>

          </div>

        </div>

        {/* =================================================
           FOOTER
        ================================================= */}

        <div className="
          flex
          flex-col
          gap-3
          border-t
          px-7
          py-5
          sm:flex-row
        ">

          <button
            onClick={onClose}
            className="
              flex-1
              rounded-2xl
              border
              py-3.5
              text-sm
              font-medium
              transition
              hover:bg-neutral-50
            "
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              flex-1
              rounded-2xl
              bg-black
              py-3.5
              text-sm
              font-medium
              text-white
              transition
              hover:opacity-90
              disabled:opacity-50
            "
          >

            {loading

              ? "Menyimpan..."

              : initialData

                ? "Simpan Perubahan"

                : "Tambah Layanan"}

          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function FormField({

  label,

  children,

}: {

  label: string;

  children: React.ReactNode;
}) {

  return (

    <div className="
      space-y-2
    ">

      <label className="
        text-sm
        font-medium
        text-neutral-700
      ">
        {label}
      </label>

      {children}

    </div>
  );
}