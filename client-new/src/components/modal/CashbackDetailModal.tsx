"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/axios";

import {
  X,
  CheckCircle2,
  XCircle,
  Clock3,
  ExternalLink,
  UploadCloud,
  Wallet,
  Ticket,
  Landmark,
  User2,
  Calendar,
  FileText,
} from "lucide-react";

import toast from "react-hot-toast";
import BaseModal from "@/components/form/BaseModal";
import {uploadImage} from "@/services/upload.service";

/* =====================================================
   TYPES
===================================================== */

type Props = {
  open: boolean;

  data: any;

  onClose: () => void;

  onApprove: (
    id: string,
    bukti: string
  ) => Promise<void>;

  onReject: (
    id: string,
    alasan: string
  ) => Promise<void>;
};

/* =====================================================
   COMPONENT
===================================================== */

export default function CashbackDetailModal({

  open,

  data,

  onClose,

  onApprove,

  onReject,

}: Props) {

  /* =====================================================
     STATE
  ===================================================== */

  const [
    buktiTf,
    setBuktiTf,
  ] = useState("");

  const [
    alasan,
    setAlasan,
  ] = useState("");

  const [
    preview,
    setPreview,
  ] = useState("");

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    loadingApprove,
    setLoadingApprove,
  ] = useState(false);

  const [
    loadingReject,
    setLoadingReject,
  ] = useState(false);

  /* =====================================================
     RESET
  ===================================================== */

  useEffect(() => {

    if (!open) {

      setBuktiTf("");

      setPreview("");

      setAlasan("");
    }

  }, [open]);

  /* =====================================================
     CLOSE
  ===================================================== */

  if (!open || !data)
    return null;

  /* =====================================================
     STATUS
  ===================================================== */

  const statusConfig = {

    pending: {

      label: "Pending",

      icon:
        <Clock3 size={16} />,

      className: `
        bg-amber-50
        text-amber-700
        border-amber-200
      `,
    },

    approved: {

      label: "Approved",

      icon:
        <CheckCircle2 size={16} />,

      className: `
        bg-emerald-50
        text-emerald-700
        border-emerald-200
      `,
    },

    rejected: {

      label: "Rejected",

      icon:
        <XCircle size={16} />,

      className: `
        bg-red-50
        text-red-700
        border-red-200
      `,
    },
  };

  const status =
    statusConfig[
      data.status as keyof typeof statusConfig
    ];

  /* =====================================================
     APPROVE
  ===================================================== */
  const handleApproveClick = () => {
    if (!buktiTf) {
      toast.error(
        "Upload bukti transfer terlebih dahulu"
      );
      return;
    }

    toast(
      (t) => (
        <div className="w-[320px]">
          <p className="font-semibold text-sm">
            Approve Cashback?
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Cashback akan disetujui dan tidak dapat
            dibatalkan.
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() =>
                toast.dismiss(t.id)
              }
              className="
                px-3
                py-2
                rounded-xl
                border
                text-sm
                hover:bg-gray-50
              "
            >
              Batal
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  await onApprove(
                    data._id,
                    buktiTf
                  );

                  toast.success(
                    "Cashback berhasil diapprove"
                  );
                } catch (err: any) {
                  toast.error(
                    err?.response?.data?.message ||
                      "Gagal approve cashback"
                  );
                }
              }}
              className="
                px-3
                py-2
                rounded-xl
                bg-green-500
                text-white
                text-sm
                hover:bg-green-600
              "
            >
              Setujui
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
  };

  /* =====================================================
     REJECT
  ===================================================== */
  const handleRejectClick = () => {
    if (!alasan.trim()) {
      toast.error(
        "Alasan reject wajib diisi"
      );
      return;
    }

    toast(
      (t) => (
        <div className="w-[320px]">
          <p className="font-semibold text-sm">
            Reject Cashback?
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Cashback akan ditolak.
          </p>

          <div className="mt-3 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
            {alasan}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() =>
                toast.dismiss(t.id)
              }
              className="
                px-3
                py-2
                rounded-xl
                border
                text-sm
                hover:bg-gray-50
              "
            >
              Batal
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);

                try {
                  await onReject(
                    data._id,
                    alasan
                  );

                  toast.success(
                    "Cashback berhasil direject"
                  );
                } catch (err: any) {
                  toast.error(
                    err?.response?.data?.message ||
                      "Gagal reject cashback"
                  );
                }
              }}
              className="
                px-3
                py-2
                rounded-xl
                bg-red-500
                text-white
                text-sm
                hover:bg-red-600
              "
            >
              Reject
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
  };

  /* =====================================================
     UPLOAD
  ===================================================== */

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file =
        e.target.files?.[0];

      if (!file) return;

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        toast.error(
          "File harus berupa gambar"
        );
        return;
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        toast.error(
          "Ukuran maksimal 5MB"
        );
        return;
      }

      setPreview(
        URL.createObjectURL(file)
      );

      setUploading(true);

      const url =
        await uploadImage(
          file,
          "cashback"
        );

      setBuktiTf(url);

      toast.success(
        "Bukti transfer berhasil diupload"
      );

    } catch (err: any) {

      console.error(err);

      toast.error(
        err?.response?.data?.message ||
        "Gagal upload gambar"
      );

    } finally {

      setUploading(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="max-w-6xl"
      className="
        h-[92vh]
      "
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="
        shrink-0
        px-10
        py-7
        border-b
        border-gray-200
        bg-[#FCFCFD]
      ">

        <div className="
          flex
          items-start
          justify-between
          gap-5
        ">

          <div className="
            space-y-3
          ">

            <div className="
              flex
              items-center
              gap-4
              flex-wrap
            ">

              <h2 className="
                text-[44px]
                leading-none
                tracking-tight
                font-bold
                text-[#0F172A]
              ">
                Cashback
              </h2>

              <div className={`
                h-12
                px-5
                rounded-2xl
                flex
                items-center
                gap-2
                text-[15px]
                font-semibold
                border
                shadow-sm

                ${status.className}
              `}>

                {status.icon}

                {status.label}

              </div>

            </div>

            <p className="
              text-[16px]
              text-gray-500
            ">
              Informasi lengkap claim cashback pelanggan
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

      </div>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="
        flex-1
        overflow-y-auto
        px-10
        py-8
        space-y-7
        bg-[#FCFCFD]
      ">

        {/* HERO */}
        <div className="
          rounded-[28px]
          border
          border-gray-200
          bg-white
          p-8
          shadow-sm
        ">

          <div className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-6
          ">

            <div className="
              space-y-4
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <div className="
                  w-16
                  h-16
                  rounded-3xl
                  bg-emerald-50
                  text-emerald-600
                  flex
                  items-center
                  justify-center
                ">
                  <Wallet size={30} />
                </div>

                <div>

                  <h3 className="
                    text-[34px]
                    leading-tight
                    font-bold
                    text-[#0F172A]
                  ">
                    Rp {(
                      data.amount || 0
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </h3>

                  <p className="
                    mt-1
                    text-gray-500
                  ">
                    Nominal cashback pelanggan
                  </p>

                </div>

              </div>

              <div className="
                flex
                items-center
                gap-2
                flex-wrap
              ">

                <div className="
                  px-4
                  py-2
                  rounded-2xl
                  bg-slate-100
                  border
                  border-slate-200
                  text-slate-700
                  text-sm
                  font-medium
                ">
                  Voucher:
                  {" "}
                  {
                    data.kode_voucher ||
                    "-"
                  }
                </div>

                <div className="
                  px-4
                  py-2
                  rounded-2xl
                  bg-neutral-100
                  border
                  border-neutral-200
                  text-neutral-700
                  text-sm
                  font-medium
                ">
                  {
                    new Date(
                      data.createdAt
                    ).toLocaleString(
                      "id-ID"
                    )
                  }
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* INFORMASI */}
        <Section title="Informasi Cashback">

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">

            <Field
              icon={
                <User2 size={18} />
              }
              label="Pelanggan"
              value={
                data.pelangganId
                  ?.nama
              }
            />

            <Field
              icon={
                <Ticket size={18} />
              }
              label="Kode Voucher"
              value={
                data.kode_voucher
              }
            />

            <Field
              icon={
                <Landmark size={18} />
              }
              label="Bank"
              value={data.bank}
            />

            <Field
              icon={
                <Wallet size={18} />
              }
              label="Nomor Rekening"
              value={
                data.nomor_rekening
              }
            />

            <Field
              icon={
                <User2 size={18} />
              }
              label="Nama Rekening"
              value={
                data.nama_rekening
              }
            />

            <Field
              icon={
                <Wallet size={18} />
              }
              label="Nominal Cashback"
              value={`Rp ${(
                data.amount || 0
              ).toLocaleString(
                "id-ID"
              )}`}
            />

          </div>

        </Section>

        {/* BUKTI TF */}
        {
          data.bukti_tf && (

            <Section title="Bukti Transfer">

              <div className="
                flex
                items-start
                justify-between
                gap-4
                flex-wrap
              ">

                <div>

                  <p className="
                    text-[15px]
                    text-gray-500
                  ">
                    Bukti transfer cashback yang telah diupload
                  </p>

                </div>

                <a
                  href={data.bukti_tf}
                  target="_blank"
                  className="
                    h-12
                    px-5
                    rounded-2xl
                    border
                    border-gray-300
                    bg-white
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-gray-700
                    hover:bg-gray-50
                    transition-all
                  "
                >

                  <ExternalLink size={16} />

                  Open Image

                </a>

              </div>

              <div className="
                rounded-[28px]
                overflow-hidden
                border
                border-gray-200
                bg-gray-50
              ">

                <img
                  src={data.bukti_tf}
                  alt="Bukti TF"
                  className="
                    w-full
                    object-cover
                  "
                />

              </div>

            </Section>
          )
        }

        {/* APPROVE */}
        {
          data.status ===
          "pending" && (

            <Section title="Approve Cashback">

              <div className="
                space-y-6
              ">

                <div>

                  <p className="
                    text-[15px]
                    text-gray-500
                  ">
                    Upload bukti transfer cashback untuk menyetujui claim pelanggan.
                  </p>

                </div>

                <label className="
                  relative
                  flex
                  min-h-[260px]
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-[28px]
                  border-2
                  border-dashed
                  border-gray-300
                  bg-[#FCFCFD]
                  px-6
                  py-10
                  text-center
                  transition-all
                  hover:border-black
                ">

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                  />

                  {
                    uploading ? (

                      <div className="
                        space-y-3
                      ">

                        <p className="
                          text-xl
                          font-semibold
                          text-[#111827]
                        ">
                          Uploading...
                        </p>

                        <p className="
                          text-sm
                          text-gray-500
                        ">
                          Mohon tunggu sebentar
                        </p>

                      </div>

                    ) : (

                      <div className="
                        space-y-4
                      ">

                        <div className="
                          w-20
                          h-20
                          rounded-3xl
                          bg-white
                          border
                          border-gray-200
                          flex
                          items-center
                          justify-center
                          shadow-sm
                          mx-auto
                        ">
                          <UploadCloud
                            size={38}
                          />
                        </div>

                        <div>

                          <h3 className="
                            text-[22px]
                            font-bold
                            text-[#111827]
                          ">
                            Upload Bukti Transfer
                          </h3>

                          <p className="
                            mt-2
                            text-gray-500
                          ">
                            PNG, JPG, JPEG
                          </p>

                        </div>

                      </div>
                    )
                  }

                </label>

                {
                  preview && (

                    <div className="
                      rounded-[28px]
                      overflow-hidden
                      border
                      border-gray-200
                    ">

                      <img
                        src={preview}
                        alt="Preview"
                        className="
                          w-full
                          object-cover
                        "
                      />

                    </div>
                  )
                }

                <button
                  onClick={
                    handleApproveClick
                  }
                  disabled={
                    loadingApprove ||
                    uploading ||
                    !buktiTf
                  }
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    bg-emerald-600
                    text-white
                    text-[15px]
                    font-semibold
                    hover:bg-emerald-700
                    transition-all
                    disabled:opacity-50
                  "
                >

                  {
                    loadingApprove

                      ? "Processing..."

                      : "Approve Cashback"
                  }

                </button>

              </div>

            </Section>
          )
        }

        {/* REJECT */}
        {
          data.status ===
          "pending" && (

            <Section title="Reject Cashback">

              <div className="
                space-y-6
              ">

                <div>

                  <p className="
                    text-[15px]
                    text-gray-500
                  ">
                    Berikan alasan penolakan cashback pelanggan.
                  </p>

                </div>

                <textarea
                  rows={6}
                  value={alasan}
                  onChange={(e) =>
                    setAlasan(
                      e.target.value
                    )
                  }
                  placeholder="
                    Masukkan alasan reject...
                  "
                  className="
                    w-full
                    rounded-[28px]
                    border
                    border-gray-200
                    bg-[#FCFCFD]
                    px-5
                    py-5
                    text-[15px]
                    outline-none
                    transition-all
                    focus:border-black
                  "
                />

                <button
                  onClick={
                    handleRejectClick
                  }
                  disabled={
                    loadingReject
                  }
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    bg-red-600
                    text-white
                    text-[15px]
                    font-semibold
                    hover:bg-red-700
                    transition-all
                    disabled:opacity-50
                  "
                >

                  {
                    loadingReject

                      ? "Processing..."

                      : "Reject Cashback"
                  }

                </button>

              </div>

            </Section>
          )
        }

        {/* ALASAN */}
        {
          data.status ===
          "rejected" &&

          data.alasan && (

            <Section title="Alasan Penolakan">

              <div className="
                rounded-[28px]
                border
                border-red-200
                bg-red-50
                p-6
              ">

                <div className="
                  flex
                  items-start
                  gap-4
                ">

                  <div className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-white
                    text-red-600
                    flex
                    items-center
                    justify-center
                    shrink-0
                  ">
                    <FileText size={24} />
                  </div>

                  <div>

                    <h4 className="
                      text-[22px]
                      font-bold
                      text-red-700
                    ">
                      Cashback Ditolak
                    </h4>

                    <p className="
                      mt-3
                      leading-7
                      text-red-600
                    ">
                      {
                        data.alasan
                      }
                    </p>

                  </div>

                </div>

              </div>

            </Section>
          )
        }

        {/* SYSTEM */}
        <Section title="Informasi Sistem">

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">

            <Field
              icon={
                <Calendar size={18} />
              }
              label="Dibuat"
              value={
                data.createdAt
                  ? new Date(
                      data.createdAt
                    ).toLocaleString(
                      "id-ID"
                    )
                  : "-"
              }
            />

            <Field
              icon={
                <Calendar size={18} />
              }
              label="Terakhir Update"
              value={
                data.updatedAt
                  ? new Date(
                      data.updatedAt
                    ).toLocaleString(
                      "id-ID"
                    )
                  : "-"
              }
            />

            <Field
              label="Status"
              value={
                status.label
              }
            />

            <Field
              label="Cashback ID"
              value={data._id}
            />

          </div>

        </Section>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="
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
      ">

        <p className="
          text-sm
          text-gray-500
        ">
          Detail informasi cashback pelanggan
        </p>

        <button
          onClick={onClose}
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
          Tutup
        </button>

      </div>

    </BaseModal>
  );
}

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

    <div className="
      rounded-[24px]
      border
      border-gray-200
      bg-white
      p-7
      space-y-6
      shadow-sm
    ">

      <h3 className="
        text-[28px]
        font-semibold
        text-[#111827]
      ">
        {title}
      </h3>

      {children}

    </div>
  );
}

/* =====================================================
   FIELD
===================================================== */

function Field({
  label,
  value,
  icon,
}: {
  label: string;
  value?: any;
  icon?: React.ReactNode;
}) {

  return (

    <div className="
      rounded-2xl
      border
      border-gray-200
      bg-[#FCFCFD]
      p-5
      space-y-3
    ">

      <div className="
        flex
        items-center
        gap-2
        text-gray-500
      ">

        {icon}

        <div className="
          text-xs
          font-semibold
          uppercase
          tracking-wider
        ">
          {label}
        </div>

      </div>

      <div className="
        text-[15px]
        font-semibold
        text-[#111827]
        break-words
      ">
        {value || "-"}
      </div>

    </div>
  );
}