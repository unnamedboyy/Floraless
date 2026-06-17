"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import BaseModal from "@/components/form/BaseModal";

import {
  createTicketByAdmin,
} from "@/services/ticket.service";

import api from "@/lib/axios";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Pelanggan {
  _id: string;
  nama: string;
}

interface Pegawai {
  _id: string;
  nama: string;
}

interface Layanan {
  _id: string;
  nama: string;
  harga: number;
}

export default function AdminCreateTicketModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [pelanggans, setPelanggans] =
    useState<Pelanggan[]>([]);

  const [pegawais, setPegawais] =
    useState<Pegawai[]>([]);

  const [layanans, setLayanans] =
    useState<Layanan[]>([]);

  const [form, setForm] = useState({
    pelangganId: "",
    pegawaiId: "",
    layananId: "",
    tanggal: "",
    nama_acara: "",
    lokasi: "",
    catatan: "",
    referensi: "",
  });

  /* =========================================
     LOAD MASTER DATA
  ========================================= */

  useEffect(() => {
    if (!open) return;

    loadData();
  }, [open]);

  const loadData = async () => {
    try {
      const [
        pelangganRes,
        pegawaiRes,
        layananRes,
      ] = await Promise.all([
        api.get("/pelanggans"),
        api.get("/pegawais"),
        api.get("/layanans"),
      ]);

      setPelanggans(
        pelangganRes.data.data ||
          pelangganRes.data
      );

      setPegawais(
        pegawaiRes.data.data ||
          pegawaiRes.data
      );

      setLayanans(
        layananRes.data.data ||
          layananRes.data
      );
    } catch (err) {
      console.error(err);

      toast.error(
        "Gagal memuat data"
      );
    }
  };

  /* =========================================
     HANDLE CHANGE
  ========================================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createTicketByAdmin(
        form
      );

      toast.success(
        "Ticket berhasil dibuat"
      );

      setForm({
        pelangganId: "",
        pegawaiId: "",
        layananId: "",
        tanggal: "",
        nama_acara: "",
        lokasi: "",
        catatan: "",
        referensi: "",
      });

      onSuccess?.();

      onClose();
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.response?.data
          ?.message ||
          "Gagal membuat ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="max-w-4xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* PELANGGAN */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Pelanggan
          </label>

          <select
            value={form.pelangganId}
            onChange={(e) =>
              setForm({
                ...form,
                pelangganId:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">
              Pilih Pelanggan
            </option>

            {pelanggans.map(
              (item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.nama}
                </option>
              )
            )}
          </select>
        </div>

        {/* PEGAWAI */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Pegawai PIC
          </label>

          <select
            value={form.pegawaiId}
            onChange={(e) =>
              setForm({
                ...form,
                pegawaiId:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">
              Pilih Pegawai
            </option>

            {pegawais.map(
              (item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.nama}
                </option>
              )
            )}
          </select>
        </div>

        {/* LAYANAN */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Layanan
          </label>

          <select
            value={form.layananId}
            onChange={(e) =>
              setForm({
                ...form,
                layananId:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg px-3 py-2"
            required
          >
            <option value="">
              Pilih Layanan
            </option>

            {layanans.map(
              (item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.nama} - Rp
                  {item.harga.toLocaleString(
                    "id-ID"
                  )}
                </option>
              )
            )}
          </select>
        </div>

        {/* TANGGAL */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Tanggal Acara
          </label>

          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={
              handleChange
            }
            className="w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* NAMA ACARA */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Nama Acara
          </label>

          <input
            type="text"
            name="nama_acara"
            value={form.nama_acara}
            onChange={
              handleChange
            }
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Masukkan nama acara"
            required
          />
        </div>

        {/* LOKASI */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Lokasi
          </label>

          <input
            type="text"
            name="lokasi"
            value={form.lokasi}
            onChange={
              handleChange
            }
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Lokasi acara"
            required
          />
        </div>

        {/* REFERENSI */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Referensi
          </label>

          <input
            type="text"
            name="referensi"
            value={form.referensi}
            onChange={
              handleChange
            }
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Link referensi (opsional)"
          />
        </div>

        {/* CATATAN */}

        <div>
          <label className="block text-sm font-medium mb-2">
            Catatan
          </label>

          <textarea
            rows={4}
            name="catatan"
            value={form.catatan}
            onChange={
              handleChange
            }
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Catatan tambahan"
          />
        </div>

        {/* ACTION */}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-black text-white"
          >
            {loading
              ? "Menyimpan..."
              : "Buat Ticket"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}