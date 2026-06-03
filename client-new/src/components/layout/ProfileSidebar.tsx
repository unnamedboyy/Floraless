"use client";

import Link from "next/link";

import Image from "next/image";

import {
  User,
  ShoppingBag,
  Gift,
  LogOut,
  ChevronRight,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  getProfile,
  logout,
} from "@/lib/auth";

export default function ProfileSidebar() {

  const pathname =
    usePathname();

  const [mounted, setMounted] =
    useState(false);

  const [profile, setProfile] =
    useState<any>(null);

  useEffect(() => {

    setMounted(true);

    const data =
      getProfile();

    setProfile(data);

  }, []);

  const menus = [

    {
      label: "Profile Saya",
      href: "/profile",
      icon: <User size={18} />,
    },

    {
      label: "Pesanan Saya",
      href: "/profile/orders",
      icon: <ShoppingBag size={18} />,
    },

    {
      label: "Cashback",
      href: "/profile/cashback",
      icon: <Gift size={18} />,
    },
  ];

  if (!mounted) return null;

  const avatar =
    profile?.profile &&
    profile.profile !== ""
      ? profile.profile
      : "/images/profile-default.png";

  return (

    <aside
      className="
        xl:sticky
        xl:top-6
        h-fit
      "
    >

      {/* ==========================================
         PROFILE
      ========================================== */}

      <div
        className="
          pb-8
          border-b
          border-gray-200
        "
      >

        <div
          className="
            flex
            items-center
            gap-5
          "
        >

          <div
            className="
              relative

              h-20
              w-20

              overflow-hidden

              rounded-full

              border
              border-gray-200
            "
          >

            <Image
              src={avatar}
              alt="Profile"
              fill
              className="object-cover"
            />

          </div>

          <div>

            <p
              className="
                text-xs
                uppercase
                tracking-[0.25em]
                text-[#C9AE63]
              "
            >
              Customer
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-bold
                tracking-tight
                text-[#111827]
              "
            >

              {
                profile?.nama ||
                "Pelanggan"
              }

            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Floraless Client
            </p>

          </div>

        </div>

      </div>

      {/* ==========================================
         MENU
      ========================================== */}

      <div
        className="
          mt-8
        "
      >

        <div
          className="
            space-y-1
          "
        >

          {
            menus.map(
              (item) => {

                const active =
                  pathname ===
                  item.href;

                return (

                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group

                      flex
                      items-center
                      justify-between

                      py-4

                      border-b
                      border-gray-100

                      transition-all

                      ${
                        active

                          ? `
                            text-[#111827]
                          `

                          : `
                            text-gray-500
                            hover:text-[#111827]
                          `
                      }
                    `}
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className={`
                          transition

                          ${
                            active

                              ? `
                                text-[#111827]
                              `

                              : `
                                text-gray-400
                                group-hover:text-[#111827]
                              `
                          }
                        `}
                      >

                        {item.icon}

                      </div>

                      <span
                        className={`
                          text-sm

                          ${
                            active

                              ? `
                                font-semibold
                              `

                              : `
                                font-medium
                              `
                          }
                        `}
                      >

                        {item.label}

                      </span>

                    </div>

                    <ChevronRight
                      size={16}
                      className="
                        text-gray-300

                        transition

                        group-hover:translate-x-1
                      "
                    />

                  </Link>

                );
              }
            )
          }

        </div>

      </div>

      {/* ==========================================
         LOGOUT
      ========================================== */}

      <button

        onClick={logout}

        className="
          mt-10

          flex
          items-center
          gap-3

          text-sm
          font-medium

          text-red-500

          transition

          hover:text-red-600
        "
      >

        <LogOut size={18} />

        Logout

      </button>

    </aside>
  );
}