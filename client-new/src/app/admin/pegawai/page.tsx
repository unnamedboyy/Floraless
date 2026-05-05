"use client";

import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";

import DataTable from "@/components/table/DataTable";
import GridView from "@/components/table/GridView";
import TableToolbar from "@/components/table/TableToolbar";
import Pagination from "@/components/table/Pagination";

import UserFormModal from "@/components/form/UserFormModal";
import DetailUserModal from "@/components/modal/DetailUserModal";

import {
  createUser,
  updateUser,
  softDeleteUser,
} from "@/services/user.service";

export default function PegawaiPage() {
  /* ================= STATE ================= */

  const [view, setView] = useState<"list" | "grid">("list");

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
  } = useUsers("pegawai", query);

  /* ================= HANDLER ================= */

  const handleSubmit = async (form: any) => {
    try {
      if (selected) {
        await updateUser("pegawai", selected._id, form);
      } else {
        await createUser("pegawai", form);
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
      await softDeleteUser("pegawai", row._id);
      reload();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    }
  };

  const handleSearch = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handlePageChange = (p: number) => {
    setQuery((prev) => ({
      ...prev,
      page: p,
    }));
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Data Pegawai
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

      {/* TOOLBAR */}
      <TableToolbar
        view={view}
        setView={setView}
        onSearch={handleSearch}
      />

      {/* CONTENT */}
      {loading ? (
        <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-sm text-gray-500">
          Data tidak ditemukan
        </div>
      ) : view === "list" ? (
        <DataTable
          columns={[
            { label: "Nama", key: "nama" },
            { label: "Username", key: "userId.username" },
          ]}
          data={data}
          onView={(row) => setSelected(row)}
          onEdit={(row) => {
            setSelected(row);
            setOpenForm(true);
          }}
          onDelete={handleDelete}
        />
      ) : (
        <GridView data={data} />
      )}

      {/* PAGINATION */}
      <Pagination
        page={query.page}
        total={total}
        limit={query.limit}
        onChange={handlePageChange}
      />

      {/* FORM MODAL */}
      <UserFormModal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
        initialData={selected}
        role="pegawai"
      />

      {/* DETAIL MODAL */}
      <DetailUserModal
        open={!!selected && !openForm}
        data={selected}
        onClose={() => setSelected(null)}
        title="Detail Pegawai"
      />

    </div>
  );
}