"use client";

import Link from "next/link";

import {
  User,
  ShoppingBag,
  CreditCard,
  Gift,
  LogOut,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

import {
  getProfile,
  logout,
} from "@/lib/auth";

export default function ProfileSidebar() {

  const pathname =
    usePathname();

  const profile =
    getProfile();

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
      label: "Pembayaran",
      href: "/profile/payment",
      icon: <CreditCard size={18} />,
    },

    {
      label: "Cashback",
      href: "/profile/cashback",
      icon: <Gift size={18} />,
    },
  ];

  return (

    <aside className="
      rounded-[2rem]
      border
      bg-white
      p-6
      shadow-sm
    ">

      {/* =====================================================
         PROFILE
      ===================================================== */}

      <div className="
        border-b
        pb-6
      ">

        <div className="
          flex
          items-center
          gap-4
        ">

          <div className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-[#C9AE63]
            text-xl
            font-bold
            text-white
          ">

            {
              profile?.nama
                ?.charAt(0)
                ?.toUpperCase() || "P"
            }

          </div>

          <div>

            <h2 className="
              font-semibold
            ">
              {
                profile?.nama ||
                "Pelanggan"
              }
            </h2>

            <p className="
              text-sm
              text-gray-500
            ">
              Customer Floraless
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
         MENUS
      ===================================================== */}

      <div className="
        mt-6
        space-y-2
      ">

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
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    font-medium
                    transition

                    ${
                      active

                        ? `
                          bg-black
                          text-white
                        `

                        : `
                          text-gray-600
                          hover:bg-gray-100
                        `
                    }
                  `}
                >

                  {
                    item.icon
                  }

                  {
                    item.label
                  }

                </Link>
              );
            }
          )
        }

      </div>

      {/* =====================================================
         LOGOUT
      ===================================================== */}

      <button
        onClick={logout}
        className="
          mt-8
          flex
          w-full
          items-center
          gap-3
          rounded-2xl
          bg-red-50
          px-4
          py-3
          text-sm
          font-medium
          text-red-500
          transition
          hover:bg-red-100
        "
      >

        <LogOut size={18} />

        Logout

      </button>

    </aside>
  );
}