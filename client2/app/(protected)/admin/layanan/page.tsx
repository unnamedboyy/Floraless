"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Power,
  X,
} from "lucide-react";

type Layanan = {
  _id: string;
  nama_layanan: string;
  deskripsi: string;
  harga: number;
  gambar?: string;
  isActive?: boolean;
};

export default function AdminLayananPage() {

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [list, setList] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Layanan | null>(null);

  const [form, setForm] = useState({
    nama_layanan: "",
    deskripsi: "",
    harga: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /* =========================
     LOAD DATA
  ========================= */

  async function load() {

    setLoading(true);

    const res = await fetch(`${API}/layanan`, {
      credentials: "include",
    });

    const data = await res.json();

    setList(data);
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

      const matchSearch = item.nama_layanan
        .toLowerCase()
        .includes(search.toLowerCase());

      let matchFilter = true;

      if (filter === "active") {
        matchFilter = item.isActive === true;
      }

      if (filter === "inactive") {
        matchFilter = item.isActive === false;
      }

      return matchSearch && matchFilter;

    });

  }, [list, search, filter]);

  /* =========================
     MODAL HANDLING
  ========================= */

  function openCreate() {

    setEditing(null);
    setForm({ nama_layanan: "", deskripsi: "", harga: "" });
    setFile(null);
    setPreview(null);
    setShowModal(true);

  }

  function openEdit(item: Layanan) {

    setEditing(item);

    setForm({
      nama_layanan: item.nama_layanan,
      deskripsi: item.deskripsi || "",
      harga: String(item.harga),
    });

    setPreview(item.gambar || null);
    setFile(null);
    setShowModal(true);

  }

  /* =========================
     IMAGE CHANGE
  ========================= */

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {

    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));

  }

  /* =========================
     SUBMIT
  ========================= */

  async function handleSubmit() {

    const formData = new FormData();

    formData.append("nama_layanan", form.nama_layanan);
    formData.append("deskripsi", form.deskripsi);
    formData.append("harga", form.harga);

    if (file) formData.append("gambar", file);

    const url = editing
      ? `${API}/layanan/${editing._id}`
      : `${API}/layanan`;

    await fetch(url, {
      method: editing ? "PATCH" : "POST",
      body: formData,
      credentials: "include",
    });

    setShowModal(false);
    load();

  }

  /* =========================
     DELETE
  ========================= */

  async function handleDelete(id: string) {

    if (!confirm("Hapus layanan ini?")) return;

    await fetch(`${API}/layanan/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    load();

  }

  /* =========================
     TOGGLE STATUS
  ========================= */

  async function toggleActive(item: Layanan) {

    await fetch(`${API}/layanan/${item._id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isActive: !item.isActive,
      }),
    });

    load();

  }

  return (

    <div className="bg-neutral-100 min-h-screen">
      <div className="p-10 space-y-10">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-semibold">
              Layanan
            </h1>

            <p className="text-sm text-neutral-500 mt-2">
              Kelola semua paket dekorasi yang tersedia
            </p>

          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#C9AE63] text-white px-5 py-2 rounded-lg hover:opacity-90"
          >
            <Plus size={16} />
            Tambah Layanan
          </button>

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
                placeholder="Search layanan..."
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

              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>

            </select>

          </div>

          {/* TABLE HEADER */}

          <div className="grid grid-cols-12 text-xs uppercase tracking-widest text-neutral-400 border-b pb-3">

            <div className="col-span-4">Layanan</div>
            <div className="col-span-2">Harga</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-4 text-right">Action</div>

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

                  <div className="col-span-4 flex items-center gap-4">

                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100">

                      {item.gambar && (
                        <Image
                          src={item.gambar}
                          alt={item.nama_layanan}
                          fill
                          className="object-cover"
                        />
                      )}

                    </div>

                    <div>

                      <p className="font-medium">
                        {item.nama_layanan}
                      </p>

                      <p className="text-xs text-neutral-500 line-clamp-1">
                        {item.deskripsi}
                      </p>

                    </div>

                  </div>

                  <div className="col-span-2 text-sm text-neutral-700">
                    Rp {item.harga.toLocaleString()}
                  </div>

                  <div className="col-span-2">

                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        item.isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>

                  </div>

                  <div className="col-span-4 flex justify-end gap-2">

                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 hover:bg-neutral-100 rounded-lg"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => toggleActive(item)}
                      className="p-2 hover:bg-neutral-100 rounded-lg"
                    >
                      <Power size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-2xl p-8 w-full max-w-lg relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-neutral-400"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-6">
              {editing ? "Edit Layanan" : "Tambah Layanan"}
            </h2>

            <div className="space-y-4">

              <input
                placeholder="Nama layanan"
                value={form.nama_layanan}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama_layanan: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="number"
                placeholder="Harga"
                value={form.harga}
                onChange={(e) =>
                  setForm({
                    ...form,
                    harga: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <textarea
                placeholder="Deskripsi"
                value={form.deskripsi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    deskripsi: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />

              {preview && (
                <div className="relative h-40 rounded-lg overflow-hidden">
                  <Image
                    src={preview}
                    alt="preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#C9AE63] text-white rounded-lg"
              >
                {editing ? "Update" : "Create"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}