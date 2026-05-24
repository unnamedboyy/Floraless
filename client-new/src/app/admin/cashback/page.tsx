"use client";

import { useState } from "react";

import TableWrapper from "@/components/table/TableWrapper";

import { useCashback } from "@/hooks/useCashback";

import {
  approveCashback,
  rejectCashback,
} from "@/services/cashback.service";

import CashbackDetailModal from "@/components/modal/CashbackDetailModal";

export default function CashbackPage() {

  /* ================= STATE ================= */

  const [query, setQuery] = useState({
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

  const [selected, setSelected] =
    useState<any>(null);

  /* ================= DATA ================= */

  const {
    data = [],
    total = 0,
    reload,
  } = useCashback(query);

  /* ================= ACTION ================= */

  const handleApprove =
    async (
      id: string,
      bukti: string
    ) => {

      try {

        if (!bukti)
          return alert(
            "Bukti wajib diisi"
          );

        await approveCashback(
          id,
          bukti
        );

        reload();
        setSelected(null);

      } catch (err) {
        console.error(err);
        alert(
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

        if (!alasan)
          return alert(
            "Alasan wajib diisi"
          );

        await rejectCashback(
          id,
          alasan
        );

        reload();

        setSelected(null);

      } catch (err) {

        console.error(err);

        alert(
          "Gagal reject cashback"
        );
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
            Cashback Claim
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Kelola pengajuan cashback pelanggan
          </p>

        </div>

      </div>

      {/* TABLE */}
      <TableWrapper

        /* 🔥 VIEW */
        view={view}
        setView={setView}

        /* 🔥 FILTER */
        filterContent={

          <div className="space-y-3">

            {/* STATUS */}
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

            {/* LIMIT */}
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

        columns={[

          {
            label: "Pelanggan",
            key: "pelangganId.nama",
          },

          {
            label: "Kode",
            key: "kode_voucher",
          },

          {
            label: "Bank",
            key: "bank",
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

        /* ================= GRID ================= */

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
                  {row.pelangganId?.nama ||
                    "-"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {row.kode_voucher ||
                    "-"}
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

            {/* BANK */}
            <div>

              <p className="text-xs text-gray-400">
                Bank Tujuan
              </p>

              <p className="text-sm font-medium mt-1">
                {row.bank || "-"}
              </p>

            </div>

            {/* ACCOUNT */}
            <div className="pt-2 border-t">

              <p className="text-xs text-gray-400">
                Nama Rekening
              </p>

              <p className="text-sm mt-1">
                {row.nama_rekening ||
                  "-"}
              </p>

            </div>

          </div>
        )}

      />

      {/* MODAL */}
      <CashbackDetailModal
        open={!!selected}
        data={selected}
        onClose={() =>
          setSelected(null)
        }
        onApprove={handleApprove}
        onReject={handleReject}
      />

    </div>
  );
}