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

export default function PegawaiPage() {

  /* ================= STATE ================= */

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
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
    loading,
  } = useUsers(
    "pegawai",
    query
  );

  /* ================= HANDLER ================= */

  const handleSubmit =
    async (form: any) => {

      try {

        if (selected) {

          await updateUser(
            "pegawai",
            selected._id,
            form
          );

        } else {

          await createUser(
            "pegawai",
            form
          );
        }

        setOpenForm(false);

        setSelected(null);

        reload();

      } catch (err) {

        console.error(err);

        alert(
          "Gagal menyimpan data"
        );
      }
    };

  const handleDelete =
    async (row: any) => {

      if (
        !confirm(
          "Yakin hapus?"
        )
      ) return;

      try {

        await softDeleteUser(
          "pegawai",
          row._id
        );

        reload();

      } catch (err) {

        console.error(err);

        alert(
          "Gagal menghapus"
        );
      }
    };

  /* ================= BADGE ================= */

  const getStatusBadge =
    (status: boolean) => {

      return status

        ? "bg-green-100 text-green-700 border border-green-200"

        : "bg-gray-100 text-gray-600 border border-gray-200";
    };

  /* ================= UI ================= */

  return (

    <div className="p-6 space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold">
            Data Pegawai
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Kelola data pegawai sistem
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
          + Tambah
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
                  search: "",
                  status: "",
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
                className={`
                  inline-flex
                  items-center
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-medium
                  border
                  ${
                    value
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  }
                `}
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
            label: "Detail",

            onClick: (row) =>
              setSelected(row),
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

        /* ================= GRID ================= */

        renderItem={(row) => (

          <div
            key={row._id}
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
                  {row.nama ||
                    "No Name"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  @{row.userId
                    ?.username || "-"}
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
                    row.isActive
                  )}
                `}
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
                flex-wrap
                gap-2
              "
            >

              <button
                onClick={() =>
                  setSelected(row)
                }
                className="
                  px-3
                  py-1.5
                  rounded-xl
                  bg-gray-100
                  text-sm
                "
              >
                Detail
              </button>

              <button
                onClick={() => {

                  setSelected(row);

                  setOpenForm(true);
                }}
                className="
                  px-3
                  py-1.5
                  rounded-xl
                  bg-yellow-100
                  text-yellow-700
                  text-sm
                "
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(row)
                }
                className="
                  px-3
                  py-1.5
                  rounded-xl
                  bg-red-100
                  text-red-700
                  text-sm
                "
              >
                Delete
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
        role="pegawai"
      />

      {/* DETAIL MODAL */}
      <DetailUserModal
        open={
          !!selected &&
          !openForm
        }
        data={selected}
        onClose={() =>
          setSelected(null)
        }
        title="Detail Pegawai"
      />

    </div>
  );
}