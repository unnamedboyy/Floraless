"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

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

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Layanan | null>(null);

  const [form, setForm] = useState({
    nama_layanan: "",
    deskripsi: "",
    harga: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

  const filtered = useMemo(() => {
    return list.filter((item) =>
      item.nama_layanan.toLowerCase().includes(search.toLowerCase())
    );
  }, [list, search]);

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

    // 👇 PERBAIKAN: langsung pakai item.gambar
    setPreview(item.gambar || null);

    setFile(null);
    setShowModal(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit() {
    const formData = new FormData();
    formData.append("nama_layanan", form.nama_layanan);
    formData.append("deskripsi", form.deskripsi);
    formData.append("harga", form.harga);

    if (file) {
      formData.append("gambar", file);
    }

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

  async function handleDelete(id: string) {
    if (!confirm("Hapus layanan ini?")) return;

    await fetch(`${API}/layanan/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    load();
  }

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
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Layanan</h1>
        <button
          onClick={openCreate}
          className="bg-[#C9AE63] text-white px-5 py-2 rounded-lg"
        >
          + Tambah
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search layanan..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-3 mb-6"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="border rounded-2xl p-5 flex gap-6 items-center"
            >
              {/* IMAGE */}
              <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center">
                {item.gambar ? (
                  <Image
                    src={item.gambar}
                    alt={item.nama_layanan}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xs text-neutral-400">
                    No Image
                  </span>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <h3 className="font-semibold">
                  {item.nama_layanan}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Rp {item.harga.toLocaleString()}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                    item.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="px-3 py-1 text-sm border rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => toggleActive(item)}
                  className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg"
                >
                  Toggle
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-6">
              {editing ? "Edit Layanan" : "Tambah Layanan"}
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Nama Layanan"
                value={form.nama_layanan}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama_layanan: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                type="number"
                placeholder="Harga"
                value={form.harga}
                onChange={(e) =>
                  setForm({ ...form, harga: e.target.value })
                }
                className="w-full border rounded-lg px-4 py-3"
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
                className="w-full border rounded-lg px-4 py-3"
              />

              {/* FILE INPUT */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded-lg px-4 py-3"
              />

              {/* PREVIEW */}
              {preview && (
                <div className="relative w-full h-40 rounded-lg overflow-hidden">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-6">
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