"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "@/lib/axios";

import BaseModal from "@/components/form/BaseModal";

import {

  TicketPercent,

  User2,

  Wallet,

  CalendarDays,

  X,

  Sparkles,

} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Props = {

  open: boolean;

  onClose: () => void;

  onSubmit: (
    data: any
  ) => Promise<void>;

  initialData?: any;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function VoucherFormModal({

  open,

  onClose,

  onSubmit,

  initialData,

}: Props) {

  /* =====================================================
     STATE
  ===================================================== */

  const [loading, setLoading] =
    useState(false);

  const [

    loadingPelanggan,

    setLoadingPelanggan,

  ] = useState(false);

  const [pelanggan, setPelanggan] =
    useState<any[]>([]);

  const [form, setForm] =
    useState({

      code: "",

      pelangganId: "",

      amount: "",

      expiredAt: "",
    });

  /* =====================================================
     FETCH PELANGGAN
  ===================================================== */

  const fetchPelanggan =
    async () => {

      try {

        setLoadingPelanggan(true);

        const res =
          await api.get(
            "/auth/users/pelanggan?limit=100"
          );

        setPelanggan(
          res.data.data || []
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Gagal mengambil pelanggan"
        );

      } finally {

        setLoadingPelanggan(false);
      }
    };

  /* =====================================================
     EFFECT
  ===================================================== */

  useEffect(() => {

    if (!open) return;

    fetchPelanggan();

  }, [open]);

  useEffect(() => {

    if (initialData) {

      setForm({

        code:
          initialData.code || "",

        pelangganId:
          initialData.pelangganId?._id || "",

        amount:
          initialData.amount || "",

        expiredAt:
          initialData.expiredAt
            ?.slice(0, 10) || "",
      });

    } else {

      setForm({

        code: "",

        pelangganId: "",

        amount: "",

        expiredAt: "",
      });
    }

  }, [
    initialData,
    open,
  ]);

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async () => {

      try {

        if (!form.code) {

          toast.error(
            "Kode voucher wajib diisi"
          );

          return;
        }

        if (!form.pelangganId) {

          toast.error(
            "Pelanggan wajib dipilih"
          );

          return;
        }

        if (!form.amount) {

          toast.error(
            "Nominal voucher wajib diisi"
          );

          return;
        }

        setLoading(true);

        await onSubmit({

          ...form,

          code:
            form.code.toUpperCase(),

          amount:
            Number(form.amount),
        });

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    };

  /* =====================================================
     FORMAT
  ===================================================== */

  const formatCurrency = (
    value: string
  ) => {

    if (!value) return "0";

    return Number(value)
      .toLocaleString(
        "id-ID"
      );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="max-w-4xl"
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="

        px-8
        py-7

        border-b
        border-slate-200

        bg-[#FCFCFD]

        shrink-0

      ">

        <div className="

          flex
          items-start
          justify-between

        ">

          <div>

            <div className="

              flex
              items-center
              gap-3

              flex-wrap

            ">

              <h2 className="

                text-[40px]

                leading-none

                tracking-tight

                font-bold

                text-[#0F172A]

              ">

                {

                  initialData

                    ? "Edit"

                    : "Tambah"
                }

              </h2>

              <h2 className="
                text-[40px]
                leading-none
                tracking-tight
                font-bold
                text-[#C9AE63]

              ">

                voucher

              </h2>

            </div>

            <p className="

              mt-3

              text-[15px]

              text-slate-500

            ">

              Kelola voucher cashback pelanggan

            </p>

          </div>

          <button

            onClick={onClose}

            className="

              w-14
              h-14

              rounded-2xl

              border
              border-slate-200

              bg-white

              flex
              items-center
              justify-center

              text-slate-500

              hover:bg-slate-100

              transition-all

            "
          >

            <X size={22} />

          </button>

        </div>

      </div>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="

        flex-1

        overflow-y-auto

        px-8
        py-8

        space-y-7

        bg-[#FCFCFD]

      ">

        {/* =====================================================
            INFORMASI
        ===================================================== */}

        <Section title="Informasi Voucher">

          <div className="

            grid
            grid-cols-1
            md:grid-cols-2

            gap-5

          ">

            {/* CODE */}
            <InputField

              label="Kode Voucher"

              icon={
                <TicketPercent
                  size={18}
                />
              }

            >

              <input

                value={form.code}

                onChange={(e) =>
                  setForm({

                    ...form,

                    code:
                      e.target.value.toUpperCase(),
                  })
                }

                placeholder="FLORA10"

                className={inputClass}

              />

            </InputField>

            {/* PELANGGAN */}
            <InputField

              label="Pelanggan"

              icon={
                <User2 size={18} />
              }

            >

              <select

                value={
                  form.pelangganId
                }

                onChange={(e) =>
                  setForm({

                    ...form,

                    pelangganId:
                      e.target.value,
                  })
                }

                className={inputClass}

              >

                <option value="">
                  -- Pilih Pelanggan --
                </option>

                {

                  pelanggan.map(
                    (item) => (

                      <option

                        key={item._id}

                        value={item._id}

                      >

                        {item.nama}

                      </option>
                    )
                  )
                }

              </select>

            </InputField>

            {/* AMOUNT */}
            <InputField

              label="Nominal Voucher"

              icon={
                <Wallet size={18} />
              }

            >

              <input

                type="number"

                value={form.amount}

                onChange={(e) =>
                  setForm({

                    ...form,

                    amount:
                      e.target.value,
                  })
                }

                placeholder="100000"

                className={inputClass}

              />

            </InputField>

            {/* EXPIRED */}
            <InputField

              label="Tanggal Expired"

              icon={
                <CalendarDays
                  size={18}
                />
              }

            >

              <input

                type="date"

                value={
                  form.expiredAt
                }

                onChange={(e) =>
                  setForm({

                    ...form,

                    expiredAt:
                      e.target.value,
                  })
                }

                className={inputClass}

              />

            </InputField>

          </div>

        </Section>

        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <Section title="Ringkasan Voucher">

          <div className="

            rounded-[28px]

            border
            border-emerald-200

            bg-gradient-to-br
            from-emerald-50
            to-white

            p-6

            flex
            items-start
            gap-5

          ">

            <div className="

              w-16
              h-16

              rounded-3xl

              bg-white

              border
              border-emerald-200

              flex
              items-center
              justify-center

              text-emerald-600

              shadow-sm

            ">

              <Sparkles
                size={28}
              />

            </div>

            <div className="
              flex-1
            ">

              <p className="

                text-xs

                font-semibold

                uppercase

                tracking-wider

                text-emerald-600

              ">

                Preview Voucher

              </p>

              <h3 className="

                mt-2

                text-[28px]

                leading-none

                font-bold

                tracking-tight

                text-[#0F172A]

              ">

                {

                  form.code ||

                  "KODE-VOUCHER"
                }

              </h3>

              <div className="

                mt-4

                flex
                flex-wrap

                items-center

                gap-3

              ">

                <div className="

                  h-11

                  px-4

                  rounded-2xl

                  bg-white

                  border
                  border-emerald-200

                  inline-flex
                  items-center

                  text-sm
                  font-semibold

                  text-emerald-700

                ">

                  Rp {

                    formatCurrency(
                      form.amount
                    )
                  }

                </div>

                {

                  form.expiredAt && (

                    <div className="

                      h-11

                      px-4

                      rounded-2xl

                      bg-white

                      border
                      border-slate-200

                      inline-flex
                      items-center

                      text-sm
                      font-medium

                      text-slate-700

                    ">

                      Expired: {

                        new Date(
                          form.expiredAt
                        ).toLocaleDateString(
                          "id-ID"
                        )
                      }

                    </div>
                  )
                }

              </div>

              <p className="

                mt-4

                text-sm

                leading-relaxed

                text-slate-500

              ">

                Voucher cashback akan diberikan
                kepada pelanggan terpilih dan
                otomatis berubah status setelah digunakan.

              </p>

            </div>

          </div>

        </Section>

        {/* LOADING */}
        {

          loadingPelanggan && (

            <div className="

              text-sm

              text-slate-500

            ">

              Loading pelanggan...

            </div>
          )
        }

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="

        shrink-0

        px-8
        py-5

        border-t
        border-slate-200

        bg-white/90

        backdrop-blur-sm

        flex
        items-center
        justify-between

      ">

        <p className="

          text-sm

          text-slate-500

        ">

          {

            initialData

              ? "Perubahan siap disimpan"

              : "Voucher baru akan dibuat"
          }

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
              border-slate-200

              bg-white

              text-slate-700

              text-sm
              font-medium

              hover:bg-slate-100

              transition-all

            "
          >

            Batal

          </button>

          <button

            onClick={handleSubmit}

            disabled={loading}

            className="

              h-12

              px-7

              rounded-2xl

              bg-[#0F172A]

              text-white

              text-sm
              font-semibold

              hover:opacity-90

              transition-all

              disabled:opacity-50

            "
          >

            {

              loading

                ? "Menyimpan..."

                : initialData

                  ? "Simpan Perubahan"

                  : "Tambah Voucher"
            }

          </button>

        </div>

      </div>

    </BaseModal>
  );
}

/* =========================================================
   SECTION
========================================================= */

function Section({

  title,

  children,

}: any) {

  return (

    <div className="

      rounded-[30px]

      border
      border-slate-200

      bg-white

      p-7

      space-y-6

      shadow-sm

    ">

      <h3 className="

        text-[28px]
        font-semibold

        text-[#0F172A]

      ">

        {title}

      </h3>

      {children}

    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({

  label,

  icon,

  children,

}: any) {

  return (

    <div className="space-y-2">

      <label className="

        text-sm
        font-medium

        text-slate-700

      ">

        {label}

      </label>

      <div className="relative">

        {

          icon && (

            <div className="

              absolute
              left-4
              top-1/2
              -translate-y-1/2

              text-slate-400

              z-10

            ">

              {icon}

            </div>
          )
        }

        <div className="

          [&_input]:pl-11
          [&_select]:pl-11

        ">

          {children}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const inputClass = `

  w-full

  h-[58px]

  rounded-2xl

  border
  border-slate-200

  bg-white

  px-4

  text-[15px]

  text-slate-800

  outline-none

  transition-all

  shadow-sm

  placeholder:text-slate-400

  focus:border-slate-400

  focus:ring-4
  focus:ring-slate-100

`;