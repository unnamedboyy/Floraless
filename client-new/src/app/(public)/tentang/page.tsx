"use client";

import Image from "next/image";
import Link from "next/link";

export default function TentangPage() {
  return (
    <main className="bg-white text-[#18181B] overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative h-[520px] overflow-hidden">

        <Image
          src="/hero.jpg"
          alt="Tentang Floraless"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">

          <div>

            <p className="text-sm tracking-[0.3em] text-[#C9AE63]">
              ABOUT US
            </p>

            <h1 className="
              mt-5
              text-5xl
              font-bold
              text-white
              md:text-7xl
            ">
              Tentang Kami
            </h1>

            <div className="
              mt-6
              flex
              items-center
              justify-center
              gap-3
              text-sm
              text-white/80
            ">

              <Link href="/">
                Home
              </Link>

              <span>/</span>

              <span>Tentang</span>

            </div>

          </div>

        </div>

      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-16 lg:grid-cols-2 items-center">

            {/* IMAGE */}
            <div className="relative">

              <div className="
                relative
                h-[500px]
                overflow-hidden
                rounded-[30px]
              ">

                <Image
                  src="/gal-1.jpg"
                  alt="Floraless"
                  fill
                  className="object-cover"
                />

              </div>

            </div>

            {/* CONTENT */}
            <div>

              <p className="text-sm tracking-[0.3em] text-[#C9AE63]">
                ABOUT FLORALESS
              </p>

              <h2 className="
                mt-5
                text-4xl
                font-bold
                leading-tight
                md:text-5xl
              ">
                Kami Selalu
                <br />
                Menghadirkan
                <br />
                Dekorasi Terbaik
              </h2>

              <p className="
                mt-8
                leading-relaxed
                text-neutral-600
              ">
                Floraless hadir untuk membantu menciptakan
                momen yang elegan, hangat, dan penuh cerita
                melalui dekorasi modern dengan sentuhan
                artistik premium.
              </p>

              <p className="
                mt-5
                leading-relaxed
                text-neutral-600
              ">
                Kami percaya setiap acara memiliki makna
                spesial. Karena itu setiap detail kami
                rancang dengan penuh perhatian agar
                pengalaman acara menjadi lebih berkesan.
              </p>

              <Link
                href="/booking"
                className="
                  mt-10
                  inline-flex
                  rounded-full
                  bg-black
                  px-7
                  py-4
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                "
              >
                Booking Sekarang
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}
      <section className="pb-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                value: "4+",
                label: "Tahun Pengalaman",
              },
              {
                value: "500+",
                label: "Acara Selesai",
              },
              {
                value: "300+",
                label: "Klien Puas",
              },
              {
                value: "24/7",
                label: "Support Konsultasi",
              },
            ].map((item) => (

              <div
                key={item.label}
                className="
                  rounded-[28px]
                  border
                  border-neutral-200
                  bg-[#FAFAFA]
                  p-10
                  text-center
                "
              >

                <h3 className="
                  text-5xl
                  font-bold
                  text-[#C9AE63]
                ">
                  {item.value}
                </h3>

                <p className="
                  mt-4
                  text-neutral-600
                ">
                  {item.label}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= SERVICES ================= */}
      <section className="pb-28">

        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-8 lg:grid-cols-3">

            {[
              {
                title: "Wedding Decoration",
                image: "/gal-1.jpg",
              },
              {
                title: "Engagement Decoration",
                image: "/gal-2.jpg",
              },
              {
                title: "Birthday & Event",
                image: "/gal-3.jpg",
              },
            ].map((item) => (

              <div
                key={item.title}
                className="
                  overflow-hidden
                  rounded-[30px]
                  bg-white
                  shadow-sm
                "
              >

                <div className="
                  relative
                  h-[280px]
                ">

                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />

                </div>

                <div className="p-8">

                  <h3 className="
                    text-2xl
                    font-bold
                  ">
                    {item.title}
                  </h3>

                  <p className="
                    mt-4
                    leading-relaxed
                    text-neutral-600
                  ">
                    Dekorasi elegan dengan konsep modern
                    dan detail premium sesuai kebutuhan acara.
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

        {/* ================= FOUNDER QUOTE + FOTO ================= */}
        {/* <section className="pb-32 pt-10">

        <div className="mx-auto max-w-7xl px-6">

            <div className="
            overflow-hidden
            rounded-[40px]
            bg-[#FAF7F2]
            ">

            <div className="grid items-center lg:grid-cols-2">

                <div className="relative h-[500px] lg:h-[650px]">

                <Image
                    src="/founder.jpg"
                    alt="Founder Floraless"
                    fill
                    className="object-cover"
                />

                </div>

                <div className="px-8 py-16 md:px-16 lg:px-20">

                <p className="
                    text-sm
                    tracking-[0.35em]
                    text-[#C9AE63]
                ">
                    FOUNDER MESSAGE
                </p>

                <h2 className="
                    mt-6
                    text-4xl
                    font-bold
                    leading-tight
                    text-[#18181B]
                    md:text-5xl
                ">
                    “Dekorasi bukan
                    hanya tentang
                    keindahan,
                    tetapi tentang
                    menciptakan
                    kenangan.”
                </h2>

                <p className="
                    mt-8
                    text-lg
                    leading-relaxed
                    text-neutral-600
                ">
                    Floraless dibangun dengan keyakinan bahwa
                    setiap momen spesial layak dirayakan dengan
                    detail yang elegan dan penuh makna.
                </p>

                <p className="
                    mt-5
                    text-lg
                    leading-relaxed
                    text-neutral-600
                ">
                    Kami ingin setiap pasangan dan keluarga
                    dapat merasakan pengalaman dekorasi yang
                    hangat, modern, profesional, dan berkesan
                    sepanjang hidup mereka.
                </p>

                <div className="mt-10">

                    <h3 className="
                    text-xl
                    font-semibold
                    text-[#18181B]
                    ">
                    Floraless Founder
                    </h3>

                    <p className="
                    mt-2
                    text-neutral-500
                    ">
                    Creative Director & Founder
                    </p>

                </div>

                </div>

            </div>

            </div>

        </div>

        </section> */}


        {/* ================= FOUNDER QUOTE ================= */}
        <section className="pb-32 pt-10">

        <div className="mx-auto max-w-5xl px-6">

            <div className="
            relative
            overflow-hidden
            rounded-[40px]
            border
            border-[#E9E3D8]
            bg-[#FAF7F2]
            px-8
            py-16
            text-center
            shadow-[0_20px_60px_rgba(0,0,0,0.04)]
            md:px-20
            md:py-24
            ">

            {/* DECORATION */}
            <div className="
                absolute
                -top-24
                -left-24
                h-56
                w-56
                rounded-full
                bg-[#C9AE63]/10
                blur-3xl
            " />

            <div className="
                absolute
                -bottom-24
                -right-24
                h-56
                w-56
                rounded-full
                bg-[#C9AE63]/10
                blur-3xl
            " />

            {/* LABEL */}
            <p className="
                relative
                z-10
                text-sm
                tracking-[0.35em]
                text-[#C9AE63]
            ">
                FOUNDER MESSAGE
            </p>

            {/* QUOTE */}
            <h2 className="
                relative
                z-10
                mx-auto
                mt-8
                max-w-4xl
                text-4xl
                font-bold
                leading-[1.5]
                text-[#18181B]
                md:text-6xl
            ">
                “Dekorasi bukan hanya tentang
                keindahan, tetapi tentang
                menciptakan kenangan yang
                akan selalu dikenang.”
            </h2>

            {/* DESC */}
            <p className="
                relative
                z-10
                mx-auto
                mt-10
                max-w-3xl
                text-lg
                leading-relaxed
                text-neutral-600
            ">
                Floraless hadir untuk membantu setiap pasangan
                dan keluarga merayakan momen spesial dengan
                sentuhan dekorasi yang elegan, hangat,
                profesional, dan penuh makna.
            </p>

            {/* FOOTER */}
            <div className="
                relative
                z-10
                mt-12
            ">

                <div className="
                mx-auto
                h-px
                w-20
                bg-[#C9AE63]
                " />

                <h3 className="
                mt-6
                text-xl
                font-semibold
                text-[#18181B]
                ">
                Floraless Founder
                </h3>

                <p className="
                mt-2
                text-sm
                tracking-[0.2em]
                text-neutral-500
                uppercase
                ">
                Creative Director
                </p>

            </div>

            </div>

        </div>

        </section>

      {/* ================= CTA ================= */}
      <section className="pb-32">

        <div className="mx-auto max-w-7xl px-6">

          <div className="
            relative
            overflow-hidden
            rounded-[40px]
          ">

            <div className="
              absolute
              inset-0
            ">

              <Image
                src="/hero.jpg"
                alt="CTA"
                fill
                className="object-cover"
              />

            </div>

            <div className="
              absolute
              inset-0
              bg-black/55
            " />

            <div className="
              relative
              z-10
              px-8
              py-28
              text-center
              md:px-20
            ">

              <p className="
                text-sm
                tracking-[0.3em]
                text-[#C9AE63]
              ">
                READY WITH FLORALESS
              </p>

              <h2 className="
                mx-auto
                mt-6
                max-w-4xl
                text-4xl
                font-bold
                leading-tight
                text-white
                md:text-6xl
              ">
                Siap Membantu
                Mewujudkan Acara
                Impian Anda
              </h2>

              <Link
                href="/booking"
                className="
                  mt-10
                  inline-flex
                  rounded-full
                  bg-white
                  px-8
                  py-4
                  text-sm
                  font-semibold
                  text-black
                "
              >
                Booking Sekarang
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}