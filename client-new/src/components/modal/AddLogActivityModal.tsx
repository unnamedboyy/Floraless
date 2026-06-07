"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  X,
  FileText,
  Loader2,
  Activity,
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
          bg-[#FCFCFD]
          rounded-[32px]
          shadow-2xl
          overflow-hidden
          animate-in
          fade-in
          zoom-in-95
          duration-200
        "
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            shrink-0
            px-10
            py-7
            border-b
            border-gray-200
            bg-[#FCFCFD]
            flex
            items-start
            justify-between
            gap-5
          "
        >

          <div className="space-y-3">

            <div className="
              flex
              items-center
              gap-4
              flex-wrap
            ">

              <div className="
                w-14 h-14
                rounded-2xl
                border
                border-indigo-200
                bg-indigo-50
                text-indigo-600
                flex
                items-center
                justify-center
                shrink-0
              ">
                <Activity size={26} />
              </div>

              <h2
                className="
                  text-[32px]
                  leading-none
                  tracking-tight
                  font-bold
                  text-[#0F172A]
                "
              >
                Tambah Log Aktivitas
              </h2>

            </div>

            <p
              className="
                text-[16px]
                text-gray-500
              "
            >
              Catat progress pekerjaan tanpa mengubah status ticket
            </p>

          </div>

          <button
            onClick={onClose}
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
              hover:text-gray-700
              transition-all
            "
          >
            <X size={24} />
          </button>

        </div>

        {/* =====================================================
            BODY
        ===================================================== */}

        <div
          className="
            px-10
            py-8
            space-y-5
            bg-[#FCFCFD]
          "
        >

          {/* INFO TICKET */}

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-[#FCFCFD]
              p-5
              space-y-3
            "
          >

            <div className="
              flex
              items-center
              gap-2
              text-gray-500
            ">

              <FileText size={18} />

              <div className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
              ">
                Ticket
              </div>

            </div>

            <div className="
              text-[15px]
              font-semibold
              text-[#111827]
            ">
              {ticket?.pelangganId?.nama || "-"}
            </div>

            <div className="
              text-sm
              text-gray-500
            ">
              {ticket?.layananId?.nama || "-"}
            </div>

          </div>

          {/* FORM */}

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-5
              space-y-3
            "
          >

            <div className="
              flex
              items-center
              gap-2
              text-gray-500
            ">

              <FileText size={18} />

              <div className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
              ">
                Progress Aktivitas
              </div>

            </div>

            <textarea
              rows={6}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Contoh: Survey lokasi telah selesai dilakukan, Dekorasi sedang dipersiapkan, Peralatan sudah dikirim ke lokasi, Menunggu konfirmasi pelanggan"
              className="
                w-full
                rounded-2xl
                border
                border-gray-200
                bg-[#FCFCFD]
                px-4
                py-3
                text-[15px]
                text-[#111827]
                resize-none
                outline-none
                focus:border-indigo-300
                focus:bg-white
                transition-all
              "
            />

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-gray-500
              "
            >
              Log ini akan muncul pada riwayat aktivitas ticket.
            </p>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

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

          <p className="
            text-sm
            text-gray-500
          ">
            Aktivitas akan tercatat di riwayat ticket
          </p>

          <div className="
            flex
            items-center
            gap-3
          ">

            <button
              onClick={onClose}
              disabled={loading}
              className="
                h-12
                px-6
                rounded-2xl
                border
                border-gray-200
                bg-white
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#111827]
                shadow-sm
                hover:bg-gray-50
                transition-all
                disabled:opacity-50
              "
            >
              Batal
            </button>

            <button
              onClick={handleSubmit}
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
                disabled:opacity-50
                flex
                items-center
                gap-2
              "
            >

              {
                loading && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )
              }

              Simpan Log

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
