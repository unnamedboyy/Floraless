"use client";

import { useState } from "react";

import TableWrapper
from "@/components/table/TableWrapper";

import {
  useCashback,
} from "@/hooks/useCashback";

import {
  approveCashback,
  rejectCashback,
} from "@/services/cashback.service";

import CashbackDetailModal
from "@/components/modal/CashbackDetailModal";

export default function PegawaiCashbackPage() {

  /* =====================================================
     QUERY
  ===================================================== */

  const [query, setQuery] =
    useState({

      page: 1,

      limit: 10,

      status: "",

      search: "",
    });

  /* 🔥 VIEW */
  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  /* =====================================================
     DATA
  ===================================================== */

  const {

    data = [],

    total = 0,

    reload,

  } = useCashback(query);

  /* =====================================================
     MODAL
  ===================================================== */

  const [selected,
    setSelected] =
    useState<any>(null);

  /* =====================================================
     ACTIONS
  ===================================================== */

  const handleApprove =
    async (
      id: string,
      bukti: string
    ) => {

      try {

        if (!bukti) {

          return alert(
            "Bukti transfer wajib diisi"
          );
        }

        await approveCashback(
          id,
          bukti
        );

        alert(
          "Cashback berhasil diapprove"
        );

        reload();

        setSelected(null);

      } catch (err: any) {

        console.error(err);

        alert(

          err?.response?.data
            ?.message ||

          "Gagal approve cashback"
        );
      }
    };

  const handleReject =
    async (
      id: string,
      alasan: string
    ) => {

      try {

        if (!alasan) {

          return alert(
            "Alasan reject wajib diisi"
          );
        }

        await rejectCashback(
          id,
          alasan
        );

        alert(
          "Cashback berhasil direject"
        );

        reload();

        setSelected(null);

      } catch (err: any) {

        console.error(err);

        alert(

          err?.response?.data
            ?.message ||

          "Gagal reject cashback"
        );
      }
    };

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="
      p-6
      space-y-6
    ">

      {/* =================================================
         HEADER
      ================================================= */}

      <div className="
        rounded-3xl
        border
        bg-white
        p-6
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
          text-3xl
          font-bold
        ">
          Cashback Claim
        </h1>

        <p className="
          mt-3
          max-w-2xl
          text-gray-500
        ">
          Kelola claim cashback pelanggan
          dan proses approval transfer.
        </p>

      </div>

      {/* =================================================
         TABLE
      ================================================= */}

      <div className="
        rounded-3xl
        border
        bg-white
        p-4
        shadow-sm
      ">

        <TableWrapper

          /* 🔥 VIEW */
          view={view}
          setView={setView}

          /* 🔥 FILTER */
          filterContent={

            <div className="space-y-3">

              {/* STATUS */}
              <div>

                <p className="
                  mb-1
                  text-xs
                  text-gray-500
                ">
                  Status Cashback
                </p>

                <select
                  value={query.status}
                  onChange={(e) =>

                    setQuery({

                      ...query,

                      status:
                        e.target.value,

                      page: 1,
                    })
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    px-3
                    py-2
                    text-sm
                  "
                >

                  <option value="">
                    Semua
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="approved">
                    Approved
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>

                </select>

              </div>

              {/* LIMIT */}
              <div>

                <p className="
                  mb-1
                  text-xs
                  text-gray-500
                ">
                  Data per halaman
                </p>

                <select
                  value={query.limit}
                  onChange={(e) =>

                    setQuery({

                      ...query,

                      limit: Number(
                        e.target.value
                      ),

                      page: 1,
                    })
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    px-3
                    py-2
                    text-sm
                  "
                >

                  <option value={5}>
                    5
                  </option>

                  <option value={10}>
                    10
                  </option>

                  <option value={20}>
                    20
                  </option>

                  <option value={50}>
                    50
                  </option>

                </select>

              </div>

              {/* RESET */}
              <button
                onClick={() =>
                  setQuery({

                    page: 1,

                    limit: 10,

                    status: "",

                    search: "",
                  })
                }
                className="
                  w-full
                  rounded-xl
                  bg-black
                  py-2
                  text-sm
                  text-white
                "
              >
                Reset Filter
              </button>

            </div>
          }

          data={data}

          total={total}

          query={query}

          setQuery={setQuery}

          columns={[

            {
              label: "Pelanggan",
              key: "pelangganId.nama",
            },

            {
              label: "Kode Voucher",
              key: "kode_voucher",
            },

            {
              label: "Bank",
              key: "bank",
            },

            {
              label: "Nominal",
              key: "amount",
            },

            {
              label: "Status",
              key: "status",
            },
          ]}

          actions={[

            {
              label: "Detail",

              onClick: (row) =>

                setSelected(row),
            },
          ]}

          renderItem={(row) => (

            <div className="
              rounded-3xl
              border
              bg-white
              p-5
              shadow-sm
              transition
              hover:shadow-md
            ">

              {/* HEADER */}
              <div className="
                flex
                items-start
                justify-between
                gap-4
              ">

                <div>

                  <h3 className="
                    text-lg
                    font-semibold
                    text-gray-900
                  ">

                    {
                      row.pelangganId
                        ?.nama || "-"
                    }

                  </h3>

                  <p className="
                    mt-1
                    text-sm
                    text-gray-500
                  ">

                    {
                      row.kode_voucher || "-"
                    }

                  </p>

                </div>

                <span className={`
                  inline-flex
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-semibold

                  ${
                    row.status ===
                    "approved"

                      ? `
                        bg-green-100
                        text-green-700
                      `

                      : row.status ===
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

                  {
                    row.status
                  }

                </span>

              </div>

              {/* BODY */}
              <div className="
                mt-5
                grid
                grid-cols-2
                gap-4
              ">

                <div>

                  <p className="
                    text-xs
                    uppercase
                    tracking-wide
                    text-gray-400
                  ">
                    Bank
                  </p>

                  <p className="
                    mt-1
                    text-sm
                    font-medium
                  ">

                    {
                      row.bank || "-"
                    }

                  </p>

                </div>

                <div>

                  <p className="
                    text-xs
                    uppercase
                    tracking-wide
                    text-gray-400
                  ">
                    Nominal
                  </p>

                  <p className="
                    mt-1
                    text-sm
                    font-medium
                  ">

                    Rp {

                      (
                        row.amount || 0
                      ).toLocaleString(
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
                    setSelected(row)
                  }
                  className="
                    w-full
                    rounded-2xl
                    bg-black
                    px-4
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
          )}
        />

      </div>

      {/* =================================================
         MODAL
      ================================================= */}

      <CashbackDetailModal

        open={!!selected}

        data={selected}

        onClose={() =>
          setSelected(null)
        }

        onApprove={
          handleApprove
        }

        onReject={
          handleReject
        }
      />

    </div>
  );
}