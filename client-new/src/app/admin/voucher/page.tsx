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

  const {
    data = [],
    total = 0,
    reload,
  } = useVoucher(query);

  const [openForm, setOpenForm] =
    useState(false);

  const [selected, setSelected] =
    useState<any>(null);

  /* ================= HANDLER ================= */

  const handleSubmit = async (
    form: any
  ) => {

    try {

      if (selected) {
        await updateVoucher(
          selected._id,
          form
        );
      } else {
        await createVoucher(form);
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

  const handleDelete = async (
    row: any
  ) => {

    if (!confirm("Hapus voucher?"))
      return;

    try {

      await deleteVoucher(row._id);

      reload();

    } catch (err) {

      console.error(err);

      alert(
        "Gagal menghapus voucher"
      );
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <h1 className="text-xl font-semibold">
          Voucher
        </h1>

        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-xl text-sm"
        >
          + Tambah Voucher
        </button>

      </div>

      {/* TABLE */}
      <TableWrapper
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

        renderItem={(row) => (
          <div className="bg-white border rounded-xl p-4 space-y-2">

            <p className="font-semibold">
              {row.code}
            </p>

            <p className="text-sm text-gray-500">
              {row.pelangganId?.nama || "-"}
            </p>

            <p className="text-sm font-medium">
              Rp {row.amount?.toLocaleString()}
            </p>

            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {row.isUsed
                ? "Used"
                : "Available"}
            </span>

            <p className="text-xs text-gray-400">
              {row.expiredAt
                ? new Date(
                    row.expiredAt
                  ).toLocaleDateString()
                : "-"}
            </p>

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