"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {

  CalendarDays,

  MapPin,

  User2,

  Clock3,

  X,

  FileText,

} from "lucide-react";

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

  pegawaiList?: any[];

  loading?: boolean;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function JadwalFormModal({

  open,

  onClose,

  onSubmit,

  initialData,

  pegawaiList = [],

  loading = false,

}: Props) {

  /* =====================================================
     STATE
  ===================================================== */

  const [form, setForm] =
    useState({

      tanggal_acara: "",
      pegawaiId: "",
      catatan: "",
    });

  /* =====================================================
     EFFECT
  ===================================================== */

  useEffect(() => {

    if (initialData) {

      setForm({

        tanggal_acara:

          initialData.tanggal_acara

            ? new Date(
                initialData.tanggal_acara
              )

              .toISOString()

              .split("T")[0]

            : "",

        pegawaiId:

          initialData.pegawaiId?._id ||
          initialData.pegawaiId ||

          "",

        catatan:
          initialData.catatan || "",
      });

    } else {

      setForm({
        tanggal_acara: "",
        pegawaiId: "",
        catatan: "",
      });
    }

  }, [initialData]);

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        /* ================= VALIDATION ================= */

        if (!form.tanggal_acara) {

          toast.error(
            "Tanggal acara wajib diisi"
          );

          return;
        }

        if (!form.catatan.trim()) {

          toast.error(
            "Catatan wajib diisi"
          );

          return;
        }

        if (!form.pegawaiId) {

          toast.error(
            "Pegawai wajib dipilih"
          );

          return;
        }

        /* ================= SUBMIT ================= */

        await onSubmit(form);

      } catch (err: any) {

        console.error(err);

        toast.error(

          err?.response?.data?.message ||

          "Gagal menyimpan jadwal"
        );
      }
    };

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

              {

                initialData

                  ? (
                    <>
                      Edit{" "}

                      <span className="
                        text-[#C9AE63]
                      ">
                        jadwal
                      </span>
                    </>
                  )

                  : (
                    <>
                      Tambah{" "}

                      <span className="
                        text-[#C9AE63]
                      ">
                        jadwal
                      </span>
                    </>
                  )
              }

            </h2>

          </div>

          <p className="

            text-slate-500
            text-sm

            mt-3

          ">
            Kelola jadwal acara dan penugasan pegawai
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

        id="jadwal-form"

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
            INFORMASI ACARA
        ===================================================== */}

        <Section title="Informasi Acara">

          <div className="

            grid
            grid-cols-1
            md:grid-cols-2

            gap-5

          ">

            {/* TANGGAL */}
            <InputField

              label="Tanggal Acara"

              type="date"

              icon={
                <CalendarDays
                  size={18}
                />
              }

              value={
                form.tanggal_acara
              }

              onChange={(
                e: React.ChangeEvent<HTMLInputElement>
              ) =>

                setForm({

                  ...form,

                  tanggal_acara:
                    e.target.value,
                })
              }
            />

            {/* PEGAWAI */}
            <SelectField

              label="Pegawai"

              icon={
                <User2
                  size={18}
                />
              }

              value={
                form.pegawaiId
              }

              onChange={(
                e: React.ChangeEvent<HTMLSelectElement>
              ) =>

                setForm({

                  ...form,

                  pegawaiId:
                    e.target.value,
                })
              }

            >

              <option value="">
                Pilih Pegawai
              </option>

              {

                pegawaiList.map(
                  (pegawai) => (

                    <option

                      key={
                        pegawai._id
                      }

                      value={
                        pegawai._id
                      }
                    >

                      {
                        pegawai.nama
                      }

                    </option>
                  )
                )
              }

            </SelectField>

          </div>

        </Section>

        {/* =====================================================
            CATATAN
        ===================================================== */}

        <Section title="Catatan Tambahan">

          <TextareaField

            label="Informasi Tambahan"

            icon={
              <FileText
                size={18}
              />
            }

            value={
              form.catatan
            }

            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement>
            ) =>

              setForm({

                ...form,

                catatan:
                  e.target.value,
              })
            }

            placeholder="
              Tambahkan catatan, request client, detail venue, atau informasi lainnya
            "
          />

        </Section>

        {/* =====================================================
            INFO
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
              Pastikan tanggal, catatan, dan pegawai sudah benar sebelum menyimpan jadwal acara.
            </p>

          </div>

        </div>

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

          form="jadwal-form"

          disabled={loading}

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
              loading

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
   SELECT FIELD
========================================================= */

function SelectField({

  label,

  icon,

  children,

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

          pointer-events-none

          z-10

        ">
          {icon}
        </div>

        <select

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
        >

          {children}

        </select>

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