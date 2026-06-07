"use client";

import {

  useState,

} from "react";

import Image from "next/image";

import toast from "react-hot-toast";

import {

  CreditCard,

  Upload,

  Landmark,

  User2,

  Receipt,

  CheckCircle2,

  X,

} from "lucide-react";

import BaseModal from "@/components/form/BaseModal";

import {

  createPayment,

} from "@/services/payment.service";

/* =========================================================
   TYPES
========================================================= */

type Props = {

  open: boolean;

  onClose: () => void;

  ticketId: string;

  onSuccess?: () => void;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentUploadModal({

  open,

  onClose,

  ticketId,

  onSuccess,

}: Props) {

  /* =====================================================
     STATE
  ===================================================== */

  const [loading, setLoading] =
    useState(false);

  const [preview, setPreview] =
    useState("");

  const [file, setFile] =
    useState<File | null>(
      null
    );

  const [form, setForm] =
    useState({

      tipe: "DP1",

      nama_pengirim: "",

      bank_pengirim: "",
    });

  /* =====================================================
     CHANGE
  ===================================================== */

  const handleChange =
    (
      e: any
    ) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,
      });
    };

  /* =====================================================
     FILE
  ===================================================== */

  const handleFile =
    (
      e: any
    ) => {

      const selected =
        e.target.files?.[0];

      if (!selected) {
        return;
      }

      setFile(selected);

      setPreview(

        URL.createObjectURL(
          selected
        )
      );
    };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async (
      e: any
    ) => {

      e.preventDefault();

      try {

        if (!file) {

          toast.error(
            "Upload bukti transfer terlebih dahulu"
          );

          return;
        }

        if (
          !form.nama_pengirim.trim()
        ) {

          toast.error(
            "Nama pengirim wajib diisi"
          );

          return;
        }

        if (
          !form.bank_pengirim.trim()
        ) {

          toast.error(
            "Bank pengirim wajib diisi"
          );

          return;
        }

        setLoading(true);

        const fd =
          new FormData();

        fd.append(
          "ticketId",
          ticketId
        );

        fd.append(
          "tipe",
          form.tipe
        );

        fd.append(
          "nama_pengirim",
          form.nama_pengirim
        );

        fd.append(
          "bank_pengirim",
          form.bank_pengirim
        );

        fd.append(
          "bukti_bayar",
          file
        );

        await createPayment(
          fd
        );

        toast.success(
          "Pembayaran berhasil dikirim"
        );

        setFile(null);

        setPreview("");

        setForm({

          tipe: "DP1",

          nama_pengirim: "",

          bank_pengirim: "",
        });

        onClose();

        onSuccess?.();

      } catch (err: any) {

        console.error(err);

        toast.error(

          err?.response?.data
            ?.message ||

          "Gagal upload pembayaran"
        );

      } finally {

        setLoading(false);
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

              Upload{" "}

              <span className="
                text-[#64748B]
              ">
                pembayaran
              </span>

            </h2>

            <div className="

              h-10
              px-4

              rounded-2xl

              bg-emerald-50

              border
              border-emerald-200

              text-emerald-700

              inline-flex
              items-center
              justify-center

              text-sm
              font-semibold

            ">

              Payment

            </div>

          </div>

          <p className="

            text-slate-500
            text-sm

            mt-3

          ">
            Upload bukti transfer pembayaran untuk proses verifikasi pesanan
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

        id="payment-form"

        onSubmit={handleSubmit}

        className="

          px-8
          py-8

          space-y-7

          overflow-y-auto

        "
      >

        {/* =====================================================
            INFORMASI PEMBAYARAN
        ===================================================== */}

        <Section title="Informasi Pembayaran">

          <div className="

            grid
            grid-cols-1
            md:grid-cols-2

            gap-5

          ">

            {/* TIPE */}
            <SelectField

              label="Tipe Pembayaran"

              icon={
                <CreditCard
                  size={18}
                />
              }

              name="tipe"

              value={
                form.tipe
              }

              onChange={
                handleChange
              }

            >

            <option value="DP1">
              DP 1 (20%)
            </option>

            <option value="DP2">
              DP 2 (30%)
            </option>

            <option value="PELUNASAN">
              Pelunasan Akhir(50%)
            </option>

            <option value="LUNAS">
              Bayar Sekali Lunas (100%)
            </option>

            </SelectField>

            {/* NAMA */}
            <InputField

              label="Nama Pengirim"

              icon={
                <User2
                  size={18}
                />
              }

              type="text"

              name="nama_pengirim"

              value={
                form.nama_pengirim
              }

              onChange={
                handleChange
              }

              placeholder="
                Nama pemilik rekening
              "
            />

            {/* BANK */}
            <div className="
              md:col-span-2
            ">

              <InputField

                label="Bank Pengirim"

                icon={
                  <Landmark
                    size={18}
                  />
                }

                type="text"

                name="bank_pengirim"

                value={
                  form.bank_pengirim
                }

                onChange={
                  handleChange
                }

                placeholder="
                  Contoh: BCA, Mandiri, BNI
                "
              />

            </div>

          </div>

        </Section>

        {/* =====================================================
            UPLOAD
        ===================================================== */}

        <Section title="Bukti Transfer">

          <div className="
            space-y-5
          ">

            <label className="

              relative

              flex
              flex-col
              items-center
              justify-center

              gap-4

              border-2
              border-dashed
              border-slate-300

              rounded-[30px]

              bg-slate-50

              p-10

              cursor-pointer

              hover:border-slate-400
              hover:bg-slate-100/60

              transition

            ">

              <div className="

                w-16
                h-16

                rounded-3xl

                bg-[#0F172A]

                text-white

                flex
                items-center
                justify-center

              ">

                <Upload
                  size={26}
                />

              </div>

              <div className="
                text-center
              ">

                <p className="

                  text-base
                  font-semibold

                  text-[#0F172A]

                ">
                  Upload Bukti Transfer
                </p>

                <p className="

                  text-sm
                  text-slate-500

                  mt-2

                ">
                  PNG, JPG, JPEG maksimal 5MB
                </p>

              </div>

              <input

                type="file"

                accept="image/*"

                onChange={
                  handleFile
                }

                className="
                  hidden
                "
              />

            </label>

            {/* PREVIEW */}
            {

              preview && (

                <div className="

                  overflow-hidden

                  rounded-[30px]

                  border
                  border-slate-200

                  bg-white

                  p-4

                ">

                  <div className="

                    relative

                    w-full
                    h-[320px]

                    rounded-[24px]

                    overflow-hidden

                  ">

                    <Image

                      src={preview}

                      alt="Preview"

                      fill

                      className="
                        object-cover
                      "
                    />

                  </div>

                </div>
              )
            }

          </div>

        </Section>

        {/* =====================================================
            INFO
        ===================================================== */}

        <div className="

          rounded-[30px]

          border
          border-emerald-200

          bg-emerald-50

          p-5

          flex
          items-start

          gap-4

        ">

          <div className="

            w-11
            h-11

            rounded-2xl

            bg-emerald-100

            flex
            items-center
            justify-center

            text-emerald-700

            shrink-0

          ">

            <CheckCircle2
              size={20}
            />

          </div>

          <div>

            <h4 className="

              text-sm
              font-semibold

              text-emerald-900

            ">
              Informasi Pembayaran
            </h4>

            <p className="

              text-sm

              text-emerald-700

              mt-1

              leading-relaxed

            ">
              Setelah pembayaran dikirim, admin akan melakukan verifikasi terlebih dahulu sebelum pembayaran dikonfirmasi.
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
        justify-between

        gap-5
        flex-wrap

      ">

        <p className="

          text-sm
          text-slate-500

        ">
          Pastikan bukti transfer terlihat jelas sebelum dikirim.
        </p>

        <button

          type="submit"

          form="payment-form"

          disabled={loading}

          className={`

            h-14
            px-8

            rounded-2xl

            bg-[#0F172A]

            text-white

            text-sm
            font-semibold

            inline-flex
            items-center
            justify-center

            gap-2

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

          <Upload
            size={17}
          />

          {

            loading

              ? "Mengupload..."

              : "Kirim Pembayaran"
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

      rounded-[32px]

      bg-white

      p-6

      space-y-5

      shadow-sm

    ">

      <h3 className="

        text-[26px]
        font-bold

        tracking-tight

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

    <div className="
      space-y-2
    ">

      <label className="

        text-sm
        font-medium

        text-slate-700

      ">
        {label}
      </label>

      <div className="
        relative
      ">

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
            focus:ring-4
            focus:ring-slate-100

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

    <div className="
      space-y-2
    ">

      <label className="

        text-sm
        font-medium

        text-slate-700

      ">
        {label}
      </label>

      <div className="
        relative
      ">

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
            focus:ring-4
            focus:ring-slate-100

          "
        >

          {children}

        </select>

      </div>

    </div>
  );
}