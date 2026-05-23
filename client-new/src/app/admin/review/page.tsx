"use client";

import { useState } from "react";

import TableWrapper from "@/components/table/TableWrapper";

import { useReviews } from "@/hooks/useReviews";

export default function ReviewPage() {

  /* ================= STATE ================= */

  const {
    data = [],
    loading,
    toggle,
    remove,
  } = useReviews();

  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  /* 🔥 VIEW */
  const [view, setView] =
    useState<"list" | "grid">(
      "list"
    );

  /* 🔥 FILTER */
  const [layananFilter, setLayananFilter] =
    useState("");

  /* ================= DATA ================= */

  // 🔥 UNIQUE LAYANAN
  const layananList = Array.from(

    new Set(

      data
        .map(
          (r: any) =>
            r.ticketId
              ?.layananId?.nama
        )
        .filter(Boolean)

    )
  );

  // 🔥 FILTER
  const filtered = data.filter(
    (r: any) => {

      const search =
        query.search.toLowerCase();

      const matchSearch =

        r.komentar
          ?.toLowerCase()
          .includes(search)

        ||

        r.pelangganId
          ?.nama
          ?.toLowerCase()
          .includes(search);

      const matchLayanan =

        !layananFilter ||

        r.ticketId
          ?.layananId?.nama ===
          layananFilter;

      return (
        matchSearch &&
        matchLayanan
      );
    }
  );

  const total = filtered.length;

  /* ================= HANDLER ================= */

  const handleDelete =
    (row: any) => {

      if (
        !confirm(
          "Yakin hapus review?"
        )
      ) return;

      remove(row._id);
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
      <div>

        <h1 className="text-2xl font-bold">
          Kelola Review
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Monitoring review dan rating pelanggan
        </p>

      </div>

      {/* TABLE */}
      <TableWrapper

        /* 🔥 VIEW */
        view={view}
        setView={setView}

        /* 🔥 FILTER */
        filterContent={

          <div className="space-y-3">

            {/* LAYANAN */}
            <div>

              <p className="text-xs text-gray-500 mb-1">
                Filter Layanan
              </p>

              <select
                value={layananFilter}
                onChange={(e) =>
                  setLayananFilter(
                    e.target.value
                  )
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
                  Semua Layanan
                </option>

                {layananList.map(
                  (l: any) => (

                    <option
                      key={l}
                      value={l}
                    >
                      {l}
                    </option>
                  )
                )}

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
              onClick={() => {

                setLayananFilter("");

                setQuery({
                  page: 1,
                  limit: 10,
                  search: "",
                });
              }}
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

        data={filtered}
        total={total}

        query={query}
        setQuery={setQuery}

        columns={[

          {
            label: "Pelanggan",
            key: "pelangganId.nama",
          },

          {
            label: "Layanan",
            key: "ticketId.layananId.nama",
          },

          {
            label: "Rating",
            key: "rating",
          },

          {
            label: "Komentar",
            key: "komentar",
          },

          {
            label: "Tanggal",
            key: "createdAt",
          },

        ]}

        actions={[

          {
            label: "Toggle",

            onClick: (row) =>
              toggle(row._id),
          },

          {
            label: "Delete",

            onClick: handleDelete,
          },

        ]}

        /* ================= GRID ================= */

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

            {/* TOP */}
            <div className="flex items-start justify-between gap-3">

              <div>

                <p className="font-semibold text-base">
                  {row.pelangganId?.nama ||
                    "-"}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {row.ticketId
                    ?.layananId?.nama ||
                    "-"}
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

            {/* RATING */}
            <div>

              <p className="text-xs text-gray-400">
                Rating
              </p>

              <p className="text-xl font-bold mt-1">
                ⭐ {row.rating || 0}
              </p>

            </div>

            {/* KOMENTAR */}
            <div className="pt-2 border-t">

              <p className="text-xs text-gray-400">
                Komentar
              </p>

              <p className="text-sm mt-1 line-clamp-3">
                {row.komentar || "-"}
              </p>

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

    </div>
  );
}