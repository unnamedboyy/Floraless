"use client";

import { useState } from "react";
import TableWrapper from "@/components/table/TableWrapper";

import LayananFormModal from "@/components/form/LayananFormModal";
import DetailUserModal from "@/components/modal/DetailUserModal";
import DetailLayananModal from "@/components/modal/LayananDetailModal";

import {
  createLayanan,
  updateLayanan,
  deleteLayanan,
} from "@/services/layanan.service";

import { useLayanan } from "@/hooks/useLayanan";

export default function LayananPage() {
  /* ================= STATE ================= */

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const [openForm, setOpenForm] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  /* ================= DATA ================= */

  const {
    data = [],
    loading,
  } = useLayanan(query);

  // 🔥 fallback karena belum server pagination
  const total = data.length;

  /* ================= HANDLER ================= */

  const handleSubmit = async (form: any) => {
    try {
      if (selected) {
        await updateLayanan(selected._id, form);
      } else {
        await createLayanan(form);
      }

      setOpenForm(false);
      setSelected(null);

      // 🔥 trigger re-fetch
      setQuery((prev) => ({ ...prev }));
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan layanan");
    }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Yakin hapus layanan?")) return;

    try {
      await deleteLayanan(row._id);

      // 🔥 trigger re-fetch
      setQuery((prev) => ({ ...prev }));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus layanan");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Data Layanan
        </h1>

        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-xl text-sm"
        >
          + Tambah
        </button>
      </div>

      {/* TABLE SYSTEM */}
      <TableWrapper
        data={data}
        total={total}
        query={query}
        setQuery={setQuery}

        columns={[
          { label: "Nama", key: "nama" },
          { label: "Harga", key: "harga" },
          { label: "Deskripsi", key: "deskripsi" },
        ]}

        actions={[
          {
            label: "Detail",
            onClick: (row) => setSelected(row),
          },
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
          <div className="bg-white border rounded-xl p-4 space-y-1">
            <p className="font-semibold">
              {row.nama || "-"}
            </p>

            <p className="text-sm text-gray-500">
              Rp {row.harga?.toLocaleString("id-ID") || 0}
            </p>

            <p className="text-xs text-gray-400 line-clamp-2">
              {row.deskripsi || "-"}
            </p>
          </div>
        )}
      />

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      )}

      {/* FORM MODAL */}
      <LayananFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
        initialData={selected}
      />

      {/* DETAIL MODAL */}
      <DetailLayananModal
        open={!!selected && !openForm}
        data={selected}
        onClose={() => setSelected(null)}
      />

    </div>
  );
}