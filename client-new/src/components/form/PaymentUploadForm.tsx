"use client";

import {
  useState,
} from "react";

import Image
from "next/image";

import {
  createPayment,
} from "@/services/payment.service";

type Props = {

  ticketId: string;

  onSuccess?: () => void;
};

export default function PaymentUploadForm({
  ticketId,
  onSuccess,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [preview, setPreview] =
    useState("");

  const [form, setForm] =
    useState({

      tipe: "DP1",

      nama_pengirim: "",

      bank_pengirim: "",
    });

  const [file, setFile] =
    useState<File | null>(
      null
    );

  /* =========================================================
     CHANGE
  ========================================================= */

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

  /* =========================================================
     FILE
  ========================================================= */

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

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit =
    async (
      e: any
    ) => {

      e.preventDefault();

      try {

        if (!file) {

          return alert(
            "Upload bukti transfer"
          );
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

        alert(
          "Payment berhasil dikirim"
        );

        setFile(null);

        setPreview("");

        setForm({

          tipe: "DP1",

          nama_pengirim: "",

          bank_pengirim: "",
        });

        onSuccess?.();

      } catch (err: any) {

        console.error(err);

        alert(

          err?.response?.data
            ?.message ||

          "Gagal upload payment"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <form
      onSubmit={handleSubmit}
      className="
        rounded-[2rem]
        border
        bg-white
        p-8
        shadow-sm
      "
    >

      {/* =====================================================
         HEADER
      ===================================================== */}

      <div>

        <p className="
          text-sm
          uppercase
          tracking-[0.3em]
          text-[#C9AE63]
        ">
          Payment
        </p>

        <h2 className="
          mt-3
          text-3xl
          font-bold
        ">
          Upload Pembayaran
        </h2>

        <p className="
          mt-4
          text-gray-600
        ">
          Upload bukti transfer pembayaran
          untuk melanjutkan proses dekorasi.
        </p>

      </div>

      {/* =====================================================
         FORM
      ===================================================== */}

      <div className="
        mt-8
        grid
        gap-6
      ">

        {/* ===================================================
           TIPE
        =================================================== */}

        <div>

          <label className="
            text-sm
            font-medium
          ">
            Tipe Pembayaran
          </label>

          <select
            name="tipe"
            value={form.tipe}
            onChange={handleChange}
            className="
              mt-2
              w-full
              rounded-2xl
              border
              px-5
              py-4
              outline-none
            "
          >

            <option value="DP1">
              DP1
            </option>

            <option value="DP2">
              DP2
            </option>

            <option value="PELUNASAN">
              Pelunasan
            </option>

          </select>

        </div>

        {/* ===================================================
           NAMA
        =================================================== */}

        <div>

          <label className="
            text-sm
            font-medium
          ">
            Nama Pengirim
          </label>

          <input
            type="text"
            name="nama_pengirim"
            value={
              form.nama_pengirim
            }
            onChange={handleChange}
            placeholder="Nama rekening pengirim"
            className="
              mt-2
              w-full
              rounded-2xl
              border
              px-5
              py-4
              outline-none
            "
            required
          />

        </div>

        {/* ===================================================
           BANK
        =================================================== */}

        <div>

          <label className="
            text-sm
            font-medium
          ">
            Bank Pengirim
          </label>

          <input
            type="text"
            name="bank_pengirim"
            value={
              form.bank_pengirim
            }
            onChange={handleChange}
            placeholder="BCA / BRI / Mandiri"
            className="
              mt-2
              w-full
              rounded-2xl
              border
              px-5
              py-4
              outline-none
            "
            required
          />

        </div>

        {/* ===================================================
           FILE
        =================================================== */}

        <div>

          <label className="
            text-sm
            font-medium
          ">
            Bukti Transfer
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="
              mt-2
              block
              w-full
            "
            required
          />

        </div>

        {/* ===================================================
           PREVIEW
        =================================================== */}

        {
          preview && (

            <div className="
              overflow-hidden
              rounded-3xl
              border
            ">

              <Image
                src={preview}
                alt="preview"
                width={1200}
                height={900}
                className="
                  h-auto
                  w-full
                  object-cover
                "
              />

            </div>
          )
        }

      </div>

      {/* =====================================================
         ACTION
      ===================================================== */}

      <div className="
        mt-10
      ">

        <button
          type="submit"
          disabled={loading}
          className="
            rounded-full
            bg-black
            px-8
            py-4
            text-sm
            font-semibold
            text-white
            transition
            hover:opacity-90
            disabled:opacity-50
          "
        >

          {
            loading

              ? "Uploading..."

              : "Upload Pembayaran"
          }

        </button>

      </div>

    </form>
  );
}