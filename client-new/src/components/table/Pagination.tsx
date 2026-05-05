"use client";

type Props = {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, total, limit, onChange }: Props) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between mt-6">

      {/* LEFT INFO */}
      <p className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </p>

      {/* PAGINATION */}
      <div className="flex items-center gap-2">

        {/* PREV */}
        <button
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-40"
        >
          Prev
        </button>

        {/* NUMBERS */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-3 py-2 rounded-lg text-sm transition
              ${
                p === page
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-600"
              }
            `}
          >
            {p}
          </button>
        ))}

        {/* NEXT */}
        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-100 disabled:opacity-40"
        >
          Next
        </button>

      </div>
    </div>
  );
}