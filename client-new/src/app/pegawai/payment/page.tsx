"use client";

import { useState } from "react";

import TableWrapper
from "@/components/table/TableWrapper";

import {
  usePayment,
} from "@/hooks/usePayment";

import {
  approvePayment,
  rejectPayment,
} from "@/services/payment.service";

import PaymentDetailModal
from "@/components/modal/PaymentDetailModal";

export default function PaymentPage() {

  /* =========================================================
     STATE
  ========================================================= */

  const [query, setQuery] =
    useState({

      page: 1,

      limit: 5,

      status: "pending",

      search: "",
    });

  /* 🔥 VIEW */
  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  const {

    data = [],

    total = 0,

    reload,

  } = usePayment(query);

  const [selected, setSelected] =
    useState<any>(null);

  const [openDetail, setOpenDetail] =
    useState(false);

  /* =========================================================
     APPROVE
  ========================================================= */

  const handleApprove =
    async (
      id: string
    ) => {

      try {

        await approvePayment(
          id
        );

        alert(
          "Payment berhasil disetujui"
        );

        reload();

      } catch (err: any) {

        console.error(err);

        alert(

          err?.response?.data
            ?.message ||

          "Gagal approve payment"
        );
      }
    };

  /* =========================================================
     REJECT
  ========================================================= */

  const handleReject =
    async (
      id: string
    ) => {

      try {

        await rejectPayment(
          id
        );

        alert(
          "Payment berhasil ditolak"
        );

        reload();

      } catch (err: any) {

        console.error(err);

        alert(

          err?.response?.data
            ?.message ||

          "Gagal reject payment"
        );
      }
    };

  /* =========================================================
     BADGE
  ========================================================= */

  const getStatusBadge =
    (status: string) => {

      const map: any = {

        approved:
          "bg-green-100 text-green-700 border border-green-200",

        pending:
          "bg-yellow-100 text-yellow-700 border border-yellow-200",

        rejected:
          "bg-red-100 text-red-700 border border-red-200",
      };

      return (
        map[status] ||
        "bg-gray-100 text-gray-700 border"
      );
    };

  /* =========================================================
     UI
  ========================================================= */

  return (

    <div className="
      space-y-6
      p-6
    ">

      {/* =====================================================
         HEADER
      ===================================================== */}

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
          Payment
        </p>

        <h1 className="
          mt-3
          text-3xl
          font-bold
        ">
          Verifikasi Pembayaran
        </h1>

        <p className="
          mt-3
          max-w-2xl
          text-gray-500
        ">
          Verifikasi pembayaran pelanggan
          berdasarkan bukti transfer yang
          telah diupload.
        </p>

      </div>

      {/* =====================================================
         TABLE
      ===================================================== */}

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
                  text-xs
                  text-gray-500
                  mb-1
                ">
                  Status Payment
                </p>

                <select
                  value={query.status}
                  onChange={(e) =>
                    setQuery((prev) => ({
                      ...prev,
                      status:
                        e.target.value,
                      page: 1,
                    }))
                  }
                  className="
                    w-full
                    border
                    rounded-xl
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
                  text-xs
                  text-gray-500
                  mb-1
                ">
                  Data per halaman
                </p>

                <select
                  value={query.limit}
                  onChange={(e) =>
                    setQuery((prev) => ({
                      ...prev,
                      limit: Number(
                        e.target.value
                      ),
                      page: 1,
                    }))
                  }
                  className="
                    w-full
                    border
                    rounded-xl
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
                    limit: 5,
                    status: "",
                    search: "",
                  })
                }
                className="
                  w-full
                  bg-black
                  text-white
                  rounded-xl
                  py-2
                  text-sm
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

          /* =================================================
             COLUMNS
          ================================================= */

          columns={[

            {
              label: "Pelanggan",
              key:
                "ticketId.pelangganId.nama",
            },

            {
              label: "Tipe",
              key: "tipe",
            },

            {
              label: "Jumlah",
              key: "jumlah",
            },

            {
              label: "Status",
              key: "status",
            },

            {
              label: "Bank",
              key: "bank_pengirim",
            },
          ]}

          /* =================================================
             ACTIONS
          ================================================= */

          actions={[

            {
              label: "Detail",

              onClick: (row) => {

                setSelected(row);

                setOpenDetail(true);
              },
            },

            {
              label: "Approve",

              show: (row) =>
                row.status ===
                "pending",

              onClick: (row) =>
                handleApprove(
                  row._id
                ),
            },

            {
              label: "Reject",

              show: (row) =>
                row.status ===
                "pending",

              onClick: (row) =>
                handleReject(
                  row._id
                ),
            },
          ]}

          /* =================================================
             MOBILE CARD
          ================================================= */

          renderItem={(row) => (

            <div className="
              space-y-4
              rounded-3xl
              border
              bg-white
              p-5
              shadow-sm
            ">

              {/* HEADER */}
              <div className="
                flex
                items-start
                justify-between
                gap-4
              ">

                <div>

                  <p className="
                    text-lg
                    font-semibold
                  ">

                    {
                      row.ticketId
                        ?.pelangganId
                        ?.nama || "-"
                    }

                  </p>

                  <p className="
                    mt-1
                    text-sm
                    text-gray-500
                  ">

                    {
                      row.tipe
                    }

                  </p>

                </div>

                <span
                  className={`
                    inline-flex
                    items-center
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-medium
                    ${getStatusBadge(
                      row.status
                    )}
                  `}
                >

                  {
                    row.status
                  }

                </span>

              </div>

              {/* PRICE */}
              <div>

                <p className="
                  text-sm
                  text-gray-500
                ">
                  Nominal
                </p>

                <p className="
                  mt-1
                  text-xl
                  font-bold
                ">

                  Rp{" "}

                  {
                    row.jumlah?.toLocaleString(
                      "id-ID"
                    )
                  }

                </p>

              </div>

              {/* INFO */}
              <div className="
                grid
                gap-4
                md:grid-cols-2
              ">

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Nama Pengirim
                  </p>

                  <p className="
                    mt-1
                    font-medium
                  ">

                    {
                      row.nama_pengirim ||
                      "-"
                    }

                  </p>

                </div>

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                  ">
                    Bank
                  </p>

                  <p className="
                    mt-1
                    font-medium
                  ">

                    {
                      row.bank_pengirim ||
                      "-"
                    }

                  </p>

                </div>

              </div>

              {/* ACTION */}
              <div className="
                flex
                flex-wrap
                gap-3
                pt-2
                border-t
              ">

                <button
                  onClick={() => {

                    setSelected(row);

                    setOpenDetail(true);
                  }}
                  className="
                    rounded-xl
                    border
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition
                    hover:bg-gray-100
                  "
                >
                  Detail
                </button>

                {
                  row.status ===
                  "pending" && (

                    <>
                      <button
                        onClick={() =>
                          handleApprove(
                            row._id
                          )
                        }
                        className="
                          rounded-xl
                          bg-green-600
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-white
                          transition
                          hover:bg-green-700
                        "
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleReject(
                            row._id
                          )
                        }
                        className="
                          rounded-xl
                          bg-red-500
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-white
                          transition
                          hover:bg-red-600
                        "
                      >
                        Reject
                      </button>
                    </>
                  )
                }

              </div>

            </div>
          )}
        />

      </div>

      {/* =====================================================
         MODAL
      ===================================================== */}

      <PaymentDetailModal
        open={openDetail}
        onClose={() =>
          setOpenDetail(false)
        }
        data={selected}
      />

    </div>
  );
}