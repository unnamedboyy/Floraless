"use client";

import DataTable from "./DataTable";
import GridView from "./GridView";
import TableToolbar from "./TableToolbar";
import Pagination from "./Pagination";

type Action = {
  icon: React.ReactNode;

  onClick: (
    row: any
  ) => void;

  show?: (
    row: any
  ) => boolean;

  className?: string;
};

type Props = {

  data: any[];
  total: number;

  query: any;

  setQuery: (q: any) => void;

  columns: any[];

  actions?: Action[];

  renderItem?: (
    row: any
  ) => React.ReactNode;

  view?: "list" | "grid";

  setView?: (
    v: "list" | "grid"
  ) => void;

  /* 🔥 FILTER DROPDOWN */
  filterContent?: React.ReactNode;
};

export default function TableWrapper({

  data,

  total,

  query,

  setQuery,

  columns,

  actions = [],

  renderItem,

  view = "list",

  setView = () => {},

  filterContent,

}: Props) {

  /* ================= SEARCH ================= */

  const handleSearch =
    (value: string) => {

      setQuery({
        ...query,
        search: value,
        page: 1,
      });
    };

  /* ================= PAGINATION ================= */

  const handlePageChange =
    (p: number) => {

      setQuery({
        ...query,
        page: p,
      });
    };

  /* ================= UI ================= */

  return (

    <div className="space-y-4">

      {/* TOOLBAR */}
      <TableToolbar

        view={view}

        setView={setView}

        onSearch={handleSearch}

        filterContent={filterContent}

      />

      {/* CONTENT */}
      {data.length === 0 ? (

        <div
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
          Data tidak ditemukan
        </div>

      ) : view === "list" ? (

        <DataTable
          columns={columns}
          data={data}
          actions={actions}
        />

      ) : (

        <GridView
          data={data}
          renderItem={renderItem}
        />

      )}

      {/* PAGINATION */}
      <Pagination

        page={query.page || 1}

        total={total || 0}

        limit={query.limit || 10}

        onChange={handlePageChange}

      />

    </div>
  );
}