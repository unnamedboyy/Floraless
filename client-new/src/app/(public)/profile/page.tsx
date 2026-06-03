"use client";

import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import {
  Camera,
  Save,
} from "lucide-react";

import api from "@/lib/axios";

import {
  getProfile,
  getUser,
  setProfile,
} from "@/lib/auth";

export default function ProfilePage() {

  const [profile, setProfileState] =
    useState<any>(null);

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      nama: "",
      no_telp: "",
      email: "",
      profile: "",
    });

  useEffect(() => {

    type ProfileType = {
      nama?: string;
      no_telp?: string;
      email?: string;
      profile?: string;
    };

    const p =
      getProfile() as ProfileType;

    const u =
      getUser();

    setProfileState(p);

    setUser(u);

    setForm({
      nama: p?.nama || "",
      no_telp: p?.no_telp || "",
      email: p?.email || "",
      profile: p?.profile || "",
    });

  }, []);

  const handleUpload =
    async (
      e: any
    ) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

      try {

        const fd =
          new FormData();

        fd.append(
          "image",
          file
        );

        const res =
          await api.post(
            "/upload",
            fd,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        setForm({
          ...form,
          profile:
            res.data.url,
        });

      } catch (err) {

        console.error(err);

        alert(
          "Upload gagal"
        );
      }
    };

  const handleSave =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.put(
            `/pelanggan/${profile._id}`,
            form
          );

        setProfile(
          res.data
        );

        setProfileState(
          res.data
        );

        alert(
          "Profile berhasil diperbarui"
        );

      } catch (err) {

        console.error(err);

        alert(
          "Gagal update profile"
        );

      } finally {

        setLoading(false);
      }
    };

  const avatar =
    form.profile ||
    "/images/profile-default.png";

  return (

    <div className="
      rounded-[32px]
      border
      border-gray-200
      bg-white
      p-10
    ">

      {/* HEADER */}

      <div className="
        border-b
        pb-6
      ">

        <p className="
          text-sm
          uppercase
          tracking-[0.3em]
          text-[#C9AE63]
        ">
          Profile
        </p>

        <h1 className="
          mt-3
          text-4xl
          font-bold
        ">
          Profile Saya
        </h1>

      </div>

      {/* PROFILE PHOTO */}

      <div className="
        mt-8
        flex
        flex-col
        items-center
        gap-5
      ">

        <div className="
          relative
          h-36
          w-36
          overflow-hidden
          rounded-full
          border-4
          border-[#EFE7DA]
        ">

          <Image
            src={avatar}
            alt="Profile"
            fill
            sizes="144px"
            className="object-cover"
          />

        </div>

        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-2
            rounded-2xl
            border
            px-4
            py-2
            text-sm
            font-medium
            hover:bg-gray-50
          "
        >

          <Camera size={16} />

          Upload Foto

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
          />

        </label>

      </div>

      {/* FORM */}

      <div className="
        mt-10
        grid
        gap-6
        md:grid-cols-2
      ">

        <Field
          label="Nama"
          value={form.nama}
          onChange={(v: string) =>
            setForm({
              ...form,
              nama: v,
            })
          }
        />

        <Field
          label="Username"
          value={
            user?.username || "-"
          }
          disabled
        />

        <Field
          label="Nomor Telepon"
          value={form.no_telp}
          onChange={(v: string) =>
            setForm({
              ...form,
              no_telp: v,
            })
          }
        />

        <Field
          label="Email"
          value={form.email}
          onChange={(v: string) =>
            setForm({
              ...form,
              email: v,
            })
          }
        />

      </div>

      {/* ACTION */}

      <div className="
        mt-10
        flex
        justify-end
      ">

        <button
          onClick={handleSave}
          disabled={loading}
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-black
            px-6
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:opacity-90
          "
        >

          <Save size={18} />

          {
            loading
              ? "Menyimpan..."
              : "Simpan Perubahan"
          }

        </button>

      </div>

    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  disabled,
}: any) {

  return (

    <div className="
      space-y-2
    ">

      <p className="
        text-sm
        text-gray-500
      ">
        {label}
      </p>

      <input
        value={value}
        disabled={disabled}
        onChange={(e) =>
          onChange?.(
            e.target.value
          )
        }
        className="
          w-full
          rounded-2xl
          border
          px-4
          py-3
          outline-none
          transition
          focus:border-black
        "
      />

    </div>
  );
}