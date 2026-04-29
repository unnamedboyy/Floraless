"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Star, Eye, EyeOff } from "lucide-react";

type Testimoni = {
  _id: string;
  pelanggan?: {
    username?: string;
  };
  layanan?: {
    nama_layanan?: string;
  };
  rating: number;
  komentar?: string;
  isVisible?: boolean;
  createdAt?: string;
};

export default function AdminTestimoniPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [list, setList] = useState<Testimoni[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* =========================
     LOAD DATA
  ========================= */

  async function load() {
    setLoading(true);

    try {
      const res = await fetch(`${API}/testimoni/admin`, {
        credentials: "include",
      });

      const data = await res.json();

      console.log("TESTIMONI:", data);

      if (Array.isArray(data)) {
        setList(data);
      } else if (Array.isArray(data.data)) {
        setList(data.data);
      } else {
        setList([]);
      }

    } catch (err) {
      console.error(err);
      setList([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  /* =========================
     SEARCH + FILTER
  ========================= */

  const filtered = useMemo(() => {
    return list.filter((item) => {

      const username =
        item.pelanggan?.username?.toLowerCase() || "";

      const layanan =
        item.layanan?.nama_layanan?.toLowerCase() || "";

      const komentar =
        item.komentar?.toLowerCase() || "";

      const matchSearch =
        username.includes(search.toLowerCase()) ||
        layanan.includes(search.toLowerCase()) ||
        komentar.includes(search.toLowerCase());

      let matchFilter = true;

      if (filter === "visible") {
        matchFilter = item.isVisible === true;
      }

      if (filter === "hidden") {
        matchFilter = item.isVisible === false;
      }

      return matchSearch && matchFilter;
    });
  }, [list, search, filter]);

  /* =========================
     TOGGLE VISIBILITY
  ========================= */

  async function toggleVisible(item: Testimoni) {

    await fetch(`${API}/testimoni/${item._id}/visibility`, {
      method: "PATCH",
      credentials: "include",
    });

    load();
  }

  /* =========================
     RENDER STAR
  ========================= */

  function renderStars(rating: number) {

    return (
      <div className="flex gap-1 text-[#C9AE63]">

        {Array.from({ length: 5 }).map((_, i) => (

          <Star
            key={i}
            size={14}
            className={
              i < rating
                ? "fill-[#C9AE63] text-[#C9AE63]"
                : "text-neutral-300"
            }
          />

        ))}

      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen">

      <div className="p-10 space-y-10">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-semibold">
            Testimoni
          </h1>

          <p className="text-sm text-neutral-500 mt-2">
            Kelola testimoni pelanggan yang tampil di homepage
          </p>

        </div>

        {/* CARD */}

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

          {/* SEARCH */}

          <div className="flex items-center gap-4">

            <div className="relative flex-1">

              <Search
                size={16}
                className="absolute left-3 top-3 text-neutral-400"
              />

              <input
                placeholder="Search testimoni..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg pl-9 pr-4 py-2 text-sm"
              />

            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-neutral-200 rounded-lg px-4 py-2 text-sm w-[160px]"
            >

              <option value="all">All</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>

            </select>

          </div>

          {/* TABLE HEADER */}

          <div className="grid grid-cols-12 text-xs uppercase tracking-widest text-neutral-400 border-b pb-3">

            <div className="col-span-3">Pelanggan</div>
            <div className="col-span-2">Layanan</div>
            <div className="col-span-2">Rating</div>
            <div className="col-span-3">Komentar</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Action</div>

          </div>

          {/* LIST */}

          {loading ? (

            <p className="text-neutral-500">Loading...</p>

          ) : (

            <div className="divide-y">

              {filtered.map((item) => (

                <div
                  key={item._id}
                  className="grid grid-cols-12 items-center py-4 hover:bg-neutral-50"
                >

                  {/* USER */}

                  <div className="col-span-3">

                    <p className="font-medium">
                      {item.pelanggan?.username || "-"}
                    </p>

                    <p className="text-xs text-neutral-400">

                      {item.createdAt &&
                        new Date(item.createdAt).toLocaleDateString("id-ID")}

                    </p>

                  </div>

                  {/* LAYANAN */}

                  <div className="col-span-2 text-sm text-neutral-600">

                    {item.layanan?.nama_layanan || "-"}

                  </div>

                  {/* RATING */}

                  <div className="col-span-2">

                    {renderStars(item.rating)}

                  </div>

                  {/* KOMENTAR */}

                  <div className="col-span-3 text-sm text-neutral-600 line-clamp-2">

                    {item.komentar || "-"}

                  </div>

                  {/* STATUS */}

                  <div className="col-span-1">

                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        item.isVisible
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {item.isVisible ? "Visible" : "Hidden"}
                    </span>

                  </div>

                  {/* ACTION */}

                  <div className="col-span-1 flex justify-end">

                    <button
                      onClick={() => toggleVisible(item)}
                      className="p-2 hover:bg-neutral-100 rounded-lg"
                    >

                      {item.isVisible ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}