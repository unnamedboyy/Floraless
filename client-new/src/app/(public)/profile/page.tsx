"use client";

import {
  getProfile,
  getUser,
} from "@/lib/auth";

export default function ProfilePage() {

  const profile =
    getProfile();

  const user =
    getUser();

  return (

    <div className="
      rounded-[2rem]
      border
      bg-white
      p-8
      shadow-sm
    ">

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

      <div className="
        mt-8
        grid
        gap-8
        md:grid-cols-2
      ">

        <div>

          <p className="
            text-sm
            text-gray-500
          ">
            Nama
          </p>

          <p className="
            mt-2
            text-lg
            font-semibold
          ">
            {
              profile?.nama ||
              "-"
            }
          </p>

        </div>

        <div>

          <p className="
            text-sm
            text-gray-500
          ">
            Username
          </p>

          <p className="
            mt-2
            text-lg
            font-semibold
          ">
            {
              user?.username ||
              "-"
            }
          </p>

        </div>

        <div>

          <p className="
            text-sm
            text-gray-500
          ">
            Nomor Telepon
          </p>

          <p className="
            mt-2
            text-lg
            font-semibold
          ">
            {
              profile?.no_telp ||
              "-"
            }
          </p>

        </div>

        <div>

          <p className="
            text-sm
            text-gray-500
          ">
            Role
          </p>

          <p className="
            mt-2
            text-lg
            font-semibold
          ">
            Customer
          </p>

        </div>

      </div>

    </div>
  );
}