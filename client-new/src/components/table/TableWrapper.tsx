"use client";

import DataTable from "./DataTable";
import GridView from "./GridView";
import TableToolbar from "./TableToolbar";
import Pagination from "./Pagination";

type Action = {
  label: string;
  onClick: (row: any) => void;
  show?: (row: any) => boolean;
};

type Props = {
  data: any[];
  total: number;

  query: any;
  setQuery: (q: any) => void;

  columns: any[];
  actions?: Action[];

  renderItem?: (row: any) => React.ReactNode;

  view?: "list" | "grid";
  setView?: (v: "list" | "grid") => void;
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
}: Props) {

  const handleSearch = (value: string) => {
    setQuery({
      ...query,
      search: value,
      page: 1,
    });
  };

  const handlePageChange = (p: number) => {
    setQuery({
      ...query,
      page: p,
    });
  };

  return (
    <div className="space-y-4">

      {/* TOOLBAR */}
      <TableToolbar
        view={view}
        setView={setView}
        onSearch={handleSearch}
      />

      {/* CONTENT */}
      {data.length === 0 ? (

        <div className="bg-white border rounded-xl p-6 text-sm text-gray-500">
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