"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  ImagePlus,
  X,
  Type,
  AlignLeft,
  Tag,
  Star,
  Wallet,
  UploadCloud,

} from "lucide-react";

import {
  uploadImage,
} from "@/services/upload.service";

import BaseModal from "@/components/form/BaseModal";

/* =========================================================
   TYPES
========================================================= */

type Props = {

  open: boolean;
  onClose: () => void;
  onSubmit: (
    form: any
  ) => Promise<void>;

  initialData?: any;

  loading?: boolean;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function LayananFormModal({

  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,

}: Props) {

  /* =====================================================
     STATE
  ===================================================== */

  const [form, setForm] =
    useState({

      nama: "",
      deskripsi: "",
      harga: "",
      thumbnail: "",
      kategori: "",
      isFeatured: false,
    });

  const [preview, setPreview] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  /* =====================================================
     EFFECT
  ===================================================== */

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        nama: initialData.nama || "",
        deskripsi: initialData.deskripsi || "",
        harga: initialData.harga || "",
        thumbnail: initialData.thumbnail || "",
        kategori: initialData.kategori || "",
        isFeatured: initialData.isFeatured || false,
      });

      setPreview(initialData.thumbnail || "");
    } else {
      setForm({
        nama: "",
        deskripsi: "",
        harga: "",
        thumbnail: "",
        kategori: "",
        isFeatured: false,
      });

      setPreview("");
    }
  }, [open, initialData]);
  
  /* =====================================================
     UPLOAD
  ===================================================== */

  const handleUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      try {

        const file =
          e.target.files?.[0];

        if (!file) return;

        /* =========================
           VALIDATION
        ========================= */

        if (
          !file.type.startsWith(
            "image/"
          )
        ) {

          toast.error(
            "File harus gambar"
          );

          return;
        }

        if (
          file.size >
          20 * 1024 * 1024
        ) {

          toast.error(
            "Ukuran maksimal 20MB"
          );

          return;
        }

        /* =========================
           PREVIEW
        ========================= */

        setPreview(
          URL.createObjectURL(file)
        );

        /* =========================
           UPLOAD
        ========================= */

        setUploading(true);

        const url =
          await uploadImage(

            file,

            "layanan",

            (progress) => {

              setUploadProgress(
                progress
              );
            }
          );

        setForm((prev) => ({

          ...prev,

          thumbnail: url,
        }));

        toast.success(
          "Thumbnail berhasil diupload"
        );

      } catch (err: any) {

        console.error(err);

        toast.error(

          err?.response?.data?.message ||

          "Gagal upload gambar"
        );

      } finally {

        setUploadProgress(0);

        setUploading(false);
      }
    };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        await onSubmit(form);
        onClose();

      } catch (err) {

        console.error(err);
      }
    };

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

          <h2 className="

            text-[38px]
            leading-none

            font-bold

            tracking-tight

            text-[#0F172A]

          ">

            {

              initialData

                ? (
                  <>
                    Edit{" "}

                    <span className="
                      text-[#64748B]
                    ">
                      layanan
                    </span>
                  </>
                )

                : (
                  <>
                    Tambah{" "}

                    <span className="
                      text-[#64748B]
                    ">
                      layanan
                    </span>
                  </>
                )
            }

          </h2>

          <p className="

            text-slate-500
            text-sm

            mt-3

          ">
            Kelola informasi layanan FLORALESS
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

      <form

        id="layanan-form"
        onSubmit={handleSubmit}

        className="

          flex-1

          overflow-y-auto

          px-8
          py-8

          space-y-7

        "
      >

        {/* =====================================================
            THUMBNAIL
        ===================================================== */}

        <Section title="Thumbnail">

          <div className="space-y-5">

            {/* PREVIEW */}
            <div className="

              aspect-[16/9]

              rounded-[28px]

              border-2
              border-dashed
              border-slate-200

              overflow-hidden

              bg-slate-50

              relative

            ">

              {

                preview

                  ? (

                    <img

                      src={preview}

                      alt="preview"

                      className="

                        w-full
                        h-full

                        object-cover

                      "
                    />
                  )

                  : (

                    <div className="

                      w-full
                      h-full

                      flex
                      flex-col

                      items-center
                      justify-center

                      gap-4

                      text-slate-400

                    ">

                      <ImagePlus
                        size={44}
                      />

                      <div className="

                        text-sm
                        font-medium

                      ">
                        Upload thumbnail layanan
                      </div>

                    </div>
                  )
              }

              {/* LOADING */}
              {

                uploading && (
                <div className="

                  absolute inset-0

                  bg-black/45

                  flex
                  flex-col

                  items-center
                  justify-center

                  gap-4

                  text-white

                ">

                  {/* PROGRESS */}
                  <div className="

                    w-[240px]
                    h-2

                    rounded-full

                    bg-white/20

                    overflow-hidden

                  ">

                    <div

                      className="

                        h-full

                        bg-white

                        transition-all

                      "

                      style={{
                        width:
                          `${uploadProgress}%`,
                      }}
                    />

                  </div>

                  {/* TEXT */}
                  <div className="

                    text-sm
                    font-semibold

                  ">

                    Uploading {uploadProgress}%

                  </div>

                </div>
                )
              }

            </div>

            {/* BUTTON */}
            <label className="

              h-12

              px-5

              inline-flex
              items-center
              gap-2

              rounded-2xl

              border
              border-slate-200

              text-sm
              font-medium

              text-slate-700

              hover:bg-slate-100

              transition

              cursor-pointer

            ">

              <UploadCloud
                size={18}
              />

              Upload Thumbnail

              <input

                type="file"

                accept="image/*"

                hidden

                onChange={handleUpload}
              />

            </label>

          </div>

        </Section>

        {/* =====================================================
            INFORMASI
        ===================================================== */}

        <Section title="Informasi Layanan">

          <div className="

            grid
            grid-cols-1
            md:grid-cols-2

            gap-5

          ">

            <InputField

              label="Nama Layanan"

              icon={<Type size={18} />}

              value={form.nama}

              onChange={(
                e: React.ChangeEvent<HTMLInputElement>
              ) =>

                setForm({

                  ...form,

                  nama:
                    e.target.value,
                })
              }

              placeholder="Wedding Premium"
            />

            <InputField

              label="Kategori"

              icon={<Tag size={18} />}

              value={form.kategori}

              onChange={(
                e: React.ChangeEvent<HTMLInputElement>
              ) =>

                setForm({

                  ...form,

                  kategori:
                    e.target.value,
                })
              }

              placeholder="Wedding"
            />

            <InputField

              label="Harga"

              icon={<Wallet size={18} />}

              type="number"

              value={form.harga}

              onChange={(
                e: React.ChangeEvent<HTMLInputElement>
              ) =>

                setForm({

                  ...form,

                  harga:
                    e.target.value,
                })
              }

              placeholder="1500000"
            />

            <div className="space-y-2">

              <label className="

                text-sm
                font-medium

                text-slate-700

              ">
                Featured
              </label>

              <button

                type="button"

                onClick={() =>
                  setForm({

                    ...form,

                    isFeatured:
                      !form.isFeatured,
                  })
                }

                className={`

                  h-[58px]

                  px-5

                  rounded-2xl

                  border

                  flex
                  items-center
                  gap-3

                  transition

                  ${
                    form.isFeatured

                      ? `
                        bg-amber-50
                        border-amber-200
                        text-amber-700
                      `

                      : `
                        bg-white
                        border-slate-200
                        text-slate-600
                      `
                  }

                `}
              >

                <Star size={18} />

                {

                  form.isFeatured

                    ? "Featured"

                    : "Tidak Featured"
                }

              </button>

            </div>

          </div>

        </Section>

        {/* =====================================================
            DESKRIPSI
        ===================================================== */}

        <Section title="Deskripsi">

          <TextareaField

            label="Deskripsi Layanan"

            icon={<AlignLeft size={18} />}

            value={form.deskripsi}

            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement>
            ) =>

              setForm({

                ...form,

                deskripsi:
                  e.target.value,
              })
            }

            placeholder="Jelaskan layanan..."
          />

        </Section>

      </form>

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

        gap-3

        sticky
        bottom-0

      ">

        <button

          onClick={onClose}

          type="button"

          className="

            h-12
            px-6

            rounded-2xl

            border
            border-slate-200

            text-sm
            font-semibold

            text-slate-700

            hover:bg-slate-100

            transition

          "
        >
          Batal
        </button>

        <button

          type="submit"
          form="layanan-form"

          disabled={
            loading ||
            uploading
          }

          className={`

            h-12
            px-7

            rounded-2xl

            bg-[#0F172A]

            text-white

            text-sm
            font-semibold

            transition

            ${
              loading || uploading

                ? `
                  opacity-50
                  cursor-not-allowed
                `

                : `
                  hover:opacity-90
                `
            }

          `}
        >

          {

            loading

              ? "Menyimpan..."

              : "Simpan"
          }

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
   INPUT FIELD
========================================================= */

function InputField({

  label,

  icon,

  ...props

}: any) {

  return (

    <div className="space-y-2">

      <label className="

        text-sm
        font-medium

        text-slate-700

      ">
        {label}
      </label>

      <div className="relative">

        <div className="

          absolute
          left-4
          top-1/2
          -translate-y-1/2

          text-slate-400

        ">
          {icon}
        </div>

        <input

          {...props}

          className="

            w-full

            h-[58px]

            pl-12
            pr-4

            rounded-2xl

            border
            border-slate-200

            bg-white

            text-sm

            outline-none

            transition

            focus:border-slate-400

          "
        />

      </div>

    </div>
  );
}

/* =========================================================
   TEXTAREA FIELD
========================================================= */

function TextareaField({

  label,

  icon,

  ...props

}: any) {

  return (

    <div className="space-y-2">

      <label className="

        text-sm
        font-medium

        text-slate-700

      ">
        {label}
      </label>

      <div className="relative">

        <div className="

          absolute
          left-4
          top-5

          text-slate-400

        ">
          {icon}
        </div>

        <textarea

          {...props}

          rows={6}

          className="

            w-full

            pl-12
            pr-4
            py-4

            rounded-2xl

            border
            border-slate-200

            bg-white

            text-sm

            outline-none

            resize-none

            transition

            focus:border-slate-400

          "
        />

      </div>

    </div>
  );
}