"use client";

import { useState } from "react";

import TableWrapper from "@/components/table/TableWrapper";

import { useVoucher } from "@/hooks/useVoucher";

import {
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "@/services/voucher.service";

import VoucherFormModal from "@/components/modal/VoucherFormModal";

export default function VoucherPage() {

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

  const [openForm, setOpenForm] =
    useState(false);

  const [selected, setSelected] =
    useState<any>(null);

  /* ================= DATA ================= */

  const {
    data = [],
    total = 0,
    reload,
  } = useVoucher(query);

  /* ================= HANDLER ================= */

  const handleSubmit =
    async (form: any) => {

      try {

        if (selected) {

          await updateVoucher(
            selected._id,
            form
          );

        } else {

          await createVoucher(
            form
          );
        }

        setOpenForm(false);

        setSelected(null);

        reload();

      } catch (err) {

        console.error(err);

        alert(
          "Gagal menyimpan voucher"
        );
      }
    };

  const handleDelete =
    async (row: any) => {

      if (
        !confirm(
          "Hapus voucher?"
        )
      ) return;

      try {

        await deleteVoucher(
          row._id
        );

        reload();

      } catch (err) {

        console.error(err);

        alert(
          "Gagal menghapus voucher"
        );
      }
    };

  /* ================= BADGE ================= */

  const getStatusBadge =
    (used: boolean) => {

      return used

        ? "bg-red-100 text-red-700 border border-red-200"

        : "bg-green-100 text-green-700 border border-green-200";
    };

  /* ================= UI ================= */

  return (

    <div className="p-6 space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold">
            Voucher
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Kelola voucher pelanggan
          </p>

        </div>

        <button
          onClick={() => {

            setSelected(null);

            setOpenForm(true);
          }}
          className="
            bg-black
            text-white
            px-4
            py-2.5
            rounded-2xl
            text-sm
          "
        >
          + Tambah Voucher
        </button>

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
                Status Voucher
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

                <option value="available">
                  Available
                </option>

                <option value="used">
                  Used
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
            label: "Code",
            key: "code",
          },

          {
            label: "Pelanggan",
            key: "pelangganId.nama",
          },

          {
            label: "Amount",
            key: "amount",
          },

          {
            label: "Status",
            key: "isUsed",
          },

          {
            label: "Expired",
            key: "expiredAt",
          },

        ]}

        actions={[

          {
            label: "Edit",

            onClick: (row) => {

              setSelected(row);

              setOpenForm(true);
            },
          },

          {
            label: "Delete",

            onClick: handleDelete,
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
                  {row.code || "-"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {row.pelangganId?.nama ||
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
                    row.isUsed
                  )}
                `}
              >
                {row.isUsed
                  ? "Used"
                  : "Available"}
              </span>

            </div>

            {/* AMOUNT */}
            <div>

              <p className="text-xs text-gray-400">
                Nominal Voucher
              </p>

              <p className="text-xl font-bold mt-1">
                Rp{" "}
                {row.amount?.toLocaleString(
                  "id-ID"
                ) || 0}
              </p>

            </div>

            {/* EXPIRED */}
            <div className="pt-2 border-t">

              <p className="text-xs text-gray-400">
                Expired Date
              </p>

              <p className="text-sm mt-1">
                {row.expiredAt
                  ? new Date(
                      row.expiredAt
                    ).toLocaleDateString(
                      "id-ID"
                    )
                  : "-"}
              </p>

            </div>

          </div>
        )}

      />

      {/* MODAL */}
      <VoucherFormModal
        open={openForm}
        onClose={() => {

          setOpenForm(false);

          setSelected(null);
        }}
        onSubmit={handleSubmit}
        initialData={selected}
      />

    </div>
  );
}