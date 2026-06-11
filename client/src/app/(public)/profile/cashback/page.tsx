"use client";

import {
  useEffect,
  useState,
} from "react";

import api
from "@/lib/axios";

import CashbackHistoryDetailModal from "@/components/modal/CashbackHistoryDetailModal";
import toast from "react-hot-toast";


const formatRupiah = (
  num: number
) => {

  return "Rp " +

    (num || 0)
      .toLocaleString(
        "id-ID"
      );
};

export default function CashbackPage() {

  /* ======================================================
     STATE
  ====================================================== */

  const [loading, setLoading] =
    useState(true);

  const [claims, setClaims] =
    useState<any[]>([]);

  const [vouchers, setVouchers] =
    useState<any[]>([]);

  const [voucherCode, setVoucherCode] =
    useState("");

  const [bank, setBank] =
    useState("");

  const [nomorRekening,
    setNomorRekening] =
    useState("");

  const [namaRekening,
    setNamaRekening] =
    useState("");

  const [submitLoading,
    setSubmitLoading] =
    useState(false);

  const [selectedClaim,
    setSelectedClaim] =
    useState<any>(null);

  /* ======================================================
     FETCH
  ====================================================== */

const fetchData =
  async () => {

    try {

      setLoading(true);

      const [
        cashbackRes,
        voucherRes,
      ] = await Promise.all([

        api.get(
          "/cashback/me"
        ),

        api.get(
          "/vouchers/me"
        ),
      ]);

      /* =========================
         CASHBACK
      ========================= */

      const cashbackData =

        cashbackRes.data?.data ||

        cashbackRes.data ||

        [];

      /* =========================
         VOUCHER
      ========================= */

      const voucherData =

        voucherRes.data?.data ||

        voucherRes.data ||

        [];

      setClaims(
        cashbackData
      );

      setVouchers(
        voucherData
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  /* ======================================================
     SUBMIT CLAIM
  ====================================================== */

  const handleClaim =
    async (
      e: any
    ) => {

      e.preventDefault();

      try {

        if (!voucherCode) {

          toast.error(
            "Kode voucher wajib diisi"
          );
        }

        if (!bank) {

          toast.error(
            "Bank wajib diisi"
          );
        }

        if (!nomorRekening) {

          toast.error(
            "Nomor rekening wajib diisi"
          );
        }

        if (!namaRekening) {

          toast.error(
            "Nama rekening wajib diisi"
          );
        }

          toast((t) => (

            <div className="w-[300px]">

              <p className="font-semibold text-sm">
                Claim Cashback?
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Pastikan data rekening yang Anda masukkan sudah benar.
              </p>

              <div className="flex justify-end gap-2 mt-4">

                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="
                    px-3
                    py-2
                    rounded-xl
                    border
                    text-sm
                  "
                >
                  Batal
                </button>

                <button
                  onClick={async () => {

                    toast.dismiss(t.id);

                    try {

                      setSubmitLoading(true);

                      await api.post(
                        "/cashback/claim",
                        {
                          voucherCode,
                          bank,
                          nomor_rekening:
                            nomorRekening,
                          nama_rekening:
                            namaRekening,
                        }
                      );

                      toast.success(
                        "Claim cashback berhasil dikirim"
                      );

                      setVoucherCode("");
                      setBank("");
                      setNomorRekening("");
                      setNamaRekening("");

                      fetchData();

                    } catch (err: any) {

                      toast.error(
                        err?.response?.data?.message ??
                        "Gagal claim cashback"
                      );

                    } finally {

                      setSubmitLoading(false);

                    }

                  }}
                  className="
                    px-3
                    py-2
                    rounded-xl
                    bg-black
                    text-white
                    text-sm
                  "
                >
                  Claim
                </button>

              </div>

            </div>

          ), {
            duration: 10000,
          });

          return;

      } catch (err: any) {

        console.error(err);

        toast.error(

          err?.response?.data
            ?.message ||

          "Gagal claim cashback"
        );

      } finally {

        setSubmitLoading(false);
      }
    };

  /* ======================================================
     LOADING
  ====================================================== */

  if (loading) {

    return (

      <div
        className="
          rounded-[32px]
          border
          border-gray-200
          bg-white
          p-10
          text-center
          text-gray-500
        "
      >

        Loading cashback...

      </div>
    );
  }

  return (

    <>

      <div
        className="
          space-y-8
        "
      >

        {/* ===================================================
           HEADER
        =================================================== */}

        <div
          className="
            rounded-[32px]
            border
            border-gray-200
            bg-white
            p-10
          "
        >

          <p
            className="
              text-sm
              uppercase
              tracking-[0.35em]
              text-[#C9AE63]
              font-medium
            "
          >
            Cashback
          </p>

          <h1
            className="
              mt-4
              text-5xl
              font-bold
              tracking-tight
              text-[#111827]
            "
          >
            Cashback & Voucher
          </h1>

          <p
            className="
              mt-5
              max-w-3xl
              text-lg
              leading-8
              text-gray-500
            "
          >
            Kelola cashback dan voucher
            yang Anda miliki dari transaksi
            Floraless.
          </p>

          {/* =================================================
             STATS
          ================================================= */}

          <div
            className="
              mt-14
              grid
              gap-8
              md:grid-cols-3
            "
          >

            <div>

              <p
                className="
                  text-sm
                  uppercase
                  tracking-wider
                  text-gray-500
                "
              >
                Total Claim
              </p>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-bold
                  text-[#111827]
                "
              >
                {claims.length}
              </h2>

            </div>

            <div>

              <p
                className="
                  text-sm
                  uppercase
                  tracking-wider
                  text-gray-500
                "
              >
                Disetujui
              </p>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-bold
                  text-[#111827]
                "
              >
                {
                  claims.filter(
                    (item) =>
                      item.status ===
                      "approved"
                  ).length
                }
              </h2>

            </div>

            <div>

              <p
                className="
                  text-sm
                  uppercase
                  tracking-wider
                  text-gray-500
                "
              >
                Voucher Aktif
              </p>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-bold
                  text-[#111827]
                "
              >
                {
                  vouchers.filter(
                    (v) => !v.isUsed
                  ).length
                }
              </h2>

            </div>

          </div>

        </div>

        {/* ===================================================
           FORM
        =================================================== */}

        <form
          onSubmit={handleClaim}
          className="
            rounded-[32px]
            border
            border-gray-200
            bg-white
            p-10
          "
        >

          <div>

            <p
              className="
                text-sm
                uppercase
                tracking-[0.35em]
                text-[#C9AE63]
                font-medium
              "
            >
              Form
            </p>

            <h2
              className="
                mt-4
                text-2xl
                font-bold
                tracking-tight
                text-[#111827]
              "
            >
              Claim Cashback
            </h2>

            <p
              className="
                mt-2
                text-gray-500
              "
            >
              Masukkan data rekening untuk
              proses transfer cashback.
            </p>

          </div>

          <div
            className="
              mt-8
              grid
              gap-5
              md:grid-cols-2
            "
          >

            {/* VOUCHER */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#111827]
                "
              >
                Kode Voucher
              </label>

              <input
                type="text"
                value={voucherCode}
                onChange={(e) =>
                  setVoucherCode(
                    e.target.value
                  )
                }
                placeholder="Contoh: VC-XXXX"
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  px-5
                  outline-none
                  text-[#111827]
                  placeholder:text-gray-400
                  focus:border-[#C9AE63]
                  transition
                "
              />

            </div>

            {/* BANK */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#111827]
                "
              >
                Bank
              </label>

              <input
                type="text"
                value={bank}
                onChange={(e) =>
                  setBank(
                    e.target.value
                  )
                }
                placeholder="BCA / BRI / Mandiri"
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  px-5
                  outline-none
                  text-[#111827]
                  placeholder:text-gray-400
                  focus:border-[#C9AE63]
                  transition
                "
              />

            </div>

            {/* NO REK */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#111827]
                "
              >
                Nomor Rekening
              </label>

              <input
                type="text"
                value={nomorRekening}
                onChange={(e) =>
                  setNomorRekening(
                    e.target.value
                  )
                }
                placeholder="Nomor rekening"
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  px-5
                  outline-none
                  text-[#111827]
                  placeholder:text-gray-400
                  focus:border-[#C9AE63]
                  transition
                "
              />

            </div>

            {/* NAMA REK */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-[#111827]
                "
              >
                Nama Pemilik Rekening
              </label>

              <input
                type="text"
                value={namaRekening}
                onChange={(e) =>
                  setNamaRekening(
                    e.target.value
                  )
                }
                placeholder="Nama pemilik rekening"
                className="
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  px-5
                  outline-none
                  text-[#111827]
                  placeholder:text-gray-400
                  focus:border-[#C9AE63]
                  transition
                "
              />

            </div>

          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="
              mt-8
              h-14
              w-full
              rounded-2xl
              bg-[#111827]
              text-lg
              font-semibold
              text-white
              transition
              hover:opacity-90
              disabled:opacity-50
            "
          >

            {
              submitLoading

                ? "Loading..."

                : "Claim Cashback"
            }

          </button>

        </form>

        {/* =====================================================
           RIWAYAT CASHBACK
        ===================================================== */}

        <div
          className="
            rounded-[32px]
            border
            border-gray-200
            bg-white
            p-10
          "
        >

          <div
            className="
              pb-5
              border-b
              border-gray-300
            "
          >

            <h2
              className="
                text-2xl
                font-bold
                text-[#111827]
              "
            >
              Riwayat Cashback
            </h2>

            <p
              className="
                mt-2
                text-gray-500
              "
            >
              Status cashback yang pernah Anda claim.
            </p>

          </div>

          {
            claims.length === 0 ? (

              <div
                className="
                  py-24
                  text-center
                "
              >

                <h3
                  className="
                    text-3xl
                    font-bold
                    text-[#111827]
                  "
                >
                  Belum Ada Cashback
                </h3>

                <p
                  className="
                    mt-4
                    text-gray-500
                  "
                >
                  Anda belum memiliki
                  riwayat claim cashback.
                </p>

              </div>

            ) : (

              <div
                className="
                  mt-8
                  grid
                  gap-5
                "
              >

                {
                  claims.map(
                    (item: any) => (

                      <div
                        key={item._id}
                        className="
                          rounded-[28px]
                          border
                          border-gray-200
                          p-6
                        "
                      >

                        {/* HEADER */}
                        <div
                          className="
                            flex
                            flex-col
                            gap-4
                            md:flex-row
                            md:items-center
                            md:justify-between
                          "
                        >

                          <div>

                            <p
                              className="
                                text-xs
                                uppercase
                                tracking-widest
                                text-gray-400
                              "
                            >
                              Voucher
                            </p>

                            <h3
                              className="
                                mt-2
                                text-2xl
                                font-bold
                                text-[#111827]
                              "
                            >
                              {
                                item.kode_voucher
                              }
                            </h3>

                          </div>

                          <span className={`
                            inline-flex
                            w-fit
                            rounded-full
                            px-4
                            py-2
                            text-sm
                            font-semibold

                            ${
                              item.status ===
                              "approved"

                                ? `
                                  bg-green-100
                                  text-green-700
                                `

                                : item.status ===
                                  "rejected"

                                  ? `
                                      bg-red-100
                                      text-red-700
                                    `

                                  : `
                                      bg-yellow-100
                                      text-yellow-700
                                    `
                            }
                          `}>

                            {item.status}

                          </span>

                        </div>

                        {/* BODY */}
                        <div
                          className="
                            mt-6
                            grid
                            grid-cols-1
                            gap-5
                            md:grid-cols-3
                          "
                        >

                          <div>

                            <p
                              className="
                                text-xs
                                uppercase
                                tracking-widest
                                text-gray-400
                              "
                            >
                              Nominal
                            </p>

                            <p
                              className="
                                mt-2
                                text-lg
                                font-semibold
                                text-[#111827]
                              "
                            >
                              Rp {

                                (
                                  item.amount || 0
                                ).toLocaleString(
                                  "id-ID"
                                )
                              }
                            </p>

                          </div>

                          <div>

                            <p
                              className="
                                text-xs
                                uppercase
                                tracking-widest
                                text-gray-400
                              "
                            >
                              Bank
                            </p>

                            <p
                              className="
                                mt-2
                                text-lg
                                font-semibold
                                text-[#111827]
                              "
                            >
                              {
                                item.bank || "-"
                              }
                            </p>

                          </div>

                          <div>

                            <p
                              className="
                                text-xs
                                uppercase
                                tracking-widest
                                text-gray-400
                              "
                            >
                              Tanggal
                            </p>

                            <p
                              className="
                                mt-2
                                text-lg
                                font-semibold
                                text-[#111827]
                              "
                            >

                              {
                                new Date(
                                  item.createdAt
                                ).toLocaleDateString(
                                  "id-ID"
                                )
                              }

                            </p>

                          </div>

                        </div>

                        {/* FOOTER */}
                        <div
                          className="
                            mt-6
                          "
                        >

                          <button
                            onClick={() =>
                              setSelectedClaim(
                                item
                              )
                            }
                            className="
                              rounded-2xl
                              bg-[#111827]
                              px-5
                              py-3
                              text-sm
                              font-medium
                              text-white
                              transition
                              hover:opacity-90
                            "
                          >
                            Lihat Detail
                          </button>

                        </div>

                      </div>
                    )
                  )
                }

              </div>
            )
          }

        </div>

        {/* =====================================================
           VOUCHER LIST
        ===================================================== */}

        <div
          className="
            rounded-[32px]
            border
            border-gray-200
            bg-white
            p-10
          "
        >

          <div
            className="
              pb-5
              border-b
              border-gray-300
            "
          >

            <h2
              className="
                text-2xl
                font-bold
                text-[#111827]
              "
            >
              Voucher Saya
            </h2>

            <p
              className="
                mt-2
                text-gray-500
              "
            >
              Daftar voucher cashback Anda.
            </p>

          </div>

          {
            vouchers.length === 0 ? (

              <div
                className="
                  py-24
                  text-center
                "
              >

                <h3
                  className="
                    text-3xl
                    font-bold
                    text-[#111827]
                  "
                >
                  Belum Ada Voucher
                </h3>

                <p
                  className="
                    mt-4
                    text-gray-500
                  "
                >
                  Anda belum memiliki
                  voucher cashback.
                </p>

              </div>

            ) : (

              <div
                className="
                  mt-8
                  grid
                  gap-5
                  md:grid-cols-2
                "
              >

                {
                  vouchers.map(
                    (voucher) => (

                      <div
                        key={voucher._id}
                        className="
                          overflow-hidden
                          rounded-3xl
                          border
                          border-gray-200
                        "
                      >

                        <div
                          className="
                            bg-[#111827]
                            p-6
                            text-white
                          "
                        >

                          <p
                            className="
                              text-xs
                              uppercase
                              tracking-[0.35em]
                              text-white/60
                              font-medium
                            "
                          >
                            Voucher Code
                          </p>

                          <h3
                            className="
                              mt-3
                              text-4xl
                              font-bold
                              tracking-tight
                            "
                          >

                            {
                              voucher.code
                            }

                          </h3>

                        </div>

                        <div
                          className="
                            p-6
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                            "
                          >

                            <div>

                              <p
                                className="
                                  text-sm
                                  uppercase
                                  tracking-wider
                                  text-gray-500
                                "
                              >
                                Nominal
                              </p>

                              <p
                                className="
                                  mt-2
                                  text-3xl
                                  font-bold
                                  text-[#111827]
                                "
                              >

                                {
                                  formatRupiah(
                                    voucher.amount
                                  )
                                }

                              </p>

                            </div>

                            <span className={`
                              rounded-full
                              px-4
                              py-2
                              text-xs
                              font-semibold

                              ${
                                voucher.isUsed

                                  ? `
                                    bg-red-100
                                    text-red-700
                                  `

                                  : `
                                    bg-green-100
                                    text-green-700
                                  `
                              }
                            `}>

                              {
                                voucher.isUsed

                                  ? "Used"

                                  : "Active"
                              }

                            </span>

                          </div>

                          <div
                            className="
                              mt-6
                              text-sm
                              text-gray-500
                            "
                          >

                            Expired:
                            {" "}

                            {
                              voucher.expiredAt

                                ? new Date(
                                    voucher.expiredAt
                                  ).toLocaleDateString(
                                    "id-ID"
                                  )

                                : "-"
                            }

                          </div>

                        </div>

                      </div>
                    )
                  )
                }

              </div>

            )
          }

        </div>

      </div>

      {/* ===================================================
         DETAIL MODAL
      =================================================== */}

      <CashbackHistoryDetailModal
        open={!!selectedClaim}
        data={selectedClaim}
        onClose={() =>
          setSelectedClaim(null)
        }
      />

    </>
  );
}
