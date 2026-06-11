"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import Link from "next/link";

import {
  CalendarDays,
  CreditCard,
  FileText,
  MapPin,
  User,
  Wallet,
  Upload,
  Star
} from "lucide-react";

import { getTicketFull, exportInvoice } from "@/services/ticket.service";
import toast from "react-hot-toast";
import { reviewService } from "@/services/review.service";
import PaymentUploadForm from "@/components/form/PaymentUploadForm";

const formatRupiah = (
  num: number
) =>
  "Rp " +
  (num || 0).toLocaleString(
    "id-ID"
  );

const getStatusColor = (
  status: string
) => {

  const map: any = {

    pending:
      "bg-gray-100 text-gray-700",

    approved:
      "bg-yellow-100 text-yellow-700",

    in_progress:
      "bg-blue-100 text-blue-700",

    done:
      "bg-green-100 text-green-700",

    rejected:
      "bg-red-100 text-red-700",
  };

  return (
    map[status] ||
    "bg-gray-100 text-gray-700"
  );
};

export default function OrderDetailPage() {

  const params =
    useParams();

  const id =
    params?.id as string;

  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<any>(null);

  const [openPayment, setOpenPayment] =
    useState(false);

  /* =========================================================
     FETCH
  ========================================================= */

  useEffect(() => {

    if (id) {

      fetchDetail();
    }

  }, [id]);

  const [rating, setRating] =
    useState(5);

  const [komentar, setKomentar] =
    useState("");

  const fetchDetail =
    async () => {

      try {

        setLoading(true);

        const res =
          await getTicketFull(id);

        setData(
          res.data
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    };

  const handleReview =
    async () => {

      try {

        if (!komentar.trim()) {

          toast.error(
            "Komentar wajib diisi"
          );

          return;
        }

        await reviewService.create({

          ticketId: ticket._id,

          rating,

          komentar,

        });

        toast.success(
          "Review berhasil dikirim"
        );

        fetchDetail();

      } catch (err: any) {

        toast.error(

          err?.response?.data?.message ||

          "Gagal mengirim review"
        );
      }
    };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (

      <div className="
        rounded-[2rem]
        border
        bg-white
        p-10
        text-center
        text-gray-500
      ">

        Loading...

      </div>
    );
  }

  /* =========================================================
     DATA
  ========================================================= */

  const ticket =
    data?.ticket;

  const detail =
    data?.detail;

  const jadwal =
    data?.jadwal;

  const payments =
    data?.payments || [];

  const summary =
    data?.paymentSummary;

  const logs =
    data?.logs || [];

  const layanan =
    ticket?.layananId;

  const pegawai =
    ticket?.pegawaiId;

  const review =
    data?.review;

  const referensiImage =
  detail?.referensi
    ? (
        detail.referensi.startsWith("blob:")
          ? detail.referensi
          : detail.referensi.startsWith("http")
            ? detail.referensi
            : `${process.env.NEXT_PUBLIC_IMAGE_URL}${detail.referensi}`
      )
    : "";

  return (

    <>

      <div className="
        max-w-7xl
        mx-auto
        space-y-12
      ">

        {/* =====================================================
           HEADER
        ===================================================== */}

        <div className="
          pb-10
          border-b
          border-gray-200
        ">

          <div className="
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          ">

            <div>

              <div className="
                flex
                flex-wrap
                items-center
                gap-3
              ">

                <span className={`
                  rounded-xl
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  ${getStatusColor(ticket?.status)}
                `}>

                  {
                    ticket?.status
                  }

                </span>

                <p className="
                  text-sm
                  text-gray-500
                ">
                  Ticket ID:
                  {" "}
                  {
                    ticket?._id
                  }
                </p>

              </div>

              <h1 className="
                mt-6
                text-5xl
                font-bold
                tracking-tight
                text-[#111827]
              ">

                {
                  detail?.nama_acara ||
                  "Acara"
                }

              </h1>

              <div className="
                mt-5
                flex
                flex-wrap
                gap-6
              ">

                <div className="
                  flex
                  items-center
                  gap-2
                  text-gray-600
                ">

                  <MapPin size={18} />

                  {
                    detail?.lokasi ||
                    "-"
                  }

                </div>

                <div className="
                  flex
                  items-center
                  gap-2
                  text-gray-600
                ">

                  <CalendarDays size={18} />

                  {
                    detail?.tanggal_acara

                      ? new Date(
                          detail.tanggal_acara
                        ).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )

                      : "-"
                  }

                </div>

              </div>

            </div>

            <div className="
              flex
              flex-wrap
              gap-3
            ">

              <button
                onClick={() => exportInvoice(ticket._id)}
                className="
                  rounded-full
                  bg-[#111827]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                "
              >
                Download Invoice
              </button>

              <Link
                href="/profile/orders"
                className="
                  rounded-full
                  border
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  transition
                  hover:bg-gray-100
                "
              >
                Kembali
              </Link>

            </div>

          </div>

        </div>

        {/* =====================================================
           GRID
        ===================================================== */}

        <div className="
          grid
          gap-8
          xl:grid-cols-[minmax(0,1fr)_360px]
        ">

          {/* ===================================================
             LEFT
          =================================================== */}

          <div
            className="
              space-y-8
              xl:sticky
              xl:top-6
              h-fit
            "
          >

            {/* =================================================
               DETAIL ACARA
            ================================================= */}

            <div className="
              rounded-[32px]
              border
              border-gray-200
              bg-white
              p-10
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <FileText size={22} />

                <h2 className="
                  text-2xl
                  font-bold
                ">
                  Detail Acara
                </h2>

              </div>

              <div className="
                mt-8
                grid
                gap-8
                md:grid-cols-2
              ">

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Nama Acara
                  </p>

                  <p className="
                    mt-2
                    text-lg
                    font-semibold
                  ">
                    {
                      detail?.nama_acara ||
                      "-"
                    }
                  </p>

                </div>

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Lokasi
                  </p>

                  <p className="
                    mt-2
                    text-lg
                    font-semibold
                  ">
                    {
                      detail?.lokasi ||
                      "-"
                    }
                  </p>

                </div>

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Tanggal Acara
                  </p>

                  <p className="
                    mt-2
                    text-lg
                    font-semibold
                  ">

                    {
                      detail?.tanggal_acara

                        ? new Date(
                            detail.tanggal_acara
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )

                        : "-"
                    }

                  </p>

                </div>

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Referensi Dekorasi
                  </p>

                  {detail?.referensi && (

                    <div className="mt-8">

                  <img
                    src={referensiImage}
                    alt="Referensi Dekorasi"
                    className="
                      mt-3
                      w-full
                      max-w-md
                      rounded-2xl
                      border
                      object-cover
                    "
                  />

                    </div>

                  )}
                </div>

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Layanan
                  </p>

                  <p className="
                    mt-2
                    text-lg
                    font-semibold
                  ">
                    {
                      layanan?.nama ||
                      "-"
                    }
                  </p>

                </div>

              </div>

              <div className="
                mt-8
              ">

                <p className="
                  text-sm
                  text-gray-500
                ">
                  Catatan
                </p>

                <div className="
                  mt-3
                  rounded-2xl
                  bg-gray-50
                  p-5
                  text-gray-700
                ">

                  {
                    detail?.catatan ||
                    "Tidak ada catatan tambahan."
                  }

                </div>

              </div>

            </div>

            {/* =================================================
               PAYMENT HISTORY
            ================================================= */}
            <div className="
              rounded-[32px]
              border
              border-gray-200
              bg-white
              p-10
            ">

              <div className="
                flex
                items-center
                justify-between
                gap-4
                flex-wrap
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <Wallet size={22} />

                  <h2 className="
                    text-2xl
                    font-bold
                  ">
                    Riwayat Pembayaran
                  </h2>

                </div>

                {/* BUTTON */}
                <button

                  onClick={() =>
                    setOpenPayment(true)
                  }

                  className="

                    h-12
                    px-5

                    rounded-2xl

                    bg-[#0F172A]

                    text-white

                    text-sm
                    font-semibold

                    inline-flex
                    items-center
                    justify-center

                    gap-2

                    hover:opacity-90

                    transition

                  "
                >

                  <Upload size={17} />

                  Upload Pembayaran

                </button>

              </div>

              <div className="
                mt-8
                space-y-4
              ">

                {
                  payments.length === 0 ? (

                    <div className="
                      rounded-2xl
                      bg-gray-50
                      p-6
                      text-center
                      text-gray-500
                    ">

                      Belum ada pembayaran.

                    </div>

                  ) : (

                    payments.map(
                      (item: any) => (

                        <div
                          key={item._id}
                          className="
                            rounded-[28px]
                            border
                            border-gray-200
                            p-6
                            transition-all
                            hover:border-gray-300
                          "
                        >

                          <div className="
                            flex
                            flex-col
                            gap-4
                            md:flex-row
                            md:items-center
                            md:justify-between
                          ">

                            <div>

                              <div className="
                                flex
                                items-center
                                gap-3
                              ">

                                <span className="
                                  rounded-xl
                                  bg-black
                                  px-3
                                  py-1
                                  text-xs
                                  font-semibold
                                  text-white
                                ">

                                  {
                                    item.tipe
                                  }

                                </span>

                                <span className={`
                                  rounded-xl
                                  px-3
                                  py-1
                                  text-xs
                                  font-semibold

                                  ${
                                    item.status === "approved"

                                      ? `
                                        bg-green-100
                                        text-green-700
                                      `

                                      : item.status === "pending"

                                        ? `
                                          bg-yellow-100
                                          text-yellow-700
                                        `

                                        : `
                                          bg-red-100
                                          text-red-700
                                        `
                                  }
                                `}>

                                  {
                                    item.status
                                  }

                                </span>

                              </div>

                              <h3 className="
                                mt-4
                                text-2xl
                                font-bold
                              ">

                                {
                                  formatRupiah(
                                    item.jumlah
                                  )
                                }

                              </h3>

                              <p className="
                                mt-2
                                text-sm
                                text-gray-500
                              ">

                                {
                                  item.createdAt

                                    ? new Date(
                                        item.createdAt
                                      ).toLocaleDateString(
                                        "id-ID",
                                        {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                        }
                                      )

                                    : "-"
                                }

                              </p>

                            </div>

                            {
                              item.catatan && (

                                <div className="
                                  max-w-sm
                                  rounded-2xl
                                  bg-gray-50
                                  p-4
                                  text-sm
                                  text-gray-600
                                ">

                                  {
                                    item.catatan
                                  }

                                </div>
                              )
                            }

                          </div>

                        </div>
                      )
                    )
                  )
                }

              </div>

            </div>

            {/* =================================================
              REVIEW
            ================================================= */}
            <div className="
              rounded-[32px]
              border
              border-gray-200
              bg-white
              p-8
            ">

              <h2 className="
                text-2xl
                font-bold
              ">
                Ulasan Pelanggan
              </h2>

              {
                review ? (

                  <div className="
                    mt-6
                    space-y-5
                  ">

                    <div className="
                      flex
                      items-center
                      gap-1
                    ">

                      {
                        [...Array(5)].map(
                          (_, i) => (

                            <Star
                              key={i}
                              size={18}
                              fill={
                                i < review.rating

                                  ? "currentColor"

                                  : "none"
                              }
                              className={
                                i < review.rating

                                  ? "text-yellow-500"

                                  : "text-gray-300"
                              }
                            />

                          )
                        )
                      }

                    </div>

                    <div className="
                      rounded-2xl
                      bg-gray-50
                      p-4
                      text-gray-700
                    ">
                      {review.komentar}
                    </div>

                    <div className="
                      text-sm
                      text-green-600
                      font-medium
                    ">
                      ✓ Ulasan sudah dikirim
                    </div>

                  </div>

                ) : (

                  <div className="
                    mt-6
                    space-y-5
                  ">

                    <p className="
                      text-sm
                      text-gray-500
                    ">
                      Bagikan pengalaman Anda menggunakan layanan FLORALESS.
                    </p>

                    <div className="
                      flex
                      items-center
                      gap-2
                    ">

                      {
                        [...Array(5)].map(
                          (_, i) => (

                            <button
                              key={i}
                              disabled={
                                ticket?.status !==
                                "done"
                              }
                              onClick={() =>
                                setRating(
                                  i + 1
                                )
                              }
                            >

                              <Star
                                size={24}
                                fill={
                                  i < rating

                                    ? "currentColor"

                                    : "none"
                                }
                                className={
                                  i < rating

                                    ? "text-yellow-500"

                                    : "text-gray-300"
                                }
                              />

                            </button>

                          )
                        )
                      }

                    </div>

                    <textarea
                      value={komentar}
                      disabled={
                        ticket?.status !==
                        "done"
                      }
                      onChange={(e) =>
                        setKomentar(
                          e.target.value
                        )
                      }
                      rows={4}
                      placeholder="Tuliskan pengalaman Anda..."
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-gray-200
                        p-4
                        resize-none

                        disabled:bg-gray-100
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    />

                    {
                      ticket?.status !==
                      "done" && (

                        <div className="
                          rounded-2xl
                          bg-amber-50
                          border
                          border-amber-200
                          p-4
                          text-sm
                          text-amber-700
                        ">
                          Review hanya dapat diberikan setelah acara selesai.
                        </div>

                      )
                    }

                    <button

                      disabled={
                        ticket?.status !==
                        "done"
                      }

                      onClick={() => {

                        toast((t) => (

                          <div className="w-[300px]">

                            <p className="font-semibold text-sm">
                              Kirim Ulasan?
                            </p>

                            <p className="
                              text-sm
                              text-gray-500
                              mt-1
                            ">
                              Ulasan hanya dapat dikirim satu kali dan tidak dapat diubah kembali.
                            </p>

                            <div className="
                              flex
                              justify-end
                              gap-2
                              mt-4
                            ">

                              {/* BATAL */}
                              <button

                                onClick={() =>
                                  toast.dismiss(
                                    t.id
                                  )
                                }

                                className="
                                  px-3
                                  py-2
                                  rounded-xl
                                  border
                                  text-sm
                                  hover:bg-gray-50
                                "
                              >

                                Batal

                              </button>

                              {/* YA */}
                              <button

                                onClick={async () => {

                                  toast.dismiss(
                                    t.id
                                  );

                                  await handleReview();

                                }}

                                className="
                                  px-3
                                  py-2
                                  rounded-xl
                                  bg-green-500
                                  text-white
                                  text-sm
                                  hover:bg-green-600
                                "
                              >

                                Ya, Kirim

                              </button>

                            </div>

                          </div>

                        ), {
                          duration: 10000,
                        });

                      }}

                      className="
                        h-12
                        px-6
                        rounded-2xl
                        bg-[#111827]
                        text-white
                        font-medium

                        disabled:bg-gray-300
                        disabled:cursor-not-allowed
                      "
                    >

                      Kirim Ulasan

                    </button>

                  </div>

                )
              }

            </div>

          </div>

          {/* ===================================================
             RIGHT
          =================================================== */}

          <div className="
            space-y-8
          ">

            {/* =================================================
               PIC & JADWAL
            ================================================= */}

            <div className="
              rounded-[32px]
              border
              border-gray-200
              bg-white
              p-8
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <User size={22} />

                <h2 className="
                  text-2xl
                  font-bold
                ">
                  PIC & Jadwal
                </h2>

              </div>

              <div className="
                mt-8
                space-y-6
              ">

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    PIC
                  </p>

                  <p className="
                    mt-2
                    text-lg
                    font-semibold
                  ">

                    {
                      pegawai?.nama ||
                      "Belum ditentukan"
                    }

                  </p>

                </div>

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Status Jadwal
                  </p>

                  <p className="
                    mt-2
                    text-lg
                    font-semibold
                  ">

                    {
                      jadwal?.status ||
                      "-"
                    }

                  </p>

                </div>

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Tanggal Acara
                  </p>

                  <p className="
                    mt-2
                    text-lg
                    font-semibold
                  ">

                    {
                      jadwal?.tanggal_acara

                        ? new Date(
                            jadwal.tanggal_acara
                          ).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )

                        : "-"
                    }

                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
               PAYMENT SUMMARY
            ================================================= */}

            <div className="
              rounded-[32px]
              border
              border-gray-200
              bg-white
              p-8
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <CreditCard size={22} />

                <h2 className="
                  text-2xl
                  font-bold
                ">
                  Payment Summary
                </h2>

              </div>

              <div className="
                mt-8
                space-y-6
              ">

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Total Harga
                  </p>

                  <p className="
                    mt-2
                    text-3xl
                    font-bold
                  ">

                    {
                      formatRupiah(
                        summary?.totalHarga || 0
                      )
                    }

                  </p>

                </div>

                <div className="
                  rounded-2xl
                  bg-green-50
                  p-5
                ">

                  <p className="
                    text-sm
                    text-green-700
                  ">
                    Total Dibayar
                  </p>

                  <p className="
                    mt-2
                    text-2xl
                    font-bold
                    text-green-700
                  ">

                    {
                      formatRupiah(
                        summary?.totalDibayar || 0
                      )
                    }

                  </p>

                </div>

                <div className="
                  rounded-2xl
                  bg-red-50
                  p-5
                ">

                  <p className="
                    text-sm
                    text-red-700
                  ">
                    Sisa Tagihan
                  </p>

                  <p className="
                    mt-2
                    text-2xl
                    font-bold
                    text-red-700
                  ">

                    {
                      formatRupiah(
                        summary?.sisa || 0
                      )
                    }

                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
               ACTIVITY LOGS
            ================================================= */}

            <div className="
              rounded-[32px]
              border
              border-gray-200
              bg-white
              p-10
            ">

              <h2 className="
                text-2xl
                font-bold
              ">
                Activity Timeline
              </h2>

              <div className="
                mt-10
                space-y-6
              ">

                {
                  logs.length === 0 ? (

                    <div className="
                      rounded-2xl
                      bg-gray-50
                      p-6
                      text-center
                      text-gray-500
                    ">

                      Belum ada aktivitas.

                    </div>

                  ) : (

                    logs.map(
                      (log: any, index: number) => (

                        <div
                          key={log._id}
                          className="
                            relative
                            flex
                            gap-5
                          "
                        >

                          {
                            index !==
                            logs.length - 1 && (

                              <div className="
                                absolute
                                left-[15px]
                                top-8
                                h-full
                                w-[2px]
                                bg-gray-200
                              " />
                            )
                          }

                          <div className="
                            relative
                            z-10
                            mt-1
                            h-8
                            w-8
                            rounded-full
                            bg-black
                          " />

                          <div className="
                            rounded-[24px]
                            border
                            border-gray-200
                            bg-white
                            p-6
                          ">

                            <div className="
                              flex
                              flex-wrap
                              items-center
                              justify-between
                              gap-3
                            ">

                              <h3 className="
                                font-bold
                              ">

                                {
                                  log.action
                                }

                              </h3>

                              <p className="
                                text-sm
                                text-gray-500
                              ">

                                {
                                  log.createdAt

                                    ? new Date(
                                        log.createdAt
                                      ).toLocaleString(
                                        "id-ID"
                                      )

                                    : "-"
                                }

                              </p>

                            </div>

                            <p className="
                              mt-3
                              text-gray-600
                            ">

                              {
                                log.description
                              }

                            </p>

                          </div>

                        </div>
                      )
                    )
                  )
                }

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
         PAYMENT MODAL
      ===================================================== */}

      <PaymentUploadForm

        open={openPayment}

        onClose={() =>
          setOpenPayment(false)
        }

        ticketId={ticket._id}

        onSuccess={() => {

          fetchDetail();

          setOpenPayment(false);
        }}
      />

    </>
  );
}