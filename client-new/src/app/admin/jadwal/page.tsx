"use client";

import {

  useEffect,
  useState,

} from "react";

import toast from "react-hot-toast";

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
     STATE
  ===================================================== */

  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  const [mode, setMode] =
    useState<"table" | "calendar">(
      "table"
    );

  const [query, setQuery] =
    useState({

      page: 1,

      limit: 10,

      search: "",

      start: "",

      end: "",

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
     ACTION
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

  const handleDelete =
    async (row: any) => {

      if (
        !confirm(
          "Hapus jadwal ini?"
        )
      ) return;

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
    };

  /* =====================================================
     STATUS BADGE
  ===================================================== */

  const getStatusBadge =
    (status: string) => {

      const map: any = {

        available: `

          bg-emerald-50
          text-emerald-700
          border
          border-emerald-200
        `,

        booked: `

          bg-amber-50
          text-amber-700
          border
          border-amber-200
        `,

        ongoing: `

          bg-blue-50
          text-blue-700
          border
          border-blue-200
        `,

        done: `

          bg-slate-100
          text-slate-700
          border
          border-slate-200
        `,
      };

      return (
        map[status] ||

        `
          bg-gray-100
          text-gray-700
          border
        `
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

      <div className="
        flex
        gap-2
      ">

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

                  {/* START DATE */}
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
                      Dari Tanggal
                    </label>

                    <input

                      type="date"

                      value={query.start}

                      onChange={(e) =>
                        setQuery((prev) => ({

                          ...prev,

                          start:
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
                    />

                  </div>

                  {/* END DATE */}
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
                      Sampai Tanggal
                    </label>

                    <input

                      type="date"

                      value={query.end}

                      onChange={(e) =>
                        setQuery((prev) => ({

                          ...prev,

                          end:
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
                    />

                  </div>

                  {/* LIMIT */}
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
                      Data per halaman
                    </label>

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

                        start: "",

                        end: "",

                        status: "",
                      })
                    }

                    className="
                      w-full
                      h-12

                      rounded-2xl

                      bg-[#0F172A]

                      text-white

                      text-sm
                      font-semibold

                      hover:opacity-90

                      transition
                    "
                  >

                    Reset Filter

                  </button>

                </div>
              }

              data={data}

              total={data.length}

              query={query}

              setQuery={setQuery}

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

              actions={[

                {

                  label: "Detail",

                  onClick: (row) => {

                    setSelected(row);

                    setOpenDetail(true);
                  },
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

                <div className="

                  bg-white

                  border
                  border-slate-200

                  rounded-3xl

                  p-5

                  space-y-4

                  shadow-sm

                ">

                  {/* TOP */}
                  <div className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  ">

                    <div>

                      <p className="
                        font-semibold
                        text-base
                        text-[#0F172A]
                      ">

                        {

                          row.title ||

                          row.ticketId
                            ?.layananId
                            ?.nama ||

                          "-"
                        }

                      </p>

                      <p className="
                        text-sm
                        text-slate-500
                        mt-1
                      ">

                        {
                          row.pegawaiId
                            ?.nama || "-"
                        }

                      </p>

                    </div>

                    <span className={`

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

                    `}>

                      {row.status}

                    </span>

                  </div>

                  {/* DATE */}
                  <div>

                    <p className="
                      text-xs
                      text-slate-400
                    ">
                      Tanggal Acara
                    </p>

                    <p className="
                      text-sm
                      font-medium
                      mt-1
                    ">

                      {

                        row.tanggal_acara

                          ? new Date(
                              row.tanggal_acara
                            )

                            .toLocaleDateString(
                              "id-ID"
                            )

                          : "-"
                      }

                    </p>

                  </div>

                  {/* LOCATION */}
                  <div className="
                    pt-2
                    border-t
                    border-slate-100
                  ">

                    <p className="
                      text-xs
                      text-slate-400
                    ">
                      Lokasi
                    </p>

                    <p className="
                      text-sm
                      mt-1
                      line-clamp-2
                    ">
                      {row.lokasi || "-"}
                    </p>

                  </div>

                  {/* CATATAN */}
                  {

                    row.catatan && (

                      <div className="
                        pt-2
                        border-t
                        border-slate-100
                      ">

                        <p className="
                          text-xs
                          text-slate-400
                        ">
                          Catatan
                        </p>

                        <p className="
                          text-sm
                          mt-1
                          line-clamp-2
                          text-slate-600
                        ">
                          {row.catatan}
                        </p>

                      </div>
                    )
                  }

                </div>
              )}

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