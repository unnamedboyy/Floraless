"use client";

import {
  useEffect,
  useState,
} from "react";

import api
from "@/lib/axios";

import CashbackHistoryDetailModal
from "@/components/modal/CashbackHistoryDetailModal";

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

          return alert(
            "Kode voucher wajib diisi"
          );
        }

        if (!bank) {

          return alert(
            "Bank wajib diisi"
          );
        }

        if (!nomorRekening) {

          return alert(
            "Nomor rekening wajib diisi"
          );
        }

        if (!namaRekening) {

          return alert(
            "Nama rekening wajib diisi"
          );
        }

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

        alert(
          "Claim cashback berhasil dikirim"
        );

        /* RESET */

        setVoucherCode("");
        setBank("");
        setNomorRekening("");
        setNamaRekening("");

        fetchData();

      } catch (err: any) {

        console.error(err);

        alert(

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

  return (

    <>

      <div className="
        space-y-8
      ">

        {/* ===================================================
           HEADER
        =================================================== */}

        <div className="
          rounded-[2rem]
          border
          bg-white
          p-8
          shadow-sm
        ">

          <p className="
            text-sm
            uppercase
            tracking-[0.3em]
            text-[#C9AE63]
          ">
            Cashback
          </p>

          <h1 className="
            mt-3
            text-4xl
            font-bold
          ">
            Cashback & Voucher
          </h1>

          <p className="
            mt-4
            max-w-2xl
            text-gray-600
          ">
            Kelola cashback dan voucher
            yang Anda miliki dari transaksi
            Floraless.
          </p>

        </div>

        {/* ===================================================
           FORM
        =================================================== */}

        <form
          onSubmit={handleClaim}
          className="
            rounded-[2rem]
            border
            bg-white
            p-8
            shadow-sm
          "
        >

          <div>

            <h2 className="
              text-2xl
              font-bold
            ">
              Claim Cashback
            </h2>

            <p className="
              mt-2
              text-gray-500
            ">
              Masukkan data rekening untuk
              proses transfer cashback.
            </p>

          </div>

          <div className="
            mt-8
            grid
            gap-5
            md:grid-cols-2
          ">

            {/* VOUCHER */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-medium
              ">
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
                  px-5
                  outline-none
                "
              />

            </div>

            {/* BANK */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-medium
              ">
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
                  px-5
                  outline-none
                "
              />

            </div>

            {/* NO REK */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-medium
              ">
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
                  px-5
                  outline-none
                "
              />

            </div>

            {/* NAMA REK */}

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-medium
              ">
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
                  px-5
                  outline-none
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
              bg-black
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

        <div className="
          rounded-[32px]
          border
          bg-white
          p-8
        ">

          <h2 className="
            text-3xl
            font-bold
          ">
            Riwayat Cashback
          </h2>

          <p className="
            mt-2
            text-gray-500
          ">
            Status cashback yang pernah Anda claim.
          </p>

          {
            claims.length === 0 ? (

              <div className="
                mt-8
                rounded-3xl
                bg-gray-50
                px-6
                py-12
                text-center
                text-gray-500
              ">
                Belum ada cashback.
              </div>

            ) : (

              <div className="
                mt-8
                grid
                gap-5
              ">

                {
                  claims.map(
                    (item: any) => (

                      <div
                        key={item._id}
                        className="
                          rounded-[28px]
                          border
                          p-6
                        "
                      >

                        {/* HEADER */}
                        <div className="
                          flex
                          flex-col
                          gap-4
                          md:flex-row
                          md:items-center
                          md:justify-between
                        ">

                          <div>

                            <p className="
                              text-xs
                              uppercase
                              tracking-widest
                              text-gray-400
                            ">
                              Voucher
                            </p>

                            <h3 className="
                              mt-2
                              text-2xl
                              font-bold
                            ">
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
                        <div className="
                          mt-6
                          grid
                          grid-cols-1
                          gap-5
                          md:grid-cols-3
                        ">

                          <div>

                            <p className="
                              text-xs
                              uppercase
                              tracking-widest
                              text-gray-400
                            ">
                              Nominal
                            </p>

                            <p className="
                              mt-2
                              text-lg
                              font-semibold
                            ">
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

                            <p className="
                              text-xs
                              uppercase
                              tracking-widest
                              text-gray-400
                            ">
                              Bank
                            </p>

                            <p className="
                              mt-2
                              text-lg
                              font-semibold
                            ">
                              {
                                item.bank || "-"
                              }
                            </p>

                          </div>

                          <div>

                            <p className="
                              text-xs
                              uppercase
                              tracking-widest
                              text-gray-400
                            ">
                              Tanggal
                            </p>

                            <p className="
                              mt-2
                              text-lg
                              font-semibold
                            ">

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
                        <div className="
                          mt-6
                        ">

                          <button
                            onClick={() =>
                              setSelectedClaim(
                                item
                              )
                            }
                            className="
                              rounded-2xl
                              bg-black
                              px-5
                              py-3
                              text-sm
                              font-medium
                              text-white
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

        {/* ===================================================
           VOUCHER LIST
        =================================================== */}

        <div className="
          rounded-[2rem]
          border
          bg-white
          p-8
          shadow-sm
        ">

          <h2 className="
            text-2xl
            font-bold
          ">
            Voucher Saya
          </h2>

          <p className="
            mt-2
            text-gray-500
          ">
            Daftar voucher cashback Anda.
          </p>

          <div className="
            mt-8
            grid
            gap-5
            md:grid-cols-2
          ">

            {
              vouchers.map(
                (voucher) => (

                  <div
                    key={voucher._id}
                    className="
                      overflow-hidden
                      rounded-3xl
                      border
                    "
                  >

                    <div className="
                      bg-black
                      p-6
                      text-white
                    ">

                      <p className="
                        text-xs
                        uppercase
                        tracking-[0.3em]
                        text-white/60
                      ">
                        Voucher Code
                      </p>

                      <h3 className="
                        mt-3
                        text-4xl
                        font-bold
                      ">

                        {
                          voucher.code
                        }

                      </h3>

                    </div>

                    <div className="
                      p-6
                    ">

                      <div className="
                        flex
                        items-center
                        justify-between
                      ">

                        <div>

                          <p className="
                            text-sm
                            text-gray-500
                          ">
                            Nominal
                          </p>

                          <p className="
                            mt-2
                            text-3xl
                            font-bold
                          ">

                            {
                              formatRupiah(
                                voucher.amount
                              )
                            }

                          </p>

                        </div>

                        <span className={`
                          rounded-xl
                          px-3
                          py-1
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

                      <div className="
                        mt-6
                        text-sm
                        text-gray-500
                      ">

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