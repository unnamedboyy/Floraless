"use client";

import {

  useState,

} from "react";

import {

  useRouter,

} from "next/navigation";

import toast from "react-hot-toast";

import {

  CalendarDays,

  MapPin,

  Sparkles,

  FileText,

  Send,

  HeartHandshake,

} from "lucide-react";

import {

  createTicket,

} from "@/services/ticket.service";

import {

  useLayanan,

} from "@/hooks/useLayanan";

import api from "@/lib/axios";
import Image from "next/image";

/* =========================================================
   COMPONENT
========================================================= */

export default function BookingForm() {

  const router =
    useRouter();

  /* =====================================================
     LAYANAN
  ===================================================== */

  const {

    data: layananList,

  } = useLayanan({});

  /* =====================================================
     STATE
  ===================================================== */

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      layananId: "",

      tanggal: "",

      lokasi: "",

      nama_acara: "",

      catatan: "",

      referensi: "",
    });

  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (

    e: React.ChangeEvent<

      HTMLInputElement |

      HTMLTextAreaElement |

      HTMLSelectElement

    >

  ) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,
    });
    };

  const handleUploadReferensi = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;

    try {

      const fd = new FormData();

      fd.append("image", file);

      const res = await api.post(
        "/upload/referensi",
        fd,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setForm((prev) => ({
        ...prev,
        referensi: res.data.url,
      }));

      toast.success(
        "Referensi berhasil diupload"
      );

    } catch (err) {

      toast.error(
        "Upload referensi gagal"
      );

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

        /* ================= VALIDATION ================= */

        if (
          !form.nama_acara.trim()
        ) {

          toast.error(
            "Nama acara wajib diisi"
          );

          return;
        }

        if (
          !form.layananId
        ) {

          toast.error(
            "Pilih layanan terlebih dahulu"
          );

          return;
        }

        if (
          !form.tanggal
        ) {

          toast.error(
            "Tanggal acara wajib diisi"
          );

          return;
        }

        if (
          !form.lokasi.trim()
        ) {

          toast.error(
            "Lokasi acara wajib diisi"
          );

          return;
        }

        /* ================= SUBMIT ================= */

        setLoading(true);

        await createTicket(form);

        toast.success(
          "Pemesanan berhasil dibuat"
        );

        router.push(
          "/profile/orders"
        );

      } catch (err: any) {

        console.error(err);

        toast.error(

          err?.response?.data?.message ||

          "Gagal membuat pemesanan"
        );

      } finally {

        setLoading(false);
      }
    };

  /* =====================================================
     UI
  ===================================================== */

  return (

    <form

      onSubmit={handleSubmit}

      className="

        rounded-[40px]

        border
        border-neutral-200

        bg-white

        shadow-sm

        overflow-hidden

      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="

        px-8
        py-8

        md:px-12

        border-b
        border-neutral-200

        flex
        items-start
        justify-between

        gap-5
        flex-wrap

      ">

        <div>

          <div className="
            flex
            items-center
            gap-3
            flex-wrap
          ">

            <h2 className="

              text-[42px]
              leading-none
              font-bold
              tracking-tight
              text-[#0F172A]

            ">

              Booking{" "}

              <span className="
                text-[#C9AE63]
              ">
                acara
              </span>

            </h2>

          </div>

          <p className="

            text-neutral-500
            text-sm

            mt-3

            max-w-2xl

          ">
            Isi formulir berikut untuk melakukan pemesanan dekorasi acara sesuai kebutuhan Anda.
          </p>

        </div>

      </div>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="

        px-8
        py-8

        md:px-12

        space-y-7

      ">

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

            {/* NAMA ACARA */}
            <div className="md:col-span-2">

              <InputField

                label="Nama Acara"

                icon={
                  <Sparkles
                    size={18}
                  />
                }

                type="text"

                name="nama_acara"

                value={
                  form.nama_acara
                }

                onChange={
                  handleChange
                }

                placeholder="
                  Contoh: Wedding Andini & Rizky
                "
              />

            </div>

            {/* LAYANAN */}
            <SelectField

              label="Pilih Layanan"

              icon={
                <HeartHandshake
                  size={18}
                />
              }

              name="layananId"

              value={
                form.layananId
              }

              onChange={
                handleChange
              }

            >

              <option value="">
                Pilih layanan
              </option>

              {

                layananList?.map(
                  (item: any) => (

                    <option

                      key={
                        item._id
                      }

                      value={
                        item._id
                      }
                    >

                      {item.nama}

                    </option>
                  )
                )
              }

            </SelectField>

            {/* TANGGAL */}
            <InputField

              label="Tanggal Acara"

              icon={
                <CalendarDays
                  size={18}
                />
              }

              type="date"

              name="tanggal"

              value={
                form.tanggal
              }

              onChange={
                handleChange
              }
            />

          </div>

        </Section>

        {/* =====================================================
            LOKASI
        ===================================================== */}

        <Section title="Lokasi Acara">

          <TextareaField

            icon={
              <MapPin
                size={18}
              />
            }

            name="lokasi"

            value={
              form.lokasi
            }

            onChange={
              handleChange
            }

            placeholder="
              Contoh: Hotel Royal Ambarrukmo Yogyakarta
            "
          />

        </Section>

        {/* =====================================================
            CATATAN
        ===================================================== */}

        <Section title="Catatan Tambahan">

          <TextareaField

            icon={
              <FileText
                size={18}
              />
            }

            name="catatan"

            value={
              form.catatan
            }

            onChange={
              handleChange
            }

            placeholder="
              Tuliskan tema, konsep acara, warna dekorasi, atau request tambahan lainnya
            "
          />

        </Section>

        <Section title="Referensi Dekorasi">

          <input
            type="file"
            accept="image/*"
            onChange={handleUploadReferensi}
            className="w-full"
          />

          {form.referensi && (

            <div className="mt-4">

              <img
                src={form.referensi}
                alt="Referensi"
                className="
                  w-full
                  max-w-md
                  rounded-2xl
                  border
                "
              />

            </div>

          )}

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

            <Send size={20} />

          </div>

          <div>

            <h4 className="

              text-sm
              font-semibold

              text-blue-900

            ">
              Informasi Booking
            </h4>

            <p className="

              text-sm

              text-blue-700

              mt-1

              leading-relaxed

            ">
              Setelah booking dikirim, tim Floraless akan segera menghubungi Anda untuk proses konsultasi dan konfirmasi acara.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="

        px-8
        py-6

        md:px-12

        border-t
        border-neutral-200

        bg-white

        flex
        justify-end

      ">

        <button

          type="submit"

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

          <Send size={16} />

          {

            loading

              ? "Mengirim..."

              : "Kirim Pemesanan"
          }

        </button>

      </div>

    </form>
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
      border-neutral-200

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

      <div className="
        relative
      ">

        <div className="

          absolute
          left-4
          top-1/2
          -translate-y-1/2

          text-neutral-400

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
            border-neutral-200

            bg-white

            text-sm

            outline-none

            transition

            focus:border-neutral-400

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

        text-neutral-700

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

          text-neutral-400

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
            border-neutral-200

            bg-white

            text-sm

            outline-none

            transition

            focus:border-neutral-400

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

      <div className="
        relative
      ">

        <div className="

          absolute
          left-4
          top-5

          text-neutral-400

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
            border-neutral-200

            bg-white

            text-sm

            outline-none

            resize-none

            transition

            focus:border-neutral-400

          "
        />

      </div>

    </div>
  );
}