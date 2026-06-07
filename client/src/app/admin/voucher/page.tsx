"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import TableWrapper
from "@/components/table/TableWrapper";

import VoucherFormModal
from "@/components/form/VoucherFormModal";

import DetailVoucherModal
from "@/components/modal/VoucherDetailModal";

import {
  useVoucher,
} from "@/hooks/useVoucher";

import {
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "@/services/voucher.service";

import {

  TicketPercent,

  CalendarDays,

  Wallet,

  CheckCircle2,

  Clock3,

  Eye,

  Pencil,

  Trash2,

  Plus,

} from "lucide-react";

export default function VoucherPage() {

  /* =====================================================
     STATE
  ===================================================== */

  const [query, setQuery] =
    useState({

      page: 1,

      limit: 10,

      status: "",

      search: "",
    });

  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  const [openForm, setOpenForm] =
    useState(false);

  const [openDetail, setOpenDetail] =
    useState(false);

  const [selected, setSelected] =
    useState<any>(null);

  const [editData, setEditData] =
    useState<any>(null);

  /* =====================================================
     DATA
  ===================================================== */

  const {

    data = [],

    total = 0,

    reload,

  } = useVoucher(query);

  /* =====================================================
     CREATE
  ===================================================== */

  const handleCreate = () => {

    setEditData(null);

    setOpenForm(true);
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit =
    (row: any) => {

      setEditData(row);

      setOpenForm(true);
    };

  /* =====================================================
     DETAIL
  ===================================================== */

  const handleDetail =
    (row: any) => {

      setSelected(row);

      setOpenDetail(true);
    };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async (form: any) => {

      try {

        if (editData) {

          await updateVoucher(

            editData._id,

            form
          );

          toast.success(
            "Voucher berhasil diperbarui"
          );

        } else {

          await createVoucher(
            form
          );

          toast.success(
            "Voucher berhasil dibuat"
          );
        }

        setOpenForm(false);

        setEditData(null);

        reload();

      } catch (err: any) {

        console.error(err);

        const errors =
          err?.response?.data?.errors;

        if (
          Array.isArray(errors) &&
          errors.length > 0
        ) {

          toast.error(
            errors[0].msg
          );

          return;
        }

        toast.error(

          err?.response?.data?.message ||

          "Gagal menyimpan voucher"
        );
      }
    };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete =
    (row: any) => {

      toast((t) => (

        <div className="
          w-[300px]
        ">

          {/* TITLE */}
          <p className="
            font-semibold
            text-sm
          ">
            Hapus Voucher?
          </p>

          {/* DESC */}
          <p className="
            text-sm
            text-gray-500
            mt-1
          ">
            Voucher tidak dapat dikembalikan
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

                  await deleteVoucher(
                    row._id
                  );

                  toast.success(
                    "Voucher berhasil dihapus"
                  );

                  reload();

                } catch (err: any) {

                  console.error(err);

                  const errors =
                    err?.response?.data?.errors;

                  if (
                    Array.isArray(errors) &&
                    errors.length > 0
                  ) {

                    toast.error(
                      errors[0].msg
                    );

                    return;
                  }

                  toast.error(

                    err?.response?.data?.message ||

                    "Gagal menghapus voucher"
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
     BADGE
  ===================================================== */

  const getStatusBadge =
    (used: boolean) => {

      return used

        ? `
          bg-red-50
          text-red-700
          border-red-200
        `

        : `
          bg-emerald-50
          text-emerald-700
          border-emerald-200
        `;
    };

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="
      p-6
      space-y-6
    ">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="
        flex
        items-start
        justify-between
        gap-5
        flex-wrap
      ">

        <div>

          <div className="
            flex
            items-center
            gap-3
            flex-wrap
          ">

            <h1 className="
              text-[42px]
              leading-none
              tracking-tight
              font-bold
              text-[#0F172A]
            ">
              Voucher
            </h1>

            <div className="
              h-11
              px-4
              rounded-2xl
              bg-emerald-50
              border
              border-emerald-200
              text-emerald-700
              inline-flex
              items-center
              justify-center
              text-sm
              font-semibold
            ">
              {total} Voucher
            </div>

          </div>

          <p className="
            mt-3
            text-[15px]
            text-slate-500
          ">
            Kelola voucher cashback pelanggan FLORALESS
          </p>

        </div>

        <button

          onClick={handleCreate}

          className="
            h-12
            px-5
            rounded-2xl
            bg-[#0F172A]
            text-white
            text-sm
            font-semibold
            inline-flex
            items-center
            gap-2
            hover:opacity-90
            transition-all
          "
        >

          <Plus size={18} />

          Tambah Voucher

        </button>

      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <TableWrapper

        /* ================= VIEW ================= */

        view={view}

        setView={setView}

        /* ================= FILTER ================= */

        filterContent={

          <div className="
            space-y-4
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
                Status Voucher
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

                <option value="used">
                  Used
                </option>

              </select>

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
                Data Per Halaman
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

                  status: "",

                  search: "",
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
                transition-all
              "
            >

              Reset Filter

            </button>

          </div>
        }

        /* ================= DATA ================= */

        data={data}

        total={total}

        query={query}

        setQuery={setQuery}

        /* ================= COLUMN ================= */

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
            label: "Status",

            key: "isUsed",

            render: (value: boolean) => (

              <span className={`
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

                    ? `
                      bg-red-100
                      text-red-700
                      border-red-200
                    `

                    : `
                      bg-emerald-100
                      text-emerald-700
                      border-emerald-200
                    `
                }
              `}>

                {
                  value
                    ? "Sudah Digunakan"
                    : "Belum Digunakan"
                }

              </span>
            ),
          },

          {
            label: "Expired",

            key: "expiredAt",

            render: (value: string) => (

              <span>

                {

                  value

                    ? new Date(value)
                        .toLocaleDateString(
                          "id-ID"
                        )

                    : "-"
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

            onClick: handleDetail,
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

            onClick: handleEdit,
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

        /* =====================================================
            GRID VIEW
        ===================================================== */

        renderItem={(row) => {

          const isExpired =

            row.expiredAt

              ? new Date(
                  row.expiredAt
                ) < new Date()

              : false;

          return (

            <div className="
              rounded-[30px]
              border
              border-slate-200
              bg-white
              p-5
              space-y-5
              shadow-sm
            ">

              {/* TOP */}
              <div className="
                flex
                items-start
                justify-between
                gap-4
              ">

                <div>

                  <div className="
                    flex
                    items-center
                    gap-2
                  ">

                    <TicketPercent
                      size={18}
                      className="
                        text-emerald-600
                      "
                    />

                    <p className="
                      text-lg
                      font-bold
                      text-[#0F172A]
                    ">

                      {row.code || "-"}

                    </p>

                  </div>

                  <p className="
                    mt-2
                    text-sm
                    text-slate-500
                  ">

                    {
                      row.pelangganId?.nama ||
                      "-"
                    }

                  </p>

                </div>

                <div className="
                  flex
                  flex-col
                  items-end
                  gap-2
                ">

                  <span className={`
                    h-9
                    px-4
                    rounded-2xl
                    inline-flex
                    items-center
                    text-xs
                    font-semibold
                    border

                    ${
                      getStatusBadge(
                        row.isUsed
                      )
                    }
                  `}>

                    {
                      row.isUsed
                        ? "Used"
                        : "Available"
                    }

                  </span>

                  {

                    isExpired && (

                      <span className="
                        h-9
                        px-4
                        rounded-2xl
                        inline-flex
                        items-center
                        text-xs
                        font-semibold
                        border
                        bg-red-50
                        border-red-200
                        text-red-700
                      ">

                        Expired

                      </span>
                    )
                  }

                </div>

              </div>

              {/* AMOUNT */}
              <div className="
                rounded-[24px]
                border
                border-emerald-200
                bg-emerald-50
                p-5
              ">

                <p className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-emerald-600
                ">

                  Nominal Voucher

                </p>

                <div className="
                  mt-3
                  flex
                  items-center
                  gap-2
                ">

                  <Wallet
                    size={20}
                    className="
                      text-emerald-600
                    "
                  />

                  <p className="
                    text-[28px]
                    leading-none
                    font-bold
                    tracking-tight
                    text-[#0F172A]
                  ">

                    Rp {

                      row.amount?.toLocaleString(
                        "id-ID"
                      ) || 0
                    }

                  </p>

                </div>

              </div>

              {/* INFO */}
              <div className="
                space-y-4
              ">

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-3
                ">

                  <div className="
                    flex
                    items-center
                    gap-2
                    text-slate-500
                  ">

                    <CalendarDays
                      size={16}
                    />

                    <span className="
                      text-sm
                    ">
                      Expired
                    </span>

                  </div>

                  <span className="
                    text-sm
                    font-semibold
                    text-slate-700
                  ">

                    {

                      row.expiredAt

                        ? new Date(
                            row.expiredAt
                          ).toLocaleDateString(
                            "id-ID"
                          )

                        : "-"
                    }

                  </span>

                </div>

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-3
                ">

                  <div className="
                    flex
                    items-center
                    gap-2
                    text-slate-500
                  ">

                    {

                      row.isUsed

                        ? (
                          <CheckCircle2
                            size={16}
                          />
                        )

                        : (
                          <Clock3
                            size={16}
                          />
                        )
                    }

                    <span className="
                      text-sm
                    ">
                      Status
                    </span>

                  </div>

                  <span className="
                    text-sm
                    font-semibold
                    text-slate-700
                  ">

                    {

                      row.isUsed

                        ? "Sudah Digunakan"

                        : "Belum Digunakan"
                    }

                  </span>

                </div>

              </div>

            </div>
          );
        }}

      />

      {/* =====================================================
          FORM MODAL
      ===================================================== */}

      <VoucherFormModal

        open={openForm}

        onClose={() => {

          setOpenForm(false);

          setEditData(null);
        }}

        initialData={editData}

        onSubmit={handleSubmit}

      />

      {/* =====================================================
          DETAIL MODAL
      ===================================================== */}

      <DetailVoucherModal

        open={openDetail}

        onClose={() => {

          setOpenDetail(false);

          setSelected(null);
        }}

        data={selected}

      />

    </div>
  );
}