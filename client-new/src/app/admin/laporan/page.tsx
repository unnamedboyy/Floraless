"use client";

import { useEffect, useState } from "react";

import {

  CalendarDays,

  Download,

  Filter,

  Wallet,

  BadgeDollarSign,

  CheckCircle2,

  Clock3,

} from "lucide-react";

import api from "@/lib/axios";

import { saveAs }
from "file-saver";

import { toast }
from "sonner";

export default function FinancialReportPage() {

  const [loading,
    setLoading] = useState(false);

  const [data,
    setData] = useState<any[]>([]);

  const [summary,
    setSummary] = useState<any>({});

  /* =====================================================
     FILTER
  ===================================================== */

  const [type,
    setType] = useState(
      "monthly"
    );

  const [year,
    setYear] = useState(
      new Date()
        .getFullYear()
        .toString()
    );

  const [month,
    setMonth] = useState(
      (
        new Date()
          .getMonth() + 1
      ).toString()
    );

  const [startDate,
    setStartDate] = useState("");

  const [endDate,
    setEndDate] = useState("");

  /* =====================================================
     FETCH DATA
  ===================================================== */

  const fetchData =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            "/reports/financial",
            {
              params: {

                type,

                year,

                month,

                startDate,

                endDate,
              },
            }
          );

        setData(
          res.data.data
        );

        setSummary(
          res.data.summary
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Gagal mengambil laporan"
        );

      } finally {

        setLoading(false);
      }
    };

  /* =====================================================
     PDF EXPORT
  ===================================================== */

  const exportPDF =
    async () => {

      try {

        toast.loading(
          "Generating PDF...",
          {
            id: "pdf",
          }
        );

        const res =
          await api.get(

            "/reports/financial/pdf",

            {

              params: {

                type,

                year,

                month,

                startDate,

                endDate,
              },

              responseType:
                "blob",
            }
          );

        const file =
          new Blob(
            [res.data],
            {
              type:
                "application/pdf",
            }
          );

        saveAs(
          file,
          "financial-report.pdf"
        );

        toast.success(
          "PDF berhasil dibuat",
          {
            id: "pdf",
          }
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Gagal export PDF",
          {
            id: "pdf",
          }
        );
      }
    };

  /* =====================================================
     INIT
  ===================================================== */

  useEffect(() => {

    fetchData();

  }, []);

  return (

    <div
      className="
        min-h-screen
        bg-[#f8f8f8]
        p-6
        md:p-8
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          mb-8
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>

          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.3em]
              text-neutral-400
            "
          >
            FLORALESS
          </p>

          <h1
            className="
              mt-2
              text-4xl
              font-bold
              tracking-tight
              text-[#111]
            "
          >
            Laporan Keuangan
          </h1>

          <p
            className="
              mt-3
              text-sm
              text-neutral-500
            "
          >
            Monitoring pemasukan dan transaksi pembayaran.
          </p>

        </div>

        <button

          onClick={exportPDF}

          className="
            inline-flex
            items-center
            justify-center
            gap-2

            rounded-2xl

            bg-[#111827]

            px-6
            py-4

            text-sm
            font-semibold
            text-white

            shadow-sm

            hover:bg-black
            transition-all
          "
        >

          <Download size={18} />

          Export PDF

        </button>

      </div>

      {/* =====================================================
          FILTER
      ===================================================== */}

      <div
        className="
          mb-8

          rounded-[28px]

          border
          border-gray-200

          bg-white

          p-6

          shadow-sm
        "
      >

        <div
          className="
            mb-6
            flex
            items-center
            gap-2
          "
        >

          <Filter size={18} />

          <h2
            className="
              text-lg
              font-bold
            "
          >
            Filter Laporan
          </h2>

        </div>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-5
          "
        >

          {/* TYPE */}

          <select

            value={type}

            onChange={(e) =>
              setType(
                e.target.value
              )
            }

            className="
              h-14
              rounded-2xl
              border
              border-gray-200
              bg-white
              px-4
              text-sm
              outline-none
            "
          >

            <option value="monthly">
              Bulanan
            </option>

            <option value="yearly">
              Tahunan
            </option>

            <option value="range">
              Range
            </option>

          </select>

          {/* YEAR */}

          {
            type !== "range" && (

              <input

                type="number"

                value={year}

                onChange={(e) =>
                  setYear(
                    e.target.value
                  )
                }

                placeholder="Tahun"

                className="
                  h-14
                  rounded-2xl
                  border
                  border-gray-200
                  px-4
                  text-sm
                  outline-none
                "
              />
            )
          }

          {/* MONTH */}

          {
            type === "monthly" && (

              <input

                type="number"

                value={month}

                onChange={(e) =>
                  setMonth(
                    e.target.value
                  )
                }

                placeholder="Bulan"

                className="
                  h-14
                  rounded-2xl
                  border
                  border-gray-200
                  px-4
                  text-sm
                  outline-none
                "
              />
            )
          }

          {/* RANGE */}

          {
            type === "range" && (

              <>

                <input

                  type="date"

                  value={startDate}

                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }

                  className="
                    h-14
                    rounded-2xl
                    border
                    border-gray-200
                    px-4
                    text-sm
                    outline-none
                  "
                />

                <input

                  type="date"

                  value={endDate}

                  onChange={(e) =>
                    setEndDate(
                      e.target.value
                    )
                  }

                  className="
                    h-14
                    rounded-2xl
                    border
                    border-gray-200
                    px-4
                    text-sm
                    outline-none
                  "
                />

              </>
            )
          }

          {/* BUTTON */}

          <button

            onClick={fetchData}

            className="
              h-14

              rounded-2xl

              bg-[#111827]

              text-sm
              font-semibold
              text-white

              hover:bg-black
              transition-all
            "
          >

            Generate

          </button>

        </div>

      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div
        className="
          mb-8

          grid
          gap-5

          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* TOTAL */}

        <div
          className="
            rounded-[28px]
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-neutral-500
                "
              >
                Total Transaksi
              </p>

              <h2
                className="
                  mt-3
                  text-3xl
                  font-bold
                "
              >
                {
                  summary.totalTransaction || 0
                }
              </h2>

            </div>

            <Wallet size={28} />

          </div>

        </div>

        {/* PEMASUKAN */}

        <div
          className="
            rounded-[28px]
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-neutral-500
                "
              >
                Total Pemasukan
              </p>

              <h2
                className="
                  mt-3
                  text-3xl
                  font-bold
                "
              >
                Rp {
                  summary.totalIncome
                    ?.toLocaleString() || 0
                }
              </h2>

            </div>

            <BadgeDollarSign size={28} />

          </div>

        </div>

        {/* APPROVED */}

        <div
          className="
            rounded-[28px]
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-neutral-500
                "
              >
                Approved
              </p>

              <h2
                className="
                  mt-3
                  text-3xl
                  font-bold
                "
              >
                {
                  summary.approved || 0
                }
              </h2>

            </div>

            <CheckCircle2 size={28} />

          </div>

        </div>

        {/* PENDING */}

        <div
          className="
            rounded-[28px]
            border
            border-gray-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  text-neutral-500
                "
              >
                Pending
              </p>

              <h2
                className="
                  mt-3
                  text-3xl
                  font-bold
                "
              >
                {
                  summary.pending || 0
                }
              </h2>

            </div>

            <Clock3 size={28} />

          </div>

        </div>

      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div
        className="
          overflow-hidden

          rounded-[28px]

          border
          border-gray-200

          bg-white

          shadow-sm
        "
      >

        <div
          className="
            overflow-x-auto
          "
        >

          <table
            className="
              min-w-full
            "
          >

            <thead
              className="
                bg-[#111827]
                text-white
              "
            >

              <tr>

                <th className="px-6 py-5 text-left text-sm">
                  Tanggal
                </th>

                <th className="px-6 py-5 text-left text-sm">
                  Pelanggan
                </th>

                <th className="px-6 py-5 text-left text-sm">
                  Layanan
                </th>

                <th className="px-6 py-5 text-left text-sm">
                  Tipe
                </th>

                <th className="px-6 py-5 text-left text-sm">
                  Jumlah
                </th>

                <th className="px-6 py-5 text-left text-sm">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {
                data.map(
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={index}
                      className="
                        border-b
                        border-gray-100
                      "
                    >

                      <td className="px-6 py-5 text-sm">
                        {
                          new Date(
                            item.createdAt
                          ).toLocaleDateString()
                        }
                      </td>

                      <td className="px-6 py-5 text-sm">
                        {
                          item.ticketId
                            ?.pelangganId
                            ?.nama
                        }
                      </td>

                      <td className="px-6 py-5 text-sm">
                        {
                          item.ticketId
                            ?.layananId
                            ?.nama
                        }
                      </td>

                      <td className="px-6 py-5 text-sm">
                        {item.tipe}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold">
                        Rp {
                          item.jumlah
                            ?.toLocaleString()
                        }
                      </td>

                      <td className="px-6 py-5 text-sm">

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold

                            ${
                              item.status ===
                              "approved"

                                ? `
                                  bg-green-100
                                  text-green-700
                                `

                                : item.status ===
                                  "pending"

                                ? `
                                  bg-yellow-100
                                  text-yellow-700
                                `

                                : `
                                  bg-red-100
                                  text-red-700
                                `
                            }
                          `}
                        >

                          {item.status}

                        </span>

                      </td>

                    </tr>
                  )
                )
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}