"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import {
  Eye,
  Pencil,
  Trash2,
  Power,
} from "lucide-react";

import TableWrapper
from "@/components/table/TableWrapper";

import LayananFormModal
from "@/components/form/LayananFormModal";

import DetailLayananModal
from "@/components/modal/LayananDetailModal";

import {
  useLayanan,
} from "@/hooks/useLayanan";

import {
  createLayanan,
  updateLayanan,
  deleteLayanan,
  toggleLayanan,
} from "@/services/layanan.service";

export default function LayananPage() {

  /* =====================================================
     STATE
  ===================================================== */

  const [query, setQuery] =
    useState({

      page: 1,

      limit: 10,

      search: "",
    });

  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  const [openForm, setOpenForm] =
    useState(false);

  const [selected, setSelected] =
    useState<any>(null);

  const [loadingSubmit, setLoadingSubmit] =
    useState(false);

  /* =====================================================
     DATA
  ===================================================== */

  const {

    data = [],

    loading,

    refresh,

  } = useLayanan(query);

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async (form: any) => {

      try {

        setLoadingSubmit(true);

        /* ================= UPDATE ================= */

        if (selected?._id) {

          await updateLayanan(

            selected._id,

            form
          );

          toast.success(
            "Layanan berhasil diperbarui"
          );

        }

        /* ================= CREATE ================= */

        else {

          await createLayanan(
            form
          );

          toast.success(
            "Layanan berhasil dibuat"
          );
        }

        /* ================= RESET ================= */

        setOpenForm(false);

        setSelected(null);

        refresh();

      } catch (err: any) {

        console.error(err);

        toast.error(

          err?.response?.data?.message ||

          "Gagal menyimpan layanan"
        );

      } finally {

        setLoadingSubmit(false);
      }
    };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete =
    async (row: any) => {

      toast((t) => (

        <div className="
          w-[300px]
        ">

          {/* TITLE */}
          <p className="
            font-semibold
            text-sm
          ">
            Hapus Layanan?
          </p>

          {/* DESC */}
          <p className="
            text-sm
            text-gray-500
            mt-1
          ">
            Layanan tidak dapat dikembalikan
          </p>

          {/* ACTION */}
          <div className="
            flex
            justify-end
            gap-2
            mt-4
          ">

            {/* CANCEL */}
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
                hover:bg-gray-50
              "
            >
              Batal
            </button>

            {/* DELETE */}
            <button
              onClick={async () => {

                toast.dismiss(t.id);

                try {

                  await deleteLayanan(
                    row._id
                  );

                  toast.success(
                    "Layanan berhasil dihapus"
                  );

                  refresh();

                } catch (err: any) {

                  console.error(err);

                  toast.error(

                    err?.response?.data?.message ||

                    "Gagal menghapus layanan"
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
                hover:bg-red-600
              "
            >
              Ya, Hapus
            </button>

          </div>

        </div>

      ), {
        duration: 10000,
      });
    };

  /* =====================================================
     TOGGLE
  ===================================================== */

  const handleToggle =
    async (row: any) => {

      try {

        await toggleLayanan(
          row._id
        );

        toast.success(

          row.isActive

            ? "Layanan dinonaktifkan"

            : "Layanan diaktifkan"
        );

        refresh();

      } catch (err: any) {

        console.error(err);

        toast.error(

          err?.response?.data?.message ||

          "Gagal update status"
        );
      }
    };

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="
      space-y-6
      p-6
    ">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="
        flex
        items-center
        justify-between
        gap-4
        flex-wrap
      ">

        <div>

          <h1 className="
            text-[34px]
            font-bold
            tracking-tight
            text-[#0F172A]
          ">
            Data Layanan
          </h1>

          <p className="
            text-sm
            text-slate-500
            mt-1
          ">
            Kelola layanan FLORALESS
          </p>

        </div>

        <button

          onClick={() => {

            setSelected(null);

            setOpenForm(true);
          }}

          className="
            h-12
            px-5
            rounded-2xl
            bg-[#0F172A]
            text-white
            text-sm
            font-semibold
            hover:opacity-90
            transition
            shadow-sm
          "
        >

          + Tambah Layanan

        </button>

      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <TableWrapper

        /* ================= VIEW ================= */

        view={view}

        setView={setView}

        data={data}

        total={data.length}

        query={query}

        setQuery={setQuery}

        /* ================= COLUMNS ================= */

        columns={[

          {
            label: "Nama",
            key: "nama",
          },

          {
            label: "Harga",

            key: "harga",

            render: (value: number) => (

              <span className="
                font-medium
              ">
                Rp {

                  Number(
                    value || 0
                  ).toLocaleString(
                    "id-ID"
                  )
                }
              </span>
            ),
          },

          {
            label: "Kategori",
            key: "kategori",
          },

          {
            label: "Featured",

            key: "isFeatured",

            render: (value: boolean) => (

              <span className={`
                inline-flex
                items-center
                justify-center
                px-3
                py-1.5
                rounded-full
                text-xs
                font-semibold

                ${
                  value

                    ? `
                      bg-amber-100
                      text-amber-700
                    `

                    : `
                      bg-slate-100
                      text-slate-500
                    `
                }
              `}>

                {
                  value
                    ? "Featured"
                    : "Normal"
                }

              </span>
            ),
          },

        ]}

        /* ================= ACTION ================= */

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

            onClick: (row) => {
              setSelected(row);
            },
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
              <Power size={17} />
            ),

            className: `
              bg-blue-100
              text-blue-700
              hover:bg-blue-200
            `,

            onClick: handleToggle,
          },

          {
            icon: (
              <Trash2 size={17} />
            ),

            className: `
              bg-red-100
              text-red-700
              hover:bg-red-200
            `,

            onClick: handleDelete,
          },

        ]}

        /* ================= GRID ================= */

        renderItem={(row) => (

          <div className="
            bg-white
            border
            border-slate-200
            rounded-[28px]
            overflow-hidden
            shadow-sm
          ">

            {/* ================= IMAGE ================= */}

            <div className="
              aspect-[16/9]
              bg-slate-100
              overflow-hidden
            ">

              {

                row.thumbnail

                  ? (

                    <img

                      src={row.thumbnail}

                      alt={row.nama}

                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />
                  )

                  : (

                    <div className="
                      w-full
                      h-full
                      flex
                      items-center
                      justify-center
                      text-slate-400
                      text-sm
                    ">
                      Tidak ada thumbnail
                    </div>
                  )
              }

            </div>

            {/* ================= CONTENT ================= */}

            <div className="
              p-5
              space-y-3
            ">

              {/* CATEGORY */}
              {

                row.kategori && (

                  <div>

                    <span className="
                      inline-flex
                      items-center
                      px-3
                      py-1
                      rounded-full
                      bg-slate-100
                      text-slate-600
                      text-xs
                      font-medium
                    ">
                      {row.kategori}
                    </span>

                  </div>
                )
              }

              {/* NAME */}
              <div>

                <h3 className="
                  text-lg
                  font-bold
                  text-[#0F172A]
                ">
                  {row.nama}
                </h3>

              </div>

              {/* PRICE */}
              <div className="
                text-[15px]
                font-semibold
                text-slate-700
              ">

                Rp {

                  Number(
                    row.harga || 0
                  ).toLocaleString(
                    "id-ID"
                  )
                }

              </div>

              {/* DESCRIPTION */}
              <p className="
                text-sm
                leading-relaxed
                text-slate-500
                line-clamp-3
              ">

                {
                  row.deskripsi ||
                  "Tidak ada deskripsi"
                }

              </p>

              {/* FOOTER */}
              <div className="
                flex
                items-center
                justify-between
                pt-3
              ">

                <div>

                  <span className={`
                    inline-flex
                    items-center
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-medium

                    ${
                      row.isActive

                        ? `
                          bg-emerald-100
                          text-emerald-700
                        `

                        : `
                          bg-red-100
                          text-red-700
                        `
                    }
                  `}>

                    {

                      row.isActive

                        ? "Aktif"

                        : "Nonaktif"
                    }

                  </span>

                </div>

                {

                  row.isFeatured && (

                    <span className="
                      text-amber-500
                      text-sm
                      font-semibold
                    ">
                      ★ Featured
                    </span>
                  )
                }

              </div>

            </div>

          </div>
        )}

      />

      {/* =====================================================
          LOADING
      ===================================================== */}

      {

        loading && (

          <div className="
            text-sm
            text-slate-500
          ">
            Loading layanan...
          </div>
        )
      }

      {/* =====================================================
          FORM MODAL
      ===================================================== */}

      <LayananFormModal

        open={openForm}

        loading={loadingSubmit}

        initialData={selected}

        onClose={() => {

          setOpenForm(false);

          setSelected(null);
        }}

        onSubmit={handleSubmit}
      />

      {/* =====================================================
          DETAIL MODAL
      ===================================================== */}

      <DetailLayananModal

        open={
          !!selected &&
          !openForm
        }

        data={selected}

        onClose={() =>
          setSelected(null)
        }
      />

    </div>
  );
}