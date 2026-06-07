"use client";

export default function Pagination({
  page,
  total,
  limit,
  onChange,
}: {
  page: number;
  total: number;
  limit: number;
  onChange: (p: number) => void;
}) {

  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages: (number | string)[] = [];

    // kalau page sedikit
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // awal
    if (page <= 4) {
      pages.push(1, 2, 3, 4, "...", totalPages);
      return pages;
    }

    // akhir
    if (page >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );

      return pages;
    }

    // tengah
    pages.push(
      1,
      "...",
      page - 1,
      page,
      page + 1,
      "...",
      totalPages
    );

    return pages;
  };

  return (
    <div className="flex flex-wrap justify-end items-center gap-2 mt-4">

      {/* PREV */}
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="
          w-11 h-11
          rounded-2xl
          border
          border-gray-200
          shadow-sm
          bg-white
          hover:bg-gray-100
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition
        "
      >
        ←
      </button>

      {/* PAGE */}
      {generatePages().map((p, index) => {

        if (p === "...") {
          return (
            <div
              key={index}
              className="
                w-11 h-11
                flex
                items-center
                justify-center
                text-lg
                font-semibold
              "
            >
              ...
            </div>
          );
        }

        return (
          <button
            key={index}
            onClick={() => onChange(Number(p))}
            className={`
              w-11 h-11
              rounded-2xl
              transition-all
              duration-200
              ${
                p === page
                  ? "bg-[#111827] text-white shadow-sm"
                  : "border border-gray-200 bg-white hover:bg-gray-50 shadow-sm"
              }
            `}
          >
            {p}
          </button>
        );
      })}

      {/* NEXT */}
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="
          w-11 h-11
          rounded-2xl
          border
          bg-white
          hover:bg-gray-100
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition
        "
      >
        →
      </button>

    </div>
  );
}