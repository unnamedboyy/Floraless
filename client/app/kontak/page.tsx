"use client";

import Image from "next/image";
import { InstagramIcon, Music2 } from "lucide-react";

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <main>

        {/* HERO */}
        <section className="relative h-[520px] w-full overflow-hidden">
          <Image
            src="/about.jpg"
            alt="Contact Floraless"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight tracking-tight">
              Let’s Create Something <br className="hidden md:block" />
              Beautiful Together
            </h1>
          </div>
        </section>

        {/* CONTENT */}
        <section className="relative pb-28">
          <div className="mx-auto max-w-7xl px-6 -mt-32 grid gap-14 md:grid-cols-12">

            {/* FORM CARD */}
            <div className="md:col-span-6 h-full flex">
              <div className="rounded-3xl bg-white p-14 shadow-2xl border border-neutral-200 w-full h-full flex flex-col items-center justify-center">
                <h3 className="text-2xl font-semibold text-center">
                  Leave Your Message
                </h3>

                {/* <form className="mt-10 space-y-6">

                  <input
                    className="w-full rounded-xl border border-neutral-200 px-5 py-4 text-base outline-none focus:ring-2 focus:ring-[#C9AE63]/40 transition"
                    placeholder="Subject"
                  />

                  <input
                    className="w-full rounded-xl border border-neutral-200 px-5 py-4 text-base outline-none focus:ring-2 focus:ring-[#C9AE63]/40 transition"
                    placeholder="Your Email"
                  />

                  <textarea
                    className="min-h-[160px] w-full rounded-xl border border-neutral-200 px-5 py-4 text-base outline-none focus:ring-2 focus:ring-[#C9AE63]/40 transition"
                    placeholder="Tell us about your event..."
                  />

                  <button
                    type="button"
                    className="w-full rounded-xl bg-[#C9AE63] px-6 py-5 text-base font-semibold text-white transition hover:opacity-90"
                  >
                    Send Message
                  </button>

                </form> */}
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="md:col-span-6">

              <div className="mb-10">
                <br /> <br /><br /><br /> <br />
              </div>

              {/* Heading */}
              <div className="mb-10">

                <h2 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight text-black">
                  Don’t hesitate to <br className="hidden md:block" />
                  contact us
                </h2>
              </div>

              {/* Contact Cards */}
              <div className="mt-8 grid gap-5 md:grid-cols-2">

                <div className="rounded-2xl bg-neutral-100 p-8 shadow-sm transition hover:shadow-md">
                  <h4 className="text-lg font-semibold">Office</h4>
                  <p className="mt-3 text-base text-neutral-600">
                    Yogyakarta, Indonesia
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-100 p-8 shadow-sm transition hover:shadow-md">
                  <h4 className="text-lg font-semibold">Phone</h4>
                  <p className="mt-3 text-base text-neutral-600">
                    +62 812-3456-7890
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-100 p-8 shadow-sm transition hover:shadow-md">
                  <h4 className="text-lg font-semibold">Work Hours</h4>
                  <p className="mt-3 text-base text-neutral-600">
                    Everyday 09:00 – 19:00
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-100 p-8 shadow-sm transition hover:shadow-md">
                  <h4 className="text-lg font-semibold">Email</h4>
                  <p className="mt-3 text-base text-neutral-600">
                    hello@floraless.id
                  </p>
                </div>

              </div>

              {/* SOCIAL */}
              <div className="mt-14">
                <p className="text-sm text-neutral-500 uppercase tracking-widest">
                  Social Media
                </p>

                <div className="mt-6 flex gap-5">
                  <a
                    href="https://instagram.com/floraless_/"
                    target="_blank"
                    className="h-12 w-12 rounded-full border border-neutral-200 flex items-center justify-center text-[#C9AE63] transition hover:bg-[#C9AE63] hover:text-white hover:scale-105"
                  >
                    <InstagramIcon size={22} />
                  </a>

                  <a
                    href="https://www.tiktok.com/@floraless_?_r=1&_t=ZS-94Jy70HXgm4"
                    target="_blank"
                    className="h-12 w-12 rounded-full border border-neutral-200 flex items-center justify-center text-[#C9AE63] transition hover:bg-[#C9AE63] hover:text-white hover:scale-105"
                  >
                    <Music2 size={22} />
                  </a>

                </div>
              </div>

            </div>

          </div>
        </section>

      </main>
    </div>
  );
}