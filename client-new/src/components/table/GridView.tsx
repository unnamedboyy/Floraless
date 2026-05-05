"use client";

import AvatarCell from "./AvatarCell";

export default function GridView({ data }: { data: any[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">

      {data.map((row) => {
        const name =
          row.nama || row.userId?.username || "User";

        return (
          <div
            key={row._id}
            className="bg-white border rounded-xl p-4 hover:shadow transition"
          >
            {/* AVATAR */}
            <AvatarCell name={name} />

            {/* INFO */}
            <div className="mt-3 text-sm text-gray-600">
              <p>
                <b>Username:</b>{" "}
                {row.userId?.username || "-"}
              </p>
            </div>

            {/* ACTION */}
            <div className="mt-4 flex gap-2 text-sm">
              <button className="text-blue-500">
                Detail
              </button>
            </div>
          </div>
        );
      })}

      {data.length === 0 && (
        <p className="text-sm text-gray-500">
          Tidak ada data
        </p>
      )}

    </div>
  );
}