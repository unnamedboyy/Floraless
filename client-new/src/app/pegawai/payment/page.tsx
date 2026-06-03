"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import {
  Eye,
  Check,
  X,
} from "lucide-react";

import TableWrapper from "@/components/table/TableWrapper";

import PaymentDetailModal from "@/components/modal/PaymentDetailModal";

import {
  usePayment,
} from "@/hooks/usePayment";

import {
  approvePayment,
  rejectPayment,
} from "@/services/payment.service";

export default function PaymentPage() {

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

  const [selected, setSelected] =
    useState<any>(null);

  /* =====================================================
     DATA
  ===================================================== */

  const {
    data = [],
    total = 0,
    reload,
  } = usePayment(query);

  /* =====================================================
     APPROVE
  ===================================================== */

  const handleApprove = async (
    id: string
  ) => {

    toast((t) => (

      <div className="w-[300px]">

        <p className="font-semibold text-sm">
          Setujui Pembayaran?
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Pembayaran akan ditandai sebagai approved.
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
              hover:bg-gray-50
            "
          >
            Batal
          </button>

          <button
            onClick={async () => {

              toast.dismiss(t.id);

              try {

                await approvePayment(id);

                toast.success(
                  "Pembayaran berhasil disetujui"
                );

                reload();

              } catch (err: any) {

                toast.error(
                  err?.response?.data?.message ||
                  "Gagal approve payment"
                );
              }
            }}
            className="
              px-3
              py-2
              rounded-xl
              bg-green-500
              text-white
              text-sm
              hover:bg-green-600
            "
          >
            Setujui
          </button>

        </div>

      </div>

    ), {
      duration: 10000,
    });
  };

  /* =====================================================
     REJECT
  ===================================================== */

  const handleReject = async (
    id: string
  ) => {

    let note = "";

    toast((t) => (

      <div className="w-[300px]">

        <p className="font-semibold text-sm">
          Tolak Pembayaran?
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Catatan penolakan wajib diisi.
        </p>

        <textarea
          rows={4}
          className="
            w-full
            mt-3
            p-3
            border
            rounded-xl
            text-sm
          "
          onChange={(e) => {
            note = e.target.value;
          }}
        />

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
            "
          >
            Batal
          </button>

          <button
            onClick={async () => {

              if (!note.trim()) {

                toast.error(
                  "Catatan wajib diisi"
                );

                return;
              }

              toast.dismiss(t.id);

              try {

                await rejectPayment(
                  id,
                  note
                );

                toast.success(
                  "Pembayaran berhasil ditolak"
                );

                reload();

              } catch (err: any) {

                toast.error(
                  err?.response?.data?.message ||
                  "Gagal reject payment"
                );
              }
            }}
            className="
              px-3
              py-2
              rounded-xl
              bg-red-500
              text-white
            "
          >
            Tolak
          </button>

        </div>

      </div>

    ), {
      duration: 20000,
    });
  };

  /* =====================================================
     BADGE
  ===================================================== */

  const getStatusBadge =
    (status: string) => {

      const map: any = {

        pending:
          "bg-yellow-100 text-yellow-700 border border-yellow-200",

        approved:
          "bg-green-100 text-green-700 border border-green-200",

        rejected:
          "bg-red-100 text-red-700 border border-red-200",
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

    <div
      className="
        p-6
        space-y-5
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
            "
          >
            Verifikasi Pembayaran
          </h1>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            Monitoring dan verifikasi pembayaran pelanggan
          </p>

        </div>

      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <TableWrapper

        view={view}

        setView={setView}

        filterContent={

          <div
            className="
              space-y-3
            "
          >

            <div>

              <p
                className="
                  text-xs
                  text-gray-500
                  mb-1
                "
              >
                Status
              </p>

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

                <option value="pending">
                  Pending
                </option>

                <option value="approved">
                  Approved
                </option>

                <option value="rejected">
                  Rejected
                </option>

              </select>

            </div>

            <div>

              <p
                className="
                  text-xs
                  text-gray-500
                  mb-1
                "
              >
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

        columns={[

          {
            label: "Pelanggan",
            key: "ticketId.pelangganId.nama",
          },

          {
            label: "Tipe",
            key: "tipe",
          },

          {
            label: "Jumlah",

            key: "jumlah",

            render: (value: number) => (

              <span className="font-medium">

                Rp{" "}

                {Number(
                  value || 0
                ).toLocaleString(
                  "id-ID"
                )}

              </span>
            ),
          },

          {
            label: "Status",

            key: "status",

            render: (value: string) => (

              <span
                className={`
                  inline-flex
                  items-center
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-medium
                  ${getStatusBadge(value)}
                `}
              >

                {value}

              </span>
            ),
          },

          {
            label: "Tanggal",

            key: "createdAt",

            render: (value: string) => (

              <span>

                {
                  value
                    ? new Date(
                        value
                      ).toLocaleString(
                        "id-ID"
                      )
                    : "-"
                }

              </span>
            ),
          },

        ]}

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
              <Check size={17} />
            ),

            className: `
              bg-green-100
              text-green-700
              hover:bg-green-200
            `,

            show: (row) =>
              row.status === "pending",

            onClick: (row) =>
              handleApprove(
                row._id
              ),
          },

          {
            icon: (
              <X size={17} />
            ),

            className: `
              bg-red-100
              text-red-700
              hover:bg-red-200
            `,

            show: (row) =>
              row.status === "pending",

            onClick: (row) =>
              handleReject(
                row._id
              ),
          },

        ]}

        renderItem={(row) => (

          <div
            className="
              bg-white
              border
              rounded-3xl
              p-5
              space-y-4
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
                gap-3
              "
            >

              <div>

                <p
                  className="
                    font-semibold
                    text-base
                  "
                >
                  {
                    row.ticketId
                      ?.pelangganId
                      ?.nama || "-"
                  }
                </p>

                <p
                  className="
                    text-sm
                    text-gray-500
                    mt-1
                  "
                >
                  {row.tipe || "-"}
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
                    row.status
                  )}
                `}
              >

                {row.status}

              </span>

            </div>

            <div>

              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                Jumlah Pembayaran
              </p>

              <p
                className="
                  text-xl
                  font-bold
                  mt-1
                "
              >

                Rp{" "}

                {
                  row.jumlah?.toLocaleString(
                    "id-ID"
                  ) || 0
                }

              </p>

            </div>

            <div
              className="
                pt-2
                border-t
              "
            >

              <p
                className="
                  text-xs
                  text-gray-400
                "
              >
                Tanggal Upload
              </p>

              <p
                className="
                  text-sm
                  mt-1
                "
              >

                {
                  row.createdAt
                    ? new Date(
                        row.createdAt
                      ).toLocaleString(
                        "id-ID"
                      )
                    : "-"
                }

              </p>

            </div>

          </div>
        )}

      />

      <PaymentDetailModal

        open={!!selected}

        data={selected}

        onClose={() =>
          setSelected(null)
        }

      />

    </div>
  );
}