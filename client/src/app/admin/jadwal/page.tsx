"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import TableWrapper from "@/components/table/TableWrapper";
import JadwalCalendar from "@/components/jadwal/JadwalCalendar";
import JadwalFormModal from "@/components/form/JadwalFormModal";
import DetailJadwalModal from "@/components/modal/DetailJadwalModal";

import {
  createJadwal,
  updateJadwal,
  deleteJadwal,
} from "@/services/jadwal.service";

import {
  getPegawai,
} from "@/services/pegawai.service";

import {
  useJadwal,
} from "@/hooks/useJadwal";

export default function JadwalPage() {

  /* =====================================================
     TODAY
  ===================================================== */

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  /* =====================================================
     STATE
  ===================================================== */

  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  const [mode, setMode] =
    useState<"table" | "calendar">(
      "calendar"
    );

  const [query, setQuery] =
    useState({

      page: 1,

      limit: 10,

      search: "",

      start: today,

      end: "2099-12-31",

      status: "",
    });

  const [openForm, setOpenForm] =
    useState(false);

  const [openDetail, setOpenDetail] =
    useState(false);

  const [selected, setSelected] =
    useState<any>(null);

  const [pegawai, setPegawai] =
    useState<any[]>([]);

  const [submitLoading, setSubmitLoading] =
    useState(false);

  /* =====================================================
     DATA
  ===================================================== */

  const {
    data = [],
    loading,
    refetch,
  } = useJadwal(query);

  /* =====================================================
     FETCH PEGAWAI
  ===================================================== */

  const fetchPegawai =
    async () => {

      try {

        const res =
          await getPegawai({});

        setPegawai(

          res?.data?.data ||

          res?.data ||

          []
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Gagal memuat data pegawai"
        );
      }
    };

  /* =====================================================
     EFFECT
  ===================================================== */

  useEffect(() => {

    fetchPegawai();

  }, []);

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async (form: any) => {

      try {

        setSubmitLoading(true);

        if (selected?._id) {

          await updateJadwal(
            selected._id,
            form
          );

          toast.success(
            "Jadwal berhasil diperbarui"
          );

        } else {

          await createJadwal(
            form
          );

          toast.success(
            "Jadwal berhasil dibuat"
          );
        }

        setOpenForm(false);

        setSelected(null);

        refetch();

      } catch (err: any) {

        console.error(err);

        toast.error(

          err?.response?.data?.message ||

          "Gagal menyimpan jadwal"
        );

      } finally {

        setSubmitLoading(false);
      }
    };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete =
    async (row: any) => {

      toast((t) => (

        <div className="w-[300px]">

          {/* TITLE */}
          <p className="
            font-semibold
            text-sm
          ">
            Hapus Jadwal?
          </p>

          {/* DESC */}
          <p className="
            text-sm
            text-gray-500
            mt-1
          ">
            Jadwal tidak dapat dikembalikan
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

                  await deleteJadwal(
                    row._id
                  );

                  toast.success(
                    "Jadwal berhasil dihapus"
                  );

                  refetch();

                } catch (err: any) {

                  console.error(err);

                  toast.error(

                    err?.response?.data?.message ||

                    "Gagal menghapus jadwal"
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
              Hapus
            </button>

          </div>

        </div>

      ), {
        duration: 10000,
      });
    };

  /* =====================================================
     STATUS BADGE
  ===================================================== */

  const getStatusBadge =
    (status: string) => {

      const map: any = {

        available:
          "bg-emerald-50 text-emerald-700 border border-emerald-200",

        booked:
          "bg-amber-50 text-amber-700 border border-amber-200",

        ongoing:
          "bg-blue-50 text-blue-700 border border-blue-200",

        done:
          "bg-slate-100 text-slate-700 border border-slate-200",
      };

      return (

        map[status] ||

        "bg-gray-100 text-gray-700 border"
      );
    };

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="
      p-6
      space-y-5
    ">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="
        flex
        items-center
        justify-between
        gap-5
        flex-wrap
      ">

        <div>

          <h1 className="
            text-3xl
            font-bold
            tracking-tight
            text-[#0F172A]
          ">
            Kelola Jadwal
          </h1>

          <p className="
            text-sm
            text-slate-500
            mt-2
          ">
            Kelola jadwal acara dan penugasan pegawai
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
          "
        >
          + Tambah Jadwal
        </button>

      </div>

      {/* =====================================================
          MODE SWITCH
      ===================================================== */}

      <div className="flex gap-2">

        <button
          onClick={() =>
            setMode("table")
          }
          className={`
            h-11
            px-5
            rounded-2xl
            text-sm
            font-semibold
            transition

            ${
              mode === "table"

                ? `
                  bg-[#0F172A]
                  text-white
                `

                : `
                  border
                  border-slate-200
                  bg-white
                  text-slate-700
                `
            }
          `}
        >
          Table
        </button>

        <button
          onClick={() =>
            setMode("calendar")
          }
          className={`
            h-11
            px-5
            rounded-2xl
            text-sm
            font-semibold
            transition

            ${
              mode === "calendar"

                ? `
                  bg-[#0F172A]
                  text-white
                `

                : `
                  border
                  border-slate-200
                  bg-white
                  text-slate-700
                `
            }
          `}
        >
          Calendar
        </button>

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      {

        mode === "table"

          ? (

            <TableWrapper

              /* ================= VIEW ================= */

              view={view}

              setView={setView}

              /* ================= FILTER ================= */

              filterContent={

                <div className="
                  space-y-5
                ">

                  {/* STATUS */}
                  <div className="
                    space-y-2
                  ">

                    <label className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-500
                    ">
                      Status Jadwal
                    </label>

                    <select
                      value={query.status}
                      onChange={(e) =>
                        setQuery((prev) => ({

                          ...prev,

                          status:
                            e.target.value,

                          page: 1,
                        }))
                      }
                      className="
                        w-full
                        h-12
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        text-sm
                        outline-none
                        transition-all
                        focus:border-slate-400
                      "
                    >

                      <option value="">
                        Semua Status
                      </option>

                      <option value="available">
                        Available
                      </option>

                      <option value="booked">
                        Booked
                      </option>

                      <option value="ongoing">
                        Ongoing
                      </option>

                      <option value="done">
                        Done
                      </option>

                    </select>

                  </div>

                </div>
              }

              data={data}

              total={data.length}

              query={query}

              setQuery={setQuery}

              /* ================= COLUMNS ================= */

              columns={[

                {
                  label: "Tanggal",
                  key: "tanggal_acara",
                },

                {
                  label: "Pegawai",
                  key: "pegawaiId.nama",
                },

                {
                  label: "Lokasi",
                  key: "lokasi",
                },

                {
                  label: "Status",

                  key: "status",

                  render: (row: any) => (

                    <div className={`
                      h-9
                      px-4
                      rounded-2xl
                      inline-flex
                      items-center
                      justify-center
                      text-xs
                      font-semibold
                      border
                      ${getStatusBadge(
                        row.status
                      )}
                    `}>

                      {row.status}

                    </div>
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

                    setOpenDetail(true);
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

            />

          )

          : (

            <JadwalCalendar

              data={data}

              refetch={refetch}

              onSelect={(row: any) => {

                setSelected(row);

                setOpenDetail(true);
              }}
            />
          )
      }

      {/* =====================================================
          LOADING
      ===================================================== */}

      {

        loading && (

          <p className="
            text-sm
            text-slate-500
          ">
            Loading...
          </p>
        )
      }

      {/* =====================================================
          FORM
      ===================================================== */}

      <JadwalFormModal

        open={openForm}

        pegawaiList={pegawai}

        loading={submitLoading}

        onClose={() => {

          setOpenForm(false);

          setSelected(null);
        }}

        onSubmit={handleSubmit}

        initialData={selected}
      />

      {/* =====================================================
          DETAIL
      ===================================================== */}

      <DetailJadwalModal

        open={openDetail}

        data={selected}

        onClose={() => {

          setOpenDetail(false);

          setSelected(null);
        }}
      />

    </div>
  );
}