"use client";

import {
  Search,
  Filter,
  Download,
} from "lucide-react";

import { useState } from "react";

type Props = {
  view: "list" | "grid";

  setView: (
    v: "list" | "grid"
  ) => void;

  onSearch?: (
    value: string
  ) => void;

  filterContent?: React.ReactNode;
};

export default function TableToolbar({
  view,
  setView,
  onSearch,
  filterContent,

}: Props) {

  const [openFilter, setOpenFilter] =
    useState(false);

  return (

    <div className="space-y-3">

      {/* TOP */}
      <div className="flex items-center justify-between">

        {/* SEARCH */}
        <div
          className="
            flex
            items-center
            gap-2
            bg-white
            border
            rounded-xl
            px-3
            py-2
            w-[250px]
          "
        >

          <Search
            size={16}
            className="text-gray-400"
          />

          <input
            placeholder="Search..."
            onChange={(e) =>
              onSearch?.(
                e.target.value
              )
            }
            className="
              outline-none
              text-sm
              w-full
            "
          />

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* FILTER */}
          <div className="relative">

            <button
              onClick={() =>
                setOpenFilter(
                  !openFilter
                )
              }
              className="
                flex
                items-center
                gap-2
                px-3
                py-2
                border
                rounded-xl
                text-sm
                hover:bg-gray-50
              "
            >
              <Filter size={16} />
              Filter
            </button>

            {/* DROPDOWN */}
            {openFilter &&
              filterContent && (

              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-[280px]
                  bg-white
                  border
                  rounded-2xl
                  shadow-xl
                  p-4
                  z-50
                "
              >

                {filterContent}

              </div>
            )}

          </div>

          {/* EXPORT */}
          <button
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              border
              rounded-xl
              text-sm
              hover:bg-gray-50
            "
          >
            <Download size={16} />
            Export
          </button>

          {/* TOGGLE */}
          <div className="flex border rounded-xl overflow-hidden">

            <button
              onClick={() =>
                setView("list")
              }
              className={`
                px-3 py-2 text-sm
                ${
                  view === "list"
                    ? "bg-black text-white"
                    : ""
                }
              `}
            >
              List
            </button>

            <button
              onClick={() =>
                setView("grid")
              }
              className={`
                px-3 py-2 text-sm
                ${
                  view === "grid"
                    ? "bg-black text-white"
                    : ""
                }
              `}
            >
              Grid
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}