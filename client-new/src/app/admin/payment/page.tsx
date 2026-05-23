"use client";

import { useState } from "react";

import TableWrapper from "@/components/table/TableWrapper";

import { usePayment } from "@/hooks/usePayment";

import {
  approvePayment,
  rejectPayment,
} from "@/services/payment.service";

import PaymentDetailModal from "@/components/modal/PaymentDetailModal";

export default function PaymentPage() {

  /* ================= STATE ================= */

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    status: "",
    search: "",
  });

  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  const [selected, setSelected] =
    useState<any>(null);

  /* ================= DATA ================= */

  const {
    data = [],
    total = 0,
    reload,
  } = usePayment(query);

  /* ================= ACTION ================= */

  const handleApprove =
    async (id: string) => {

      try {

        await approvePayment(id);

        reload();

      } catch (err) {

        console.error(err);

        alert("Gagal approve payment");
      }
    };

  const handleReject =
    async (id: string) => {

      try {

        await rejectPayment(id);

        reload();

      } catch (err) {

        console.error(err);

        alert("Gagal reject payment");
      }
    };

  /* ================= BADGE ================= */

  const getStatusBadge =
    (status: string) => {

      const map: any = {

        pending:
          "bg-yellow-100 text-yellow-700 border border-yellow-200",

        approved:
          "bg-green-100 text-green-700 border border-green-200",

        rejected:
          "bg-red-100 text-red-700 border border-red-200",
      };

      return (
        map[status] ||
        "bg-gray-100 text-gray-700 border"
      );
    };

  /* ================= UI ================= */

  return (

    <div className="p-6 space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold">
            Kelola Pembayaran
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Monitoring dan verifikasi pembayaran pelanggan
          </p>

        </div>

      </div>

      {/* TABLE */}
      <TableWrapper

        view={view}
        setView={setView}

        data={data}
        total={total}

        query={query}
        setQuery={setQuery}

        filterContent={

        <div className="space-y-3">

            <div>

            <p className="text-xs text-gray-500 mb-1">
                Status
            </p>

            <select
                value={query.status}
                onChange={(e) =>
                setQuery((prev) => ({
                    ...prev,
                    status: e.target.value,
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

            <div>

            <p className="text-xs text-gray-500 mb-1">
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

        columns={[

          {
            label: "Pelanggan",
            key: "ticketId.pelangganId.nama",
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
            label: "Tanggal",
            key: "createdAt",
          },

        ]}

        actions={[

          {
            label: "Detail",

            onClick: (row) =>
              setSelected(row),
          },

          {
            label: "Approve",

            show: (row) =>
              row.status === "pending",

            onClick: (row) =>
              handleApprove(row._id),
          },

          {
            label: "Reject",

            show: (row) =>
              row.status === "pending",

            onClick: (row) =>
              handleReject(row._id),
          },

        ]}

        

        /* ================= GRID ITEM ================= */

        renderItem={(row) => (

          <div
            className="
              bg-white
              border
              rounded-3xl
              p-5
              space-y-4
              shadow-sm
            "
          >

            {/* TOP */}
            <div className="flex items-start justify-between gap-3">

              <div>

                <p className="font-semibold text-base">
                  {row.ticketId?.pelangganId?.nama ||
                    "-"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {row.tipe || "-"}
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
                {row.status}
              </span>

            </div>

            {/* PRICE */}
            <div>

              <p className="text-xs text-gray-400">
                Jumlah Pembayaran
              </p>

              <p className="text-xl font-bold mt-1">
                Rp{" "}
                {row.jumlah?.toLocaleString(
                  "id-ID"
                ) || 0}
              </p>

            </div>

            {/* DATE */}
            <div className="pt-2 border-t">

              <p className="text-xs text-gray-400">
                Tanggal Upload
              </p>

              <p className="text-sm mt-1">
                {row.createdAt
                  ? new Date(
                      row.createdAt
                    ).toLocaleString(
                      "id-ID"
                    )
                  : "-"}
              </p>

            </div>

          </div>
        )}

      />

      {/* MODAL */}
      <PaymentDetailModal
        open={!!selected}
        data={selected}
        onClose={() =>
          setSelected(null)
        }
      />

    </div>
  );
}