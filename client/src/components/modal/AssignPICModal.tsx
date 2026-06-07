"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  User2,
  Camera,
  Ticket,
  Wallet,
  CheckCircle2,
  X,
  Calendar,
  Phone,
} from "lucide-react";

import {
  getPegawaiList,
} from "@/services/pegawai.service";

import BaseModal from "@/components/form/BaseModal";

/* =====================================================
   TYPES
===================================================== */

type Props = {
  open: boolean;

  onClose: () => void;

  onSubmit: (
    pegawaiId: string
  ) => void;

  ticket?: any;
};

/* =====================================================
   FORMAT
===================================================== */

const formatRupiah = (
  num: number
) =>
  "Rp " +
  (num || 0).toLocaleString(
    "id-ID"
  );

/* =====================================================
   COMPONENT
===================================================== */

export default function AssignPICModal({

  open,

  onClose,

  onSubmit,

  ticket,

}: Props) {

  /* =====================================================
     STATE
  ===================================================== */

  const [
    pegawai,
    setPegawai,
  ] = useState<any[]>([]);

  const [
    selected,
    setSelected,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    loadingPegawai,
    setLoadingPegawai,
  ] = useState(false);

  /* =====================================================
     FETCH
  ===================================================== */

  useEffect(() => {

    if (open) {
      fetchPegawai();
    }

  }, [open]);

  const fetchPegawai =
    async () => {

      try {

        setLoadingPegawai(true);

        const res =
          await getPegawaiList();

        setPegawai(
          res.data.data || []
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoadingPegawai(false);

      }
    };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async () => {

      if (!selected)
        return;

      try {

        setLoading(true);

        await onSubmit(
          selected
        );

      } finally {

        setLoading(false);

      }
    };

  /* =====================================================
     CLOSE
  ===================================================== */

  if (!open)
    return null;

  /* =====================================================
     DATA
  ===================================================== */

  const pelanggan =
    ticket?.pelangganId;

  const layanan =
    ticket?.layananId;

  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="max-w-5xl"
      className="
        h-[90vh]
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
                Assign PIC
              </h2>

              <div className="
                h-12
                px-5
                rounded-2xl
                flex
                items-center
                justify-center
                text-[15px]
                font-semibold
                border
                border-slate-200
                bg-slate-100
                text-slate-700
                shadow-sm
              ">

                {
                  pegawai.length
                } Pegawai

              </div>

            </div>

            <p className="
              text-[16px]
              text-gray-500
            ">
              Pilih pegawai yang akan menjadi PIC ticket
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

{/* =====================================================
    INFORMASI TICKET
===================================================== */}

{
  ticket && (

    <Section title="Informasi Ticket">

      {/* HERO */}
      <div className="
        rounded-[28px]
        border
        border-gray-200
        bg-[#FCFCFD]
        p-7
      ">

        <div className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          xl:justify-between
          gap-8
        ">

          {/* LEFT */}
          <div className="
            flex
            items-start
            gap-5
          ">

            <div className="
              w-24
              h-24
              rounded-[32px]
              bg-slate-100
              text-slate-700
              flex
              items-center
              justify-center
              shrink-0
            ">
              <Camera size={42} />
            </div>

            <div className="
              space-y-4
            ">

              <div>

                <h3 className="
                  text-[34px]
                  leading-tight
                  font-bold
                  text-[#0F172A]
                ">
                  {
                    layanan?.nama ||
                    "-"
                  }
                </h3>

                <p className="
                  mt-2
                  text-gray-500
                ">
                  Detail ticket pelanggan
                </p>

              </div>

              <div className="
                flex
                items-center
                gap-3
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

                  {
                    pelanggan?.nama ||
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
                    formatRupiah(
                      layanan?.harga || 0
                    )
                  }

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="
            xl:w-[320px]
            grid
            grid-cols-2
            gap-4
          ">

            <MiniSummary
              label="Ticket ID"
              value={
                ticket?._id ||
                "-"
              }
            />

            <MiniSummary
              label="Status"
              value={
                ticket?.status ||
                "-"
              }
            />

          </div>

        </div>

      </div>

      {/* DETAIL GRID */}
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
            pelanggan?.nama
          }
        />

        <Field
          icon={
            <Phone size={18} />
          }
          label="No Telepon"
          value={
            pelanggan?.no_telp
          }
        />

        <Field
          icon={
            <Camera size={18} />
          }
          label="Layanan"
          value={
            layanan?.nama
          }
        />

        <Field
          icon={
            <Wallet size={18} />
          }
          label="Harga"
          value={
            formatRupiah(
              layanan?.harga || 0
            )
          }
        />

        <Field
          icon={
            <Ticket size={18} />
          }
          label="Ticket ID"
          value={
            ticket?._id
          }
        />

        <Field
          icon={
            <Calendar size={18} />
          }
          label="Dibuat"
          value={
            ticket?.createdAt

              ? new Date(
                  ticket.createdAt
                ).toLocaleString(
                  "id-ID"
                )

              : "-"
          }
        />

      </div>

    </Section>
  )
}

{/* =====================================================
    PILIH PEGAWAI
===================================================== */}

<Section title="Pilih Pegawai">

  <div className="
    space-y-6
  ">

    {/* EMPTY */}
    {
      !loadingPegawai &&
      pegawai.length ===
        0 && (

        <div className="
          rounded-[24px]
          border
          border-gray-200
          bg-[#FCFCFD]
          p-8
          text-center
        ">

          <div className="
            w-20
            h-20
            mx-auto
            rounded-3xl
            bg-white
            border
            border-gray-200
            flex
            items-center
            justify-center
            text-gray-400
            shadow-sm
          ">
            <User2 size={34} />
          </div>

          <h3 className="
            mt-5
            text-[22px]
            font-bold
            text-[#111827]
          ">
            Tidak Ada Pegawai
          </h3>

          <p className="
            mt-2
            text-gray-500
          ">
            Data pegawai belum tersedia
          </p>

        </div>
      )
    }

    {/* LOADING */}
    {
      loadingPegawai && (

        <div className="
          rounded-[24px]
          border
          border-gray-200
          bg-[#FCFCFD]
          p-8
          text-center
        ">

          <p className="
            text-[16px]
            font-medium
            text-gray-500
          ">
            Loading pegawai...
          </p>

        </div>
      )
    }

    {/* SELECT */}
    {
      !loadingPegawai &&
      pegawai.length >
        0 && (

        <div className="
          space-y-5
        ">

          <div className="
            rounded-[28px]
            border
            border-gray-200
            bg-[#FCFCFD]
            p-6
            space-y-5
          ">

            <div>

              <h3 className="
                text-[24px]
                font-bold
                text-[#111827]
              ">
                Pilih PIC
              </h3>

              <p className="
                mt-2
                text-gray-500
              ">
                Pilih pegawai yang akan menjadi PIC untuk ticket ini
              </p>

            </div>

            <div className="
              relative
            ">

              <select
                value={selected}
                onChange={(e) =>
                  setSelected(
                    e.target.value
                  )
                }
                className="
                  w-full
                  h-16
                  rounded-[24px]
                  border
                  border-gray-200
                  bg-white
                  px-5
                  text-[15px]
                  font-medium
                  text-[#111827]
                  outline-none
                  transition-all
                  focus:border-black
                "
              >

                <option value="">
                  Pilih Pegawai
                </option>

                {
                  pegawai.map(
                    (p) => (

                      <option
                        key={
                          p._id
                        }
                        value={
                          p._id
                        }
                      >

                        {
                          p.nama
                        }

                        {
                          p.no_telp
                            ? ` • ${p.no_telp}`
                            : ""
                        }

                      </option>
                    )
                  )
                }

              </select>

            </div>

          </div>

          {/* SELECTED INFO */}
          {
            selected && (

              <div className="
                rounded-[28px]
                border
                border-black
                bg-white
                p-6
                shadow-sm
              ">

                {
                  pegawai
                    .filter(
                      (p) =>
                        p._id ===
                        selected
                    )
                    .map(
                      (p) => (

                        <div
                          key={
                            p._id
                          }
                          className="
                            flex
                            items-start
                            gap-5
                          "
                        >

                          {/* AVATAR */}
                          <div className="
                            w-24
                            h-24
                            rounded-[32px]
                            bg-slate-100
                            text-slate-700
                            flex
                            items-center
                            justify-center
                            shrink-0
                            overflow-hidden
                          ">

                            {
                              p.profile ? (

                                <img
                                  src={
                                    p.profile
                                  }
                                  alt={
                                    p.nama
                                  }
                                  className="
                                    w-full
                                    h-full
                                    object-cover
                                  "
                                />

                              ) : (

                                <User2
                                  size={
                                    40
                                  }
                                />
                              )
                            }

                          </div>

                          {/* CONTENT */}
                          <div className="
                            flex-1
                            min-w-0
                          ">

                            <div className="
                              flex
                              items-center
                              gap-3
                              flex-wrap
                            ">

                              <h3 className="
                                text-[30px]
                                leading-tight
                                font-bold
                                text-[#111827]
                                break-words
                              ">

                                {
                                  p.nama ||
                                  "-"
                                }

                              </h3>

                              <div className="
                                px-4
                                py-2
                                rounded-2xl
                                bg-emerald-50
                                border
                                border-emerald-200
                                text-emerald-700
                                text-sm
                                font-medium
                              ">

                                Selected PIC

                              </div>

                            </div>

                            <p className="
                              mt-3
                              text-gray-500
                              break-words
                            ">

                              {
                                p.email ||
                                "-"
                              }

                            </p>

                            <div className="
                              mt-5
                              flex
                              items-center
                              gap-3
                              flex-wrap
                            ">

                              {
                                p.no_telp && (

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

                                    {
                                      p.no_telp
                                    }

                                  </div>
                                )
                              }

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

                                Pegawai

                              </div>

                            </div>

                          </div>

                        </div>
                      )
                    )
                }

              </div>
            )
          }

        </div>
      )
    }

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
        gap-4
      ">

        <p className="
          text-sm
          text-gray-500
        ">
          Pilih pegawai untuk menjadi PIC ticket
        </p>

        <div className="
          flex
          items-center
          gap-3
        ">

          <button
            onClick={onClose}
            className="
              h-12
              px-6
              rounded-2xl
              border
              border-gray-300
              bg-white
              text-gray-700
              font-medium
              hover:bg-gray-50
              transition-all
            "
          >
            Batal
          </button>

          <button
            onClick={
              handleSubmit
            }
            disabled={
              !selected ||
              loading
            }
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
              disabled:cursor-not-allowed
            "
          >

            {
              loading

                ? "Menyimpan..."

                : "Simpan PIC"
            }

          </button>

        </div>

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

/* =====================================================
   MINI SUMMARY
===================================================== */

function MiniSummary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div className="
      rounded-2xl
      border
      border-gray-200
      bg-[#FCFCFD]
      p-4
      space-y-2
    ">

      <div className="
        text-xs
        font-semibold
        uppercase
        tracking-wider
        text-gray-500
      ">
        {label}
      </div>

      <div className="
        text-[18px]
        font-bold
        text-[#111827]
        break-words
      ">
        {value}
      </div>

    </div>
  );
}