"use client";

import { useState } from "react";
import { useLayanan } from "@/hooks/useLayanan";
import { layananService } from "@/services/layanan.service";

import LayananFormModal from "@/components/modal/LayananFormModal";
import LayananDetailModal from "@/components/modal/LayananDetailModal";

export default function LayananPage() {
  const {
    data,
    loading,
    search,
    setSearch,
    create,
    update,
    remove
  } = useLayanan();

  const [form, setForm] = useState<any>({
    nama: "",
    harga: "",
    deskripsi: ""
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  // ================= CREATE / EDIT =================
  const handleCreate = () => {
    setForm({ nama: "", harga: "", deskripsi: "" });
    setEditId(null);
    setFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setForm({
      nama: item.nama,
      harga: item.harga,
      deskripsi: item.deskripsi
    });
    setEditId(item._id);
    setFormOpen(true);
  };

  const handleSubmit = () => {
    if (editId) {
      update(editId, form);
    } else {
      create(form);
    }

    setFormOpen(false);
  };

  // ================= DETAIL =================
  const handleDetail = (item: any) => {
    setSelected(item);
  };

  // ================= TOGGLE =================
  const handleToggle = async (id: string) => {
    await layananService.toggle(id);
    location.reload(); // simple refresh
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Kelola Layanan</h1>

      {/* SEARCH */}
      <input
        placeholder="Search layanan..."
        className="border px-3 py-2 rounded mb-4 w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* BUTTON TAMBAH */}
      <button
        onClick={handleCreate}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        + Tambah Layanan
      </button>

      {/* TABLE */}
      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Nama</th>
              <th className="p-2 text-left">Harga</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((l: any) => (
                <tr key={l._id} className="border-t">
                  <td className="p-2">{l.nama}</td>

                  <td className="p-2">
                    Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(
                      l.harga || 0
                    )}
                  </td>

                  {/* STATUS TOGGLE */}
                  <td className="p-2">
                    <button
                      onClick={() => handleToggle(l._id)}
                      className={`px-2 py-1 text-white text-xs rounded ${
                        l.isActive
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {l.isActive ? "Active" : "Non-active"}
                    </button>
                  </td>

                  {/* ACTION */}
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleDetail(l)}
                      className="bg-gray-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Detail
                    </button>

                    <button
                      onClick={() => handleEdit(l)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Yakin hapus layanan?")) {
                          remove(l._id);
                        }
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODALS ================= */}

      {/* FORM MODAL */}
      <LayananFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        isEdit={!!editId}
      />

      {/* DETAIL MODAL */}
      <LayananDetailModal
        data={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}