"use client";

import {
  User2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
  X,
} from "lucide-react";

import BaseModal from "@/components/form/BaseModal";

/* =====================================================
   TYPES
===================================================== */

type Props = {
  open: boolean;
  onClose: () => void;
  data: any;
  title?: string;
};

/* =====================================================
   COMPONENT
===================================================== */

export default function DetailUserModal({

  open,
  onClose,
  data,
  title = "Detail User",

}: Props) {

  if (!open || !data) return null;

  const profileImageUrl =
  data?.profile
    ? (
        data.profile.startsWith("blob:")
          ? data.profile
          : data.profile.startsWith("http")
            ? data.profile
            : `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.profile}`
      )
    : "";

  /* =====================================================
     BADGE
  ===================================================== */

  const badgeClass = (
    active: boolean
  ) =>
    active
      ? `
        bg-emerald-50
        text-emerald-700
        border-emerald-200
      `
      : `
        bg-red-50
        text-red-700
        border-red-200
      `;

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

          <div className="
            space-y-3
          ">

            <div className="
              flex
              items-center
              gap-3
              flex-wrap
            ">

              <h2 className="
                text-[44px]
                leading-none
                tracking-tight
                font-bold
                text-[#0F172A]
              ">
                Detail
              </h2>

              <h2
                className="
                  text-[44px]
                  leading-none
                  tracking-tight
                  font-bold
                  text-[#C9AE63]
                  capitalize
                "
              >
                {data.userId?.role || "user"}
              </h2>

            </div>

            <p className="
              text-[16px]
              text-gray-500
            ">
              Informasi lengkap pengguna
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
          gap-5
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

          {profileImageUrl ? (

            <img
              src={profileImageUrl}
              alt="profile"
              className="
                w-full
                h-full
                object-cover
              "
            />

          ) : (

              <div className="
                w-full h-full
                flex items-center justify-center
                text-gray-400
              ">
                <User2 size={48} />
              </div>

            )}

          </div>

          <div className="
            text-center
            space-y-3
          ">

            <div>

              <h3 className="
                text-[34px]
                leading-tight
                font-bold
                text-[#0F172A]
              ">
                {data.nama || "-"}
              </h3>

              <p className="
                mt-2
                text-[16px]
                text-gray-500
              ">
                {
                  data.email ||
                  data.no_telp ||
                  "-"
                }
              </p>

            </div>

            <div className="
              flex
              items-center
              justify-center
              gap-2
              flex-wrap
            ">

              <span
                className={`
                  px-4 py-2
                  rounded-2xl
                  text-sm
                  border
                  font-medium
                  ${badgeClass(
                    data.userId?.isActive
                  )}
                `}
              >
                {
                  data.userId?.isActive
                    ? "User Aktif"
                    : "User Nonaktif"
                }
              </span>

              <span
                className={`
                  px-4 py-2
                  rounded-2xl
                  text-sm
                  border
                  font-medium
                  ${badgeClass(
                    data.isActive
                  )}
                `}
              >
                {
                  data.isActive
                    ? "Data Aktif"
                    : "Data Nonaktif"
                }
              </span>

            </div>

          </div>

        </div>

        {/* BASIC INFO */}
        <Section title="Informasi Dasar">

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
              label="Username"
              value={
                data.userId?.username
              }
            />

            <Field
              icon={
                <Mail size={18} />
              }
              label="Email"
              value={data.email}
            />

            <Field
              icon={
                <Phone size={18} />
              }
              label="No Telepon"
              value={data.no_telp}
            />

            <Field
              label="Jenis Kelamin"
              value={
                data.jenis_kelamin
              }
            />

          </div>

        </Section>

        {/* PERSONAL */}
        <Section title="Informasi Personal">

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
              label="Tanggal Lahir"
              value={
                data.tanggal_lahir
                  ? new Date(
                      data.tanggal_lahir
                    ).toLocaleDateString(
                      "id-ID"
                    )
                  : "-"
              }
            />

            {
              data.userId?.role ===
                "pegawai" && (

                <Field
                  icon={
                    <Calendar size={18} />
                  }
                  label="Tanggal Masuk"
                  value={
                    data.tanggal_masuk
                      ? new Date(
                          data.tanggal_masuk
                        ).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"
                  }
                />

              )
            }

            <div className="
              md:col-span-2
            ">

              <Field
                icon={
                  <MapPin size={18} />
                }
                label="Alamat"
                value={
                  data.alamat
                }
                multiline
              />

            </div>

            <div className="
              md:col-span-2
            ">

              <Field
                icon={
                  <FileText size={18} />
                }
                label="Bio"
                value={
                  data.bio
                }
                multiline
              />

            </div>

          </div>

        </Section>

        {/* SYSTEM */}
        <Section title="Informasi Sistem">

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          ">

            <Field
              label="Role"
              value={
                data.userId?.role
              }
            />

            <Field
              label="User ID"
              value={
                data.userId?._id
              }
            />

            <Field
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
          Detail informasi pengguna
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
  multiline,
}: {
  label: string;
  value?: any;
  icon?: React.ReactNode;
  multiline?: boolean;
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

      <div
        className={`
          text-[15px]
          font-semibold
          text-[#111827]
          break-words

          ${
            multiline
              ? "leading-7"
              : ""
          }
        `}
      >
        {value || "-"}
      </div>

    </div>
  );
}