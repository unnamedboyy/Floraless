"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {

  const [role, setRole] = useState("");

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) return;

    try {

      const decoded: any = JSON.parse(
        atob(token.split(".")[1])
      );

      setRole(decoded.role);

    } catch (err) {

      console.error("Decode token gagal:", err);

    }

  }, []);

  // ADMIN & PEGAWAI TIDAK PAKAI FOOTER LANDING
  if (role === "admin" || role === "pegawai") {
    return null;
  }

  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-[#0C0908]
        text-white
      "
    >

      {/* TOP LINE */}
      <div
        className="
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
        "
      />

      {/* CONTENT */}
      <div
        className="
          mx-auto
          max-w-7xl
          px-6
          py-24
        "
      >

        <div
          className="
            grid
            gap-16
            lg:grid-cols-12
          "
        >

          {/* BRAND */}
          <div className="lg:col-span-5">

            <p
              className="
                text-sm
                tracking-[0.45em]
                text-[#D4B36A]
              "
            >
              FLORALESS
            </p>

            <h2
              className="
                mt-6
                max-w-md
                text-4xl
                font-semibold
                leading-tight
                tracking-tight
                text-white
              "
            >
              Dekorasi Elegan
              Untuk Momen
              Yang Tak
              Terlupakan.
            </h2>

            <p
              className="
                mt-8
                max-w-md
                leading-relaxed
                text-white/65
              "
            >
              Floraless menghadirkan layanan dekorasi modern,
              hangat, dan profesional untuk wedding,
              engagement, birthday, dan berbagai acara spesial.
            </p>

          </div>

          {/* MENU */}
          <div className="lg:col-span-2">

            <h3
              className="
                text-sm
                font-semibold
                tracking-[0.25em]
                text-[#D4B36A]
              "
            >
              MENU
            </h3>

            <div
              className="
                mt-8
                space-y-4
              "
            >

              {[
                {
                  name: "Beranda",
                  href: "/",
                },
                {
                  name: "Tentang",
                  href: "/tentang",
                },
                {
                  name: "Galeri",
                  href: "/gallery",
                },
                {
                  name: "Layanan",
                  href: "/layanan",
                },
                {
                  name: "Kontak",
                  href: "/kontak",
                },
              ].map((item) => (

                <Link
                  key={item.name}
                  href={item.href}
                  className="
                    block
                    text-white/65
                    transition
                    hover:translate-x-1
                    hover:text-white
                  "
                >
                  {item.name}
                </Link>

              ))}

            </div>

          </div>

          {/* SERVICES */}
          <div className="lg:col-span-2">

            <h3
              className="
                text-sm
                font-semibold
                tracking-[0.25em]
                text-[#D4B36A]
              "
            >
              SERVICES
            </h3>

            <div
              className="
                mt-8
                space-y-4
                text-white/65
              "
            >

              <p>Wedding Decoration</p>
              <p>Engagement Setup</p>
              <p>Birthday Event</p>
              <p>Church Decoration</p>
              <p>Consultation</p>

            </div>

          </div>

          {/* CONTACT */}
          <div className="lg:col-span-3">

            <h3
              className="
                text-sm
                font-semibold
                tracking-[0.25em]
                text-[#D4B36A]
              "
            >
              CONTACT
            </h3>

            <div
              className="
                mt-8
                space-y-6
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    tracking-[0.2em]
                    text-white/35
                  "
                >
                  EMAIL
                </p>

                <p
                  className="
                    mt-2
                    text-white/75
                  "
                >
                  support@floraless.com
                </p>

              </div>

              <div>

                <p
                  className="
                    text-xs
                    tracking-[0.2em]
                    text-white/35
                  "
                >
                  WHATSAPP
                </p>

                <p
                  className="
                    mt-2
                    text-white/75
                  "
                >
                  +62 812-3456-7890
                </p>

              </div>

              <div>

                <p
                  className="
                    text-xs
                    tracking-[0.2em]
                    text-white/35
                  "
                >
                  LOCATION
                </p>

                <p
                  className="
                    mt-2
                    text-white/75
                  "
                >
                  Babarsari, Yogyakarta
                </p>

              </div>

            </div>

            {/* CTA */}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-10
                inline-flex
                items-center
                justify-center
                rounded-full
                bg-[#D4B36A]
                px-7
                py-4
                text-sm
                font-medium
                text-black
                transition
                hover:scale-[1.02]
              "
            >
              Chat via WhatsApp
            </a>

          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div
        className="
          border-t
          border-white/10
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            items-center
            justify-between
            gap-4
            px-6
            py-6
            text-sm
            text-white/45
            md:flex-row
          "
        >

          <p>
            © 2026 Floraless. All rights reserved.
          </p>

          <div
            className="
              flex
              items-center
              gap-6
            "
          >

            <Link
              href="/login"
              className="hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="hover:text-white"
            >
              Register
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}