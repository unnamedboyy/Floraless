"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import TableWrapper from "@/components/table/TableWrapper";

import UserFormModal from "@/components/form/UserFormModal";
import DetailUserModal from "@/components/modal/DetailUserModal";

import {
  createUser,
  updateUser,
  softDeleteUser,
} from "@/services/user.service";

export default function PelangganPage() {
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
    total = 0,
    reload,
    loading,
  } = useUsers("pelanggan", query);

  /* ================= HANDLER ================= */

  const handleSubmit = async (form: any) => {
    try {
      if (selected) {
        await updateUser("pelanggan", selected._id, form);
      } else {
        await createUser("pelanggan", form);
      }

      setOpenForm(false);
      setSelected(null);
      reload();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Yakin hapus?")) return;

    try {
      await softDeleteUser("pelanggan", row._id);
      reload();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Data Pelanggan
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

        /* ================= COLUMNS ================= */
        columns={[
          { label: "Nama", key: "nama" },
          { label: "Username", key: "userId.username" },
        ]}

        /* ================= ACTIONS ================= */
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

        /* ================= GRID VIEW ================= */
        renderItem={(row) => (
          <div
            key={row._id}
            className="bg-white border rounded-xl p-4 hover:shadow transition"
          >
            <p className="font-semibold">
              {row.nama || "No Name"}
            </p>

            <p className="text-sm text-gray-500">
              {row.userId?.username || "-"}
            </p>

            <div className="mt-3 flex gap-2 text-sm">
              <button
                onClick={() => setSelected(row)}
                className="text-blue-500"
              >
                Detail
              </button>

              <button
                onClick={() => {
                  setSelected(row);
                  setOpenForm(true);
                }}
                className="text-yellow-500"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(row)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      />

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-500">Loading...</p>
      )}

      {/* FORM MODAL */}
      <UserFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
        initialData={selected}
        role="pelanggan"
      />

      {/* DETAIL MODAL */}
      <DetailUserModal
        open={!!selected && !openForm}
        data={selected}
        onClose={() => setSelected(null)}
        title="Detail Pelanggan"
      />

    </div>
  );
}