"use client";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  uploadImage,
} from "@/services/upload.service";

import BaseModal from "@/components/form/BaseModal";

import {
  X,
  User2,
  Phone,
  Mail,
  Lock,
  MapPin,
  Calendar,
  FileText,
  Camera,
} from "lucide-react";

/* =====================================================
   TYPES
===================================================== */

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  role: "pegawai" | "pelanggan";
};

/* =====================================================
   COMPONENT
===================================================== */

export default function UserFormModal({

  open,
  onClose,
  onSubmit,
  initialData,
  role,

}: Props) {

  /* =====================================================
     STATE
  ===================================================== */

  const [loading, setLoading] =
    useState(false);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [form, setForm] = useState({

    /* =========================
       AUTH
    ========================= */

    username: "",
    password: "",

    /* =========================
       BASIC
    ========================= */

    nama: "",
    email: "",
    no_telp: "",
    alamat: "",
    profile: "",

    /* =========================
       PERSONAL
    ========================= */

    jenis_kelamin:
      "Laki-laki",

    tanggal_lahir: "",

    tanggal_masuk: "",

    bio: "",
  });

  /* =====================================================
     SET FORM
  ===================================================== */

  useEffect(() => {

    if (initialData) {

      setForm({

        username:
          initialData.userId?.username || "",

        password: "",

        nama:
          initialData.nama || "",

        email:
          initialData.email || "",

        no_telp:
          initialData.no_telp || "",

        alamat:
          initialData.alamat || "",

        profile:
          initialData.profile || "",

        jenis_kelamin:
          initialData.jenis_kelamin ||
          "Laki-laki",

        tanggal_lahir:
          initialData.tanggal_lahir
            ?.split("T")[0] || "",

        tanggal_masuk:
          initialData.tanggal_masuk
            ?.split("T")[0] || "",

        bio:
          initialData.bio || "",
      });

    } else {

      setForm({

        username: "",
        password: "",

        nama: "",
        email: "",
        no_telp: "",
        alamat: "",
        profile: "",

        jenis_kelamin:
          "Laki-laki",

        tanggal_lahir: "",

        tanggal_masuk: "",

        bio: "",
      });
    }

  }, [initialData, open]);

  /* =====================================================
     HANDLE UPLOAD
  ===================================================== */

  const handleUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      try {

        const file =
          e.target.files?.[0];

        if (!file) return;

        /* =========================
           VALIDATION
        ========================= */

        const allowedTypes = [

          "image/jpeg",
          "image/png",
          "image/webp",
          "image/jpg",
        ];

        if (
          !allowedTypes.includes(
            file.type
          )
        ) {

          toast.error(
            "Format gambar tidak didukung"
          );

          return;
        }

        /* =========================
           MAX SIZE
        ========================= */

        if (
          file.size >
          5 * 1024 * 1024
        ) {

          toast.error(
            "Ukuran gambar maksimal 5MB"
          );

          return;
        }

        /* =========================
           LOADING
        ========================= */

        setUploading(true);

        /* =========================
           UPLOAD
        ========================= */

        const res =
          await uploadImage(
            file,
            "profile"
          );

        /* =========================
           SAVE URL
        ========================= */

        setForm((prev) => ({

          ...prev,

          profile: res.url,
        }));

        toast.success(
          "Foto berhasil diupload"
        );

      } catch (err) {

        console.error(
          "UPLOAD ERROR:",
          err
        );

        toast.error(
          "Gagal upload foto"
        );

      } finally {

        setUploading(false);

      }
    };

  /* =====================================================
     REMOVE PHOTO
  ===================================================== */

  const removePhoto = () => {

    setForm((prev) => ({

      ...prev,

      profile: "",
    }));
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit =
    async () => {

      try {

        setLoading(true);

        const payload: any = {

          username:
            form.username,

          nama:
            form.nama,

          email:
            form.email,

          no_telp:
            form.no_telp,

          alamat:
            form.alamat,

          profile:
            form.profile,

          jenis_kelamin:
            form.jenis_kelamin,

          tanggal_lahir:
            form.tanggal_lahir,

          tanggal_masuk:
            form.tanggal_masuk,

          bio:
            form.bio,

          role,
        };

        if (!initialData) {

          payload.password =
            form.password;
        }

        await onSubmit(payload);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

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
        px-10
        py-7
        border-b
        border-gray-200
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

                {
                  initialData
                    ? "Edit"
                    : "Tambah"
                }

              </h2>

              <h2 className="
                text-[44px]
                leading-none
                tracking-tight
                font-bold
                text-[#C9AE63]
                capitalize
              ">
                {role}
              </h2>

              {
                !initialData && (

                  <h2 className="
                    text-[44px]
                    leading-none
                    tracking-tight
                    font-bold
                    text-[#0F172A]
                  ">
                    baru
                  </h2>

                )
              }

            </div>

            <p className="
              mt-3
              text-[16px]
              text-gray-500
            ">
              Kelola informasi pengguna
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

        {/* PROFILE */}
        <div className="
          flex
          flex-col
          items-center
          justify-center
          gap-4
        ">

          <div className="
            relative
            w-32 h-32
            rounded-full
            overflow-hidden
            border-[6px]
            border-white
            shadow-[0_8px_30px_rgba(15,23,42,0.08)]
            bg-gray-100
          ">

            {form.profile ? (

              <img
                src={form.profile}
                alt="profile"
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            ) : (

              <div className="
                w-full
                h-full
                flex
                items-center
                justify-center
                text-gray-400
              ">
                <User2 size={46} />
              </div>

            )}

          </div>

          <div className="
            flex
            items-center
            gap-3
          ">

            <label
              className="
                h-11
                px-5
                rounded-2xl
                border
                border-gray-200
                bg-white
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-gray-700
                hover:bg-gray-50
                transition-all
                cursor-pointer
              "
            >

              <Camera size={16} />

              {
                uploading
                  ? "Uploading..."
                  : form.profile
                    ? "Ganti Foto"
                    : "Upload Foto"
              }

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleUpload}
              />

            </label>

            {form.profile && (

              <button
                type="button"
                onClick={removePhoto}
                className="
                  h-11
                  px-5
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  text-red-600
                  text-sm
                  font-medium
                  hover:bg-red-100
                  transition-all
                "
              >
                Hapus
              </button>

            )}

          </div>

        </div>

        {/* BASIC */}
        <Section title="Informasi Dasar">

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">

            <InputField
              label="Nama Lengkap"
              icon={<User2 size={18} />}
            >
              <input
                value={form.nama}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama: e.target.value,
                  })
                }
                placeholder="Masukkan nama lengkap"
                className={inputClass}
              />
            </InputField>

            <InputField
              label="Username"
              icon={<User2 size={18} />}
            >
              <input
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
                placeholder="Masukkan username"
                className={inputClass}
              />
            </InputField>

            {!initialData && (

              <InputField
                label="Password"
                icon={<Lock size={18} />}
              >
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password:
                        e.target.value,
                    })
                  }
                  placeholder="Masukkan password"
                  className={inputClass}
                />
              </InputField>

            )}

            <InputField
              label="Email"
              icon={<Mail size={18} />}
            >
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="email@gmail.com"
                className={inputClass}
              />
            </InputField>

            <InputField
              label="No Telepon"
              icon={<Phone size={18} />}
            >
              <input
                value={form.no_telp}
                onChange={(e) =>
                  setForm({
                    ...form,
                    no_telp:
                      e.target.value,
                  })
                }
                placeholder="08xxxxxxxxxx"
                className={inputClass}
              />
            </InputField>

            <InputField
              label="Jenis Kelamin"
            >
              <select
                value={
                  form.jenis_kelamin
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    jenis_kelamin:
                      e.target.value,
                  })
                }
                className={inputClass}
              >
                <option>
                  Laki-laki
                </option>

                <option>
                  Perempuan
                </option>
              </select>
            </InputField>

          </div>

        </Section>

        {/* PERSONAL */}
        <Section title="Informasi Lainnya">

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">

            <InputField
              label="Tanggal Lahir"
              icon={<Calendar size={18} />}
            >
              <input
                type="date"
                value={form.tanggal_lahir}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tanggal_lahir:
                      e.target.value,
                  })
                }
                className={inputClass}
              />
            </InputField>

            {role === "pegawai" && (

              <InputField
                label="Tanggal Masuk"
                icon={<Calendar size={18} />}
              >
                <input
                  type="date"
                  value={
                    form.tanggal_masuk
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tanggal_masuk:
                        e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </InputField>

            )}

            <div className="
              md:col-span-2
            ">

              <InputField
                label="Alamat"
                icon={<MapPin size={18} />}
                textarea
              >
                <textarea
                  value={form.alamat}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      alamat:
                        e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Masukkan alamat lengkap"
                  className={textareaClass}
                />
              </InputField>

            </div>

            <div className="
              md:col-span-2
            ">

              <InputField
                label="Bio"
                icon={<FileText size={18} />}
                textarea
              >
                <textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bio:
                        e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Tambahkan bio"
                  className={textareaClass}
                />
              </InputField>

            </div>

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
          {
            initialData
              ? "Perubahan siap disimpan"
              : "Data baru akan ditambahkan"
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
              border-gray-200
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
            onClick={handleSubmit}
            disabled={
              loading ||
              uploading
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
            "
          >
            {
              loading
                ? "Menyimpan..."
                : "Simpan"
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
        text-[30px]
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

      <label className="
        text-sm
        font-medium
        text-gray-700
      ">
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

        <div className="
          [&_input]:pl-11
          [&_textarea]:pl-11
          [&_select]:pl-11
        ">
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