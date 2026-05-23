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
} from "lucide-react";

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

  const [buktiTf,
    setBuktiTf] =
    useState("");

  const [alasan,
    setAlasan] =
    useState("");

  const [preview,
    setPreview] =
    useState("");

  const [uploading,
    setUploading] =
    useState(false);

  const [loadingApprove,
    setLoadingApprove] =
    useState(false);

  const [loadingReject,
    setLoadingReject] =
    useState(false);

  /* =====================================================
     ESC CLOSE
  ===================================================== */

  useEffect(() => {

    const handleEsc =
      (e: KeyboardEvent) => {

        if (
          e.key === "Escape"
        ) {
          onClose();
        }
      };

    window.addEventListener(
      "keydown",
      handleEsc
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleEsc
      );
    };

  }, [onClose]);

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
     APPROVE
  ===================================================== */

  const handleApproveClick =
    async () => {

      try {

        if (!buktiTf) {

          return alert(
            "Upload bukti transfer terlebih dahulu"
          );
        }

        setLoadingApprove(true);

        await onApprove(
          data._id,
          buktiTf
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoadingApprove(false);
      }
    };

  /* =====================================================
     REJECT
  ===================================================== */

  const handleRejectClick =
    async () => {

      try {

        if (!alasan) {

          return alert(
            "Alasan reject wajib diisi"
          );
        }

        setLoadingReject(true);

        await onReject(
          data._id,
          alasan
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoadingReject(false);
      }
    };

  /* =====================================================
     UPLOAD IMAGE
  ===================================================== */

  const handleUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      try {

        const file =
          e.target.files?.[0];

        if (!file)
          return;

        setUploading(true);

        /* PREVIEW */
        setPreview(
          URL.createObjectURL(
            file
          )
        );

        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );

        const res =
          await api.post(

            "/upload",

            formData,

            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setBuktiTf(
          res.data.url
        );

      } catch (err) {

        console.error(err);

        alert(
          "Gagal upload gambar"
        );

      } finally {

        setUploading(false);
      }
    };

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
        <Clock3 size={14} />,

      className: `
        bg-yellow-100
        text-yellow-700
        border-yellow-200
      `,
    },

    approved: {

      label: "Approved",

      icon:
        <CheckCircle2 size={14} />,

      className: `
        bg-green-100
        text-green-700
        border-green-200
      `,
    },

    rejected: {

      label: "Rejected",

      icon:
        <XCircle size={14} />,

      className: `
        bg-red-100
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
     UI
  ===================================================== */

  return (

    <div className="
      fixed
      inset-0
      z-[999]
      flex
      items-center
      justify-center
      bg-black/50
      backdrop-blur-sm
      p-4
    ">

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="
          absolute
          inset-0
        "
      />

      {/* MODAL */}
      <div className="
        relative
        z-10
        w-full
        max-w-5xl
        overflow-hidden
        rounded-[32px]
        border
        border-black/10
        bg-white
        shadow-2xl
      ">

        {/* HEADER */}
        <div className="
          sticky
          top-0
          z-20
          flex
          items-center
          justify-between
          border-b
          bg-white
          px-6
          py-5
        ">

          <div>

            <h2 className="
              text-2xl
              font-bold
              text-black
            ">
              Detail Cashback
            </h2>

            <p className="
              mt-1
              text-sm
              text-gray-500
            ">
              Informasi lengkap claim cashback pelanggan
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              transition
              hover:bg-gray-100
            "
          >
            <X size={20} />
          </button>

        </div>

        {/* CONTENT */}
        <div className="
          max-h-[85vh]
          overflow-y-auto
          px-6
          py-6
        ">

          {/* STATUS */}
          <div className="
            mb-6
            flex
            items-center
            justify-between
            gap-4
            flex-wrap
          ">

            <div className={`
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              px-4
              py-2
              text-sm
              font-semibold

              ${status.className}
            `}>

              {status.icon}

              {status.label}

            </div>

            <div className="
              text-sm
              text-gray-500
            ">

              Claim dibuat pada:

              {" "}

              <span className="
                font-medium
                text-black
              ">

                {
                  new Date(
                    data.createdAt
                  ).toLocaleString(
                    "id-ID"
                  )
                }

              </span>

            </div>

          </div>

          {/* GRID */}
          <div className="
            grid
            grid-cols-1
            gap-5
            md:grid-cols-2
          ">

            <InfoCard
              title="Pelanggan"
              value={
                data.pelangganId
                  ?.nama || "-"
              }
            />

            <InfoCard
              title="Kode Voucher"
              value={
                data.kode_voucher || "-"
              }
            />

            <InfoCard
              title="Bank"
              value={
                data.bank || "-"
              }
            />

            <InfoCard
              title="No Rekening"
              value={
                data.nomor_rekening || "-"
              }
            />

            <InfoCard
              title="Nama Rekening"
              value={
                data.nama_rekening || "-"
              }
            />

            <InfoCard
              title="Nominal Cashback"
              value={`Rp ${(
                data.amount || 0
              ).toLocaleString(
                "id-ID"
              )}`}
            />

          </div>

          {/* BUKTI TF */}
          {
            data.bukti_tf && (

              <div className="
                mt-6
                rounded-[28px]
                border
                p-6
              ">

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  flex-wrap
                ">

                  <div>

                    <h3 className="
                      text-lg
                      font-semibold
                    ">
                      Bukti Transfer
                    </h3>

                    <p className="
                      mt-1
                      text-sm
                      text-gray-500
                    ">
                      Bukti transfer cashback
                    </p>

                  </div>

                  <a
                    href={data.bukti_tf}
                    target="_blank"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-2xl
                      border
                      px-4
                      py-2
                      text-sm
                      font-medium
                      transition
                      hover:bg-gray-100
                    "
                  >

                    <ExternalLink size={16} />

                    Open Image

                  </a>

                </div>

                <img
                  src={data.bukti_tf}
                  alt="Bukti TF"
                  className="
                    mt-5
                    w-full
                    rounded-3xl
                    border
                    object-cover
                  "
                />

              </div>
            )
          }

          {/* APPROVE */}
          {
            data.status ===
            "pending" && (

              <div className="
                mt-6
                rounded-[28px]
                border
                p-6
              ">

                <h3 className="
                  text-2xl
                  font-bold
                ">
                  Approve Cashback
                </h3>

                <p className="
                  mt-2
                  text-gray-500
                ">
                  Upload bukti transfer cashback.
                </p>

                {/* FILE */}
                <label className="
                  mt-5
                  flex
                  h-44
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-3xl
                  border-2
                  border-dashed
                  border-gray-300
                  bg-gray-50
                  transition
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
                        text-center
                      ">

                        <p className="
                          text-lg
                          font-semibold
                        ">
                          Uploading...
                        </p>

                      </div>

                    ) : (

                      <div className="
                        text-center
                      ">

                        <div className="
                          mb-3
                          flex
                          justify-center
                        ">
                          <UploadCloud size={40} />
                        </div>

                        <p className="
                          text-lg
                          font-semibold
                        ">
                          Upload Bukti Transfer
                        </p>

                        <p className="
                          mt-2
                          text-sm
                          text-gray-500
                        ">
                          PNG, JPG, JPEG
                        </p>

                      </div>
                    )
                  }

                </label>

                {/* PREVIEW */}
                {
                  preview && (

                    <div className="
                      mt-5
                    ">

                      <img
                        src={preview}
                        alt="Preview"
                        className="
                          w-full
                          rounded-3xl
                          border
                          object-cover
                        "
                      />

                    </div>
                  )
                }

                {/* BUTTON */}
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
                    mt-5
                    h-14
                    w-full
                    rounded-2xl
                    bg-green-600
                    text-lg
                    font-semibold
                    text-white
                    transition
                    hover:bg-green-700
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
            )
          }

          {/* REJECT */}
          {
            data.status ===
            "pending" && (

              <div className="
                mt-6
                rounded-[28px]
                border
                p-6
              ">

                <h3 className="
                  text-2xl
                  font-bold
                ">
                  Reject Cashback
                </h3>

                <p className="
                  mt-2
                  text-gray-500
                ">
                  Berikan alasan penolakan cashback.
                </p>

                <textarea
                  rows={5}
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
                    mt-5
                    w-full
                    rounded-2xl
                    border
                    px-5
                    py-4
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-black
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
                    mt-5
                    h-14
                    w-full
                    rounded-2xl
                    bg-red-600
                    text-lg
                    font-semibold
                    text-white
                    transition
                    hover:bg-red-700
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
            )
          }

          {/* REJECT REASON */}
          {
            data.status ===
            "rejected" &&

            data.alasan && (

              <div className="
                mt-6
                rounded-[28px]
                border
                border-red-200
                bg-red-50
                p-6
              ">

                <h3 className="
                  text-xl
                  font-bold
                  text-red-700
                ">
                  Alasan Penolakan
                </h3>

                <p className="
                  mt-3
                  leading-relaxed
                  text-red-600
                ">
                  {
                    data.alasan
                  }
                </p>

              </div>
            )
          }

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({

  title,

  value,

}: {

  title: string;

  value: string;
}) {

  return (

    <div className="
      rounded-[28px]
      border
      p-6
    ">

      <p className="
        text-sm
        uppercase
        tracking-widest
        text-gray-400
      ">
        {title}
      </p>

      <p className="
        mt-3
        text-2xl
        font-bold
        text-black
        break-words
      ">
        {value}
      </p>

    </div>
  );
}