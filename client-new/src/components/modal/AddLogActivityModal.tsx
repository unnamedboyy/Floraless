"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  X,
  FileText,
  Loader2,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  addTicketLog,
} from "@/services/ticket.service";

interface Props {
  open: boolean;
  onClose: () => void;
  ticket?: any;
  onSuccess?: () => void;
}

export default function AddLogActivityModal({
  open,
  onClose,
  ticket,
  onSuccess,
}: Props) {
  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (open) {
      setDescription("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit =
    async () => {

      if (!description.trim()) {

        toast.error(
          "Progress aktivitas wajib diisi"
        );

        return;
      }

      try {

        setLoading(true);

        await addTicketLog(
          ticket?._id,
          description
        );

        toast.success(
          "Log aktivitas berhasil ditambahkan"
        );

        onSuccess?.();

        onClose();

      } catch (err: any) {

        console.error(err);

        toast.error(
          err?.response?.data?.message ||
          "Gagal menambahkan log aktivitas"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div
      className="
        fixed inset-0 z-[999]
        flex items-center justify-center
        bg-black/50
        backdrop-blur-sm
        p-4
      "
    >
      <div
        className="
          w-full
          max-w-2xl
          bg-white
          rounded-3xl
          shadow-2xl
          overflow-hidden
          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-11 h-11
                rounded-2xl
                bg-indigo-100
                flex items-center justify-center
              "
            >
              <FileText
                size={22}
                className="
                  text-indigo-600
                "
              />
            </div>

            <div>
              <h2
                className="
                  text-lg
                  font-bold
                "
              >
                Tambah Log Aktivitas
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                "
              >
                Catat progress pekerjaan
                tanpa mengubah status
                ticket
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              w-10 h-10
              rounded-xl
              hover:bg-gray-100
              flex items-center justify-center
              transition
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div
          className="
            p-6
            space-y-5
          "
        >
          {/* INFO TICKET */}
          <div
            className="
              bg-gray-50
              border
              rounded-2xl
              p-4
            "
          >
            <p
              className="
                text-xs
                text-gray-500
                mb-1
              "
            >
              Ticket
            </p>

            <p
              className="
                font-semibold
                text-gray-800
              "
            >
              {ticket?.pelangganId?.nama ||
                "-"}
            </p>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              {ticket?.layananId?.nama ||
                "-"}
            </p>
          </div>

          {/* FORM */}
          <div
            className="
              bg-white
              border
              rounded-2xl
              p-5
              space-y-3
            "
          >
            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
              "
            >
              Progress Aktivitas
            </label>

            <textarea
              rows={6}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="
Contoh:

• Survey lokasi telah selesai dilakukan

• Dekorasi sedang dipersiapkan

• Peralatan sudah dikirim ke lokasi

• Menunggu konfirmasi pelanggan
              "
              className="
                w-full
                rounded-2xl
                border
                px-4
                py-3
                text-sm
                resize-none
                outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-indigo-500
              "
            />

            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Log ini akan muncul pada
              riwayat aktivitas ticket.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            border-t
            px-6
            py-4
            flex
            justify-end
            gap-3
          "
        >
          <button
            onClick={onClose}
            disabled={loading}
            className="
              px-5
              py-2.5
              rounded-xl
              border
              text-gray-700
              hover:bg-gray-50
              transition
              disabled:opacity-50
            "
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              px-5
              py-2.5
              rounded-xl
              bg-indigo-600
              text-white
              hover:bg-indigo-700
              transition
              disabled:opacity-50
              flex
              items-center
              gap-2
            "
          >
            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            Simpan Log
          </button>
        </div>
      </div>
    </div>
  );
}