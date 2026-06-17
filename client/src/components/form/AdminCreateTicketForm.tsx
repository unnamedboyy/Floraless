"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import BaseModal from "@/components/form/BaseModal";
import { createTicketByAdmin } from "@/services/ticket.service";
import api from "@/lib/axios";

import {
  X,
  User,
  Users,
  Briefcase,
  Calendar,
  MapPin,
  FileText,
  Link2,
} from "lucide-react";

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


/* =====================================================
   SECTION
===================================================== */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-[24px]
        border
        border-gray-200
        bg-white
        p-7
        space-y-6
        shadow-sm
      "
    >
      <h3
        className="
          text-[30px]
          font-semibold
          text-[#111827]
        "
      >
        {title}
      </h3>

      {children}
    </div>
  );
}

/* =====================================================
   INPUT FIELD
===================================================== */

function InputField({
  label,
  icon,
  children,
  textarea = false,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  textarea?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label
        className="
          text-sm
          font-medium
          text-gray-700
        "
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div
            className={`
              absolute
              left-4
              text-gray-400
              z-10
              ${
                textarea
                  ? "top-4"
                  : "top-1/2 -translate-y-1/2"
              }
            `}
          >
            {icon}
          </div>
        )}

        <div
          className="
            [&_input]:pl-11
            [&_textarea]:pl-11
            [&_select]:pl-11
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   INPUT STYLE
===================================================== */

const inputClass = `
  w-full
  h-14
  rounded-2xl
  border
  border-gray-200
  bg-white
  px-4
  text-[15px]
  text-gray-800
  outline-none
  transition-all
  shadow-sm
  placeholder:text-gray-400
  focus:border-gray-300
  focus:ring-4
  focus:ring-gray-100
`;

const textareaClass = `
  w-full
  rounded-2xl
  border
  border-gray-200
  bg-white
  px-4
  py-4
  text-[15px]
  text-gray-800
  outline-none
  transition-all
  shadow-sm
  resize-none
  placeholder:text-gray-400
  focus:border-gray-300
  focus:ring-4
  focus:ring-gray-100
`;
    
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
        maxWidth="max-w-6xl"
        className="h-[92vh]"
            >
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
<>
  {/* HEADER */}

        <div
            className="
            px-10
            py-7
            border-b
            border-gray-200
            bg-[#FCFCFD]
            shrink-0
            "
        >
            <div className="flex items-start justify-between">
            <div>
                <div className="flex items-center gap-4 flex-wrap">
                <h2
                    className="
                    text-[44px]
                    leading-none
                    tracking-tight
                    font-bold
                    text-[#0F172A]
                    "
                >
                    Buat
                </h2>

                <h2
                    className="
                    text-[44px]
                    leading-none
                    tracking-tight
                    font-bold
                    text-[#C9AE63]
                    "
                >
                    Ticket
                </h2>

                <h2
                    className="
                    text-[44px]
                    leading-none
                    tracking-tight
                    font-bold
                    text-[#0F172A]
                    "
                >
                    Baru
                </h2>
                </div>

                <p className="mt-3 text-[16px] text-gray-500">
                Buat pemesanan baru untuk pelanggan
                </p>
            </div>

            <button
                onClick={onClose}
                type="button"
                className="
                w-14 h-14
                rounded-2xl
                border
                border-gray-300
                bg-white
                flex
                items-center
                justify-center
                text-gray-500
                hover:bg-gray-50
                transition-all
                "
            >
                <X size={24} />
            </button>
            </div>
        </div>

        {/* BODY */}

        <form
            onSubmit={handleSubmit}
            className="
            flex
            flex-col
            h-full
            "
        >
            <div
            className="
                flex-1
                overflow-y-auto
                px-10
                py-8
                space-y-7
                bg-[#FCFCFD]
            "
            >
            <Section title="Informasi Pemesanan">
                <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-5
                "
                >
                <InputField
                    label="Pelanggan"
                    icon={<User size={18} />}
                >
                    <select
                    value={form.pelangganId}
                    onChange={(e) =>
                        setForm({
                        ...form,
                        pelangganId:
                            e.target.value,
                        })
                    }
                    className={inputClass}
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
                </InputField>

                <InputField
                    label="Pegawai PIC"
                    icon={<Users size={18} />}
                >
                    <select
                    value={form.pegawaiId}
                    onChange={(e) =>
                        setForm({
                        ...form,
                        pegawaiId:
                            e.target.value,
                        })
                    }
                    className={inputClass}
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
                </InputField>

                <InputField
                    label="Layanan"
                    icon={
                    <Briefcase size={18} />
                    }
                >
                    <select
                    value={form.layananId}
                    onChange={(e) =>
                        setForm({
                        ...form,
                        layananId:
                            e.target.value,
                        })
                    }
                    className={inputClass}
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
                </InputField>

                <InputField
                    label="Tanggal Acara"
                    icon={
                    <Calendar size={18} />
                    }
                >
                    <input
                    type="date"
                    name="tanggal"
                    value={form.tanggal}
                    onChange={handleChange}
                    className={inputClass}
                    required
                    />
                </InputField>
                </div>
            </Section>

            <Section title="Detail Acara">
                <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-5
                "
                >
                <InputField
                    label="Nama Acara"
                    icon={
                    <FileText size={18} />
                    }
                >
                    <input
                    type="text"
                    name="nama_acara"
                    value={form.nama_acara}
                    onChange={handleChange}
                    placeholder="Masukkan nama acara"
                    className={inputClass}
                    required
                    />
                </InputField>

                <InputField
                    label="Referensi"
                    icon={<Link2 size={18} />}
                >
                    <input
                    type="text"
                    name="referensi"
                    value={form.referensi}
                    onChange={handleChange}
                    placeholder="Link referensi"
                    className={inputClass}
                    />
                </InputField>

                <div className="md:col-span-2">
                    <InputField
                    label="Lokasi"
                    icon={<MapPin size={18} />}
                    textarea
                    >
                    <textarea
                        rows={4}
                        name="lokasi"
                        value={form.lokasi}
                        onChange={handleChange}
                        placeholder="Masukkan lokasi acara"
                        className={
                        textareaClass
                        }
                    />
                    </InputField>
                </div>

                <div className="md:col-span-2">
                    <InputField
                    label="Catatan"
                    icon={
                        <FileText size={18} />
                    }
                    textarea
                    >
                    <textarea
                        rows={4}
                        name="catatan"
                        value={form.catatan}
                        onChange={handleChange}
                        placeholder="Catatan tambahan"
                        className={
                        textareaClass
                        }
                    />
                    </InputField>
                </div>
                </div>
            </Section>
            </div>

            {/* FOOTER */}

            <div
            className="
                shrink-0
                px-10
                py-5
                border-t
                border-gray-200
                bg-white/90
                backdrop-blur-sm
                flex
                items-center
                justify-between
            "
            >
            <p className="text-sm text-gray-500">
                Data pemesanan akan dibuat
                oleh admin
            </p>

            <div className="flex gap-3">
                <button
                type="button"
                onClick={onClose}
                className="
                    h-12
                    px-6
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    text-gray-700
                    font-medium
                "
                >
                Batal
                </button>

                <button
                type="submit"
                disabled={loading}
                className="
                    h-12
                    px-8
                    rounded-2xl
                    bg-[#111827]
                    text-white
                    font-medium
                    hover:bg-black
                    transition-all
                "
                >
                {loading
                    ? "Menyimpan..."
                    : "Buat Ticket"}
                </button>
            </div>
            </div>
        </form>
        </>
      </form>
    </BaseModal>
  );
}