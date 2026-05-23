"use client";

import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";

import {
  getProfile,
  getUser,
  isAuthenticated,
  logout,
} from "@/lib/auth";

export default function Navbar() {

  const [scrolled, setScrolled] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [dropdownOpen,
    setDropdownOpen] =
    useState(false);

  const [user, setUser] =
    useState<any>(null);

  const [profile,
    setProfile] =
    useState<any>(null);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  /* =========================================================
     SCROLL EFFECT
  ========================================================= */

  useEffect(() => {

    const handleScroll =
      () => {

        setScrolled(
          window.scrollY > 60
        );
      };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  /* =========================================================
     LOAD AUTH STATE
  ========================================================= */

  useEffect(() => {

    if (
      isAuthenticated()
    ) {

      setUser(
        getUser()
      );

      setProfile(
        getProfile()
      );
    }

  }, []);

  /* =========================================================
     OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {

    const handleClickOutside =
      (
        event: MouseEvent
      ) => {

        if (

          dropdownRef.current &&

          !dropdownRef.current.contains(
            event.target as Node
          )

        ) {

          setDropdownOpen(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  /* =========================================================
     MENU
  ========================================================= */

  const menu = [
    ["Beranda", "/"],
    ["Tentang", "/tentang"],
    ["Galeri", "/gallery"],
    ["Layanan", "/layanan"],
    ["Kontak", "/kontak"],
  ];

  /* =========================================================
     CUSTOMER MENU
  ========================================================= */

  const customerMenu = [
    {
      label: "Pesanan Saya",
      href: "/profile/orders",
      icon: (
        <ShoppingBag size={16} />
      ),
    },
    {
      label: "Profile Saya",
      href: "/profile",
      icon: (
        <User size={16} />
      ),
    },
  ];

  /* =========================================================
     DASHBOARD URL
  ========================================================= */

  const dashboardUrl =
    user?.role === "admin"

      ? "/admin/dashboard"

      : user?.role === "pegawai"

        ? "/pegawai/dashboard"

        : null;

  return (

    <header className="
      fixed
      inset-x-0
      top-0
      z-50
      px-4
      pt-4
    ">

      <div
        className={`
          mx-auto
          max-w-7xl
          rounded-full
          border
          transition-all
          duration-500

          ${
            scrolled

              ? `
                border-white/10
                bg-black/40
                backdrop-blur-2xl
              `

              : `
                border-transparent
                bg-transparent
              `
          }
        `}
      >

        <div className="
          flex
          items-center
          justify-between
          px-6
          py-4
        ">

          {/* =================================================
             LOGO
          ================================================= */}

          <Link
            href="/"
            className="
              text-sm
              font-semibold
              tracking-[0.4em]
              text-white
            "
          >
            FLORALESS
          </Link>

          {/* =================================================
             DESKTOP MENU
          ================================================= */}

          <nav className="
            hidden
            items-center
            gap-8
            text-sm
            text-white/80
            lg:flex
          ">

            {
              menu.map(
                ([name, href]) => (

                  <a
                    key={name}
                    href={href}
                    className="
                      transition
                      hover:text-white
                    "
                  >
                    {name}
                  </a>
                )
              )
            }

          </nav>

          {/* =================================================
             RIGHT SECTION
          ================================================= */}

          <div className="
            hidden
            items-center
            gap-3
            lg:flex
          ">

            {/* =============================================
               GUEST
            ============================================= */}

            {
              !user && (

                <>

                  <Link
                    href="/login"
                    className="
                      rounded-full
                      border
                      border-white/20
                      px-5
                      py-2
                      text-sm
                      text-white
                      transition
                      hover:bg-white/10
                    "
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="
                      rounded-full
                      bg-[#C9AE63]
                      px-5
                      py-2
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:opacity-90
                    "
                  >
                    Register
                  </Link>

                </>
              )
            }

            {/* =============================================
               CUSTOMER
            ============================================= */}

            {
              user?.role ===
              "pelanggan" && (

                <>

                  <Link
                    href="/booking"
                    className="
                      rounded-full
                      bg-[#C9AE63]
                      px-5
                      py-2
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:opacity-90
                    "
                  >
                    Pesan Sekarang
                  </Link>

                  <div
                    ref={dropdownRef}
                    className="
                      relative
                    "
                  >

                    <button
                      onClick={() =>
                        setDropdownOpen(
                          !dropdownOpen
                        )
                      }
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-full
                        border
                        border-white/20
                        px-4
                        py-2
                        text-white
                        transition
                        hover:bg-white/10
                      "
                    >

                      <div className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-[#C9AE63]
                        text-sm
                        font-semibold
                        text-white
                      ">

                        {
                          profile?.nama
                            ?.charAt(0)
                            ?.toUpperCase() ||

                          "P"
                        }

                      </div>

                      <div className="
                        text-left
                      ">

                        <p className="
                          text-sm
                          font-medium
                          leading-none
                        ">
                          {
                            profile?.nama ||
                            "Pelanggan"
                          }
                        </p>

                        <p className="
                          mt-1
                          text-xs
                          text-white/60
                        ">
                          Customer
                        </p>

                      </div>

                      <ChevronDown
                        size={16}
                      />

                    </button>

                    {
                      dropdownOpen && (

                        <div className="
                          absolute
                          right-0
                          top-[120%]
                          w-64
                          overflow-hidden
                          rounded-3xl
                          border
                          border-white/10
                          bg-black/90
                          p-3
                          shadow-2xl
                          backdrop-blur-2xl
                        ">

                          <div className="
                            border-b
                            border-white/10
                            px-3
                            pb-4
                          ">

                            <p className="
                              text-sm
                              font-semibold
                              text-white
                            ">
                              {
                                profile?.nama ||
                                "Pelanggan"
                              }
                            </p>

                            <p className="
                              mt-1
                              text-xs
                              text-white/50
                            ">
                              {
                                user?.username
                              }
                            </p>

                          </div>

                          <div className="
                            mt-2
                            flex
                            flex-col
                          ">

                            {
                              customerMenu.map(
                                (
                                  item
                                ) => (

                                  <Link
                                    key={
                                      item.href
                                    }
                                    href={
                                      item.href
                                    }
                                    className="
                                      flex
                                      items-center
                                      gap-3
                                      rounded-2xl
                                      px-4
                                      py-3
                                      text-sm
                                      text-white/80
                                      transition
                                      hover:bg-white/10
                                      hover:text-white
                                    "
                                  >

                                    {
                                      item.icon
                                    }

                                    {
                                      item.label
                                    }

                                  </Link>
                                )
                              )
                            }

                            <button
                              onClick={
                                logout
                              }
                              className="
                                mt-2
                                flex
                                items-center
                                gap-3
                                rounded-2xl
                                px-4
                                py-3
                                text-left
                                text-sm
                                text-red-400
                                transition
                                hover:bg-red-500/10
                              "
                            >

                              <LogOut
                                size={16}
                              />

                              Logout

                            </button>

                          </div>

                        </div>
                      )
                    }

                  </div>

                </>
              )
            }

            {/* =============================================
               ADMIN / PEGAWAI
            ============================================= */}

            {
              (
                user?.role ===
                "admin" ||

                user?.role ===
                "pegawai"
              ) && (

                <>

                  <Link
                    href={
                      dashboardUrl ||
                      "/"
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-white/20
                      px-5
                      py-2
                      text-sm
                      text-white
                      transition
                      hover:bg-white/10
                    "
                  >

                    <LayoutDashboard
                      size={16}
                    />

                    Dashboard

                  </Link>

                  <button
                    onClick={logout}
                    className="
                      rounded-full
                      bg-red-500
                      px-5
                      py-2
                      text-sm
                      text-white
                      transition
                      hover:bg-red-600
                    "
                  >
                    Logout
                  </button>

                </>
              )
            }

          </div>

          {/* =================================================
             MOBILE BUTTON
          ================================================= */}

          <button
            onClick={() =>
              setOpen(!open)
            }
            className="
              text-white
              lg:hidden
            "
          >

            {
              open
                ? <X />
                : <Menu />
            }

          </button>

        </div>

      </div>

      {/* =====================================================
         MOBILE MENU
      ===================================================== */}

      {
        open && (

          <div className="
            mt-3
            rounded-3xl
            border
            border-white/10
            bg-black/70
            p-6
            text-white
            backdrop-blur-2xl
            lg:hidden
          ">

            <div className="
              flex
              flex-col
              gap-5
            ">

              {
                menu.map(
                  ([name, href]) => (

                    <a
                      key={name}
                      href={href}
                      onClick={() =>
                        setOpen(
                          false
                        )
                      }
                      className="
                        text-sm
                        text-white/80
                        hover:text-white
                      "
                    >
                      {name}
                    </a>
                  )
                )
              }

              {/* =========================================
                 GUEST
              ========================================= */}

              {
                !user && (

                  <>

                    <Link href="/login">
                      Login
                    </Link>

                    <Link href="/register">
                      Register
                    </Link>

                  </>
                )
              }

              {/* =========================================
                 CUSTOMER
              ========================================= */}

              {
                user?.role ===
                "pelanggan" && (

                  <>

                    <Link
                      href="/booking"
                    >
                      Pemesanan
                    </Link>

                    <Link
                      href="/profile"
                    >
                      Profile Saya
                    </Link>

                    <Link
                      href="/profile/pesanan"
                    >
                      Pesanan Saya
                    </Link>

                    <button
                      onClick={logout}
                      className="
                        text-left
                        text-red-400
                      "
                    >
                      Logout
                    </button>

                  </>
                )
              }

              {/* =========================================
                 ADMIN / PEGAWAI
              ========================================= */}

              {
                (
                  user?.role ===
                  "admin" ||

                  user?.role ===
                  "pegawai"
                ) && (

                  <>

                    <Link
                      href={
                        dashboardUrl ||
                        "/"
                      }
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={logout}
                      className="
                        text-left
                        text-red-400
                      "
                    >
                      Logout
                    </button>

                  </>
                )
              }

            </div>

          </div>
        )
      }

    </header>
  );
}