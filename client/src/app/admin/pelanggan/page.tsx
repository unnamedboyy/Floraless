"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useUsers } from "@/hooks/useUsers";
import TableWrapper from "@/components/table/TableWrapper";
import UserFormModal from "@/components/form/UserFormModal";
import DetailUserModal from "@/components/modal/DetailUserModal";

import {
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";

import {
  createUser,
  updateUser,
  softDeleteUser,
} from "@/services/user.service";

export default function PelangganPage() {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
  });

  const [view, setView] = useState<
    "list" | "grid"
  >("list");

  const [openForm, setOpenForm] =
    useState(false);

  const [selected, setSelected] =
    useState<any>(null);

  const {
    data = [],
    total = 0,
    reload,
    loading,
  } = useUsers("pelanggan", query);

  const handleSubmit = async (form: any) => {
    try {
      if (selected) {
        await updateUser(
          "pelanggan",
          selected._id,
          form
        );

      } else {
        await createUser(
          "pelanggan",
          form
        );
      }

      setOpenForm(false);
      setSelected(null);

      reload();

    } catch (err: any) {
      console.error(err);

      console.log(err.response?.status);
      console.log(err.response?.data);

      toast.error(
        err?.response?.data?.message ||
        "Gagal menyimpan data"
      );
    }
  };

  const handleDelete =
    async (row: any) => {

      toast((t) => (

        <div className="w-[300px]">

          <p className="font-semibold text-sm">
            Hapus Pelanggan?
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Data pelanggan tidak dapat dikembalikan
          </p>

          <div className="flex justify-end gap-2 mt-4">

            <button
              onClick={() =>
                toast.dismiss(t.id)
              }
              className="
                px-3
                py-2
                rounded-xl
                border
                text-sm
              "
            >
              Batal
            </button>

            <button
              onClick={async () => {

                toast.dismiss(t.id);

                try {

                  await softDeleteUser(
                    "pelanggan",
                    row._id
                  );

                  await reload();

                  toast.success(
                    row.isActive
                      ? "Berhasil dinonaktifkan"
                      : "Berhasil diaktifkan"
                  );

                } catch (err) {

                  console.error(err);

                  toast.error(
                    "Gagal menghapus pelanggan"
                  );
                }
              }}
              className="
                px-3
                py-2
                rounded-xl
                bg-red-500
                text-white
                text-sm
              "
            >
              Hapus
            </button>

          </div>

        </div>

      ), {
        duration: 10000,
      });
    };
    
  const getStatusBadge = (
    status: boolean
  ) => {
    return status
      ? "bg-green-100 text-green-700 border border-green-200"
      : "bg-gray-100 text-gray-600 border border-gray-200";
  };

  return (
    <div className="p-6 space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            Data Pelanggan
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Kelola data pelanggan sistem
          </p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-black text-white px-4 py-2.5 rounded-2xl text-sm"
        >
          + Tambah
        </button>

      </div>

      {/* TABLE */}
      <TableWrapper
        view={view}
        setView={setView}
        data={data}
        total={total}
        query={query}
        setQuery={setQuery}

        /* ================= FILTER ================= */

        filterContent={
          <div className="space-y-3">

            {/* STATUS */}
            <div>

              <p className="text-xs text-gray-500 mb-1">
                Status Akun
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
                className="w-full border rounded-xl px-3 py-2 text-sm"
              >
                <option value="">
                  Semua
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Non-active
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
                    limit: Number(e.target.value),
                    page: 1,
                  }))
                }
                className="w-full border rounded-xl px-3 py-2 text-sm"
              >
                <option value={5}>
                  5
                </option>

                <option value={7}>
                  7
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
                  search: "",
                  status: "",
                })
              }
              className="w-full bg-black text-white rounded-xl py-2 text-sm"
            >
              Reset Filter
            </button>

          </div>
        }

        /* ================= COLUMNS ================= */

        columns={[
          {
            label: "Nama",
            key: "nama",
          },

          {
            label: "Username",
            key: "userId.username",
          },

          {
            label: "No HP",
            key: "no_telp",
          },

          {
            label: "Status",
            key: "isActive",

            render: (value: boolean) => (
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                  value
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }`}
              >
                {value
                  ? "Aktif"
                  : "Nonaktif"}
              </span>
            ),
          },

        ]}

        /* ================= ACTIONS ================= */

        actions={[

          {
            icon: (
              <Eye size={17} />
            ),

            className: `
              bg-gray-100
              text-gray-700
              hover:bg-gray-200
            `,

            onClick: (row) =>
              setSelected(row),
          },

          {
            icon: (
              <Pencil size={17} />
            ),

            className: `
              bg-yellow-100
              text-yellow-700
              hover:bg-yellow-200
            `,

            onClick: (row) => {

              setSelected(row);

              setOpenForm(true);
            },
          },

          {
            icon: (
              <Trash2 size={17} />
            ),

            show: (row) => row.isActive,

            className: `
              bg-red-100
              text-red-700
              hover:bg-red-200
            `,

            onClick: handleDelete,
          },

          {
            icon: (
              <RotateCcw size={17} />
            ),

            show: (row) => !row.isActive,

            className: `
              bg-green-100
              text-green-700
              hover:bg-green-200
            `,

            onClick: handleDelete,
          },

        ]}
        /* ================= GRID ================= */

        renderItem={(row) => (
          <div
            key={row._id}
            className="bg-white border rounded-3xl p-5 space-y-4 shadow-sm"
          >

            {/* TOP */}
            <div className="flex items-start justify-between gap-3">

              <div>
                <p className="font-semibold text-base">
                  {row.nama || "No Name"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  @{row.userId?.username || "-"}
                </p>
              </div>

              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                  row.isActive
                )}`}
              >
                {row.isActive
                  ? "Active"
                  : "Non-active"}
              </span>

            </div>

            {/* PHONE */}
            <div>

              <p className="text-xs text-gray-400">
                Nomor Telepon
              </p>

              <p className="text-sm font-medium mt-1">
                {row.no_hp || "-"}
              </p>

            </div>

            {/* ACTION */}
            <div
              className="
                pt-3
                border-t
                flex
                items-center
                gap-2
              "
            >

              <button
                onClick={() =>
                  setSelected(row)
                }
                className="
                  w-10
                  h-10
                  rounded-2xl
                  bg-gray-100
                  text-gray-700
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-200
                  transition
                "
              >
                <Eye size={18} />
              </button>

              <button
                onClick={() => {

                  setSelected(row);

                  setOpenForm(true);
                }}
                className="
                  w-10
                  h-10
                  rounded-2xl
                  bg-yellow-100
                  text-yellow-700
                  flex
                  items-center
                  justify-center
                  hover:bg-yellow-200
                  transition
                "
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() =>
                  handleDelete(row)
                }
                className="
                  w-10
                  h-10
                  rounded-2xl
                  bg-red-100
                  text-red-700
                  flex
                  items-center
                  justify-center
                  hover:bg-red-200
                  transition
                "
              >
                <Trash2 size={18} />
              </button>

            </div>

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
        onClose={() =>
          setSelected(null)
        }
        title="Detail Pelanggan"
      />

    </div>
  );
}