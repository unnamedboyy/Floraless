"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const faqs = [
  {
    question: "Bagaimana cara melakukan booking tanggal acara?",
    answer:
      "Anda dapat melakukan booking langsung melalui fitur kalender di website kami. Pilih tanggal yang tersedia, pilih layanan yang diinginkan, lalu konfirmasi booking. Admin akan meninjau dan menyetujui permintaan Anda.",
  },
  {
    question: "Apakah saya harus membuat akun sebelum booking?",
    answer:
      "Ya, Anda perlu membuat akun terlebih dahulu untuk melakukan booking. Dengan akun, Anda dapat melihat status pesanan, berkomunikasi melalui chat, dan mengelola tiket acara Anda.",
  },
  {
    question: "Bagaimana proses persetujuan booking?",
    answer:
      "Setelah Anda mengirim permintaan booking, admin akan meninjau detail acara Anda. Jika disetujui, status akan berubah menjadi 'approved'. Jika tidak, Anda akan mendapatkan notifikasi penolakan.",
  },
  {
    question: "Apakah saya bisa membatalkan atau mengubah tanggal acara?",
    answer:
      "Perubahan atau pembatalan dapat dilakukan dengan menghubungi admin melalui fitur chat sebelum tanggal acara. Persetujuan tergantung pada kebijakan dan ketersediaan jadwal.",
  },
  {
    question: "Layanan apa saja yang tersedia di Floraless?",
    answer:
      "Kami menyediakan berbagai layanan dekorasi dan produksi acara seperti wedding decoration, birthday setup, corporate event styling, lighting, dan sound system yang dapat disesuaikan dengan kebutuhan Anda.",
  },
  {
    question: "Bagaimana cara mengetahui status booking saya?",
    answer:
      "Anda dapat melihat status booking di halaman 'Tiket' pada dashboard user. Status akan diperbarui secara real-time oleh admin.",
  },
];

export default function FaqPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white text-neutral-900">

      {/* HERO */}
      {/* <section className="relative h-[420px] w-full overflow-hidden">

        <div
          className="absolute inset-0 scale-110"
          style={{
            transform: `translateY(${offset * 0.3}px)`
          }}
        >
          <Image
            src="/hero.jpg"
            alt="FAQ Floraless"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative flex h-full items-center justify-center text-center px-6">
          <div className="max-w-3xl">

            <h1 className="text-4xl md:text-5xl font-semibold text-white">
              Frequently Asked Questions
            </h1>

            <p className="mt-6 text-white/80 leading-relaxed">
              Temukan jawaban dari pertanyaan yang paling sering diajukan
              mengenai layanan, proses booking, serta penggunaan sistem
              Floraless.
            </p>

          </div>
        </div>

      </section> */}

      {/* HERO PARALLAX */}
      <section className="relative h-[520px] w-full overflow-hidden">

        <div
          className="absolute inset-0 scale-110"
          style={{
            transform: `translateY(${offset * 0.35}px)`
          }}
        >
          <Image
            src="/hero.jpg"
            alt="Contact Floraless"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight tracking-tight">
            Frequently Asked Questions
          </h1>
        </div>

      </section>

      {/* QUICK HELP */}
      <section className="py-16 px-6">

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

          <div className="rounded-3xl border border-neutral-200 p-10 shadow-sm">
            <h2 className="text-2xl font-semibold">Booking Acara</h2>
            <p className="mt-6 text-neutral-600 leading-relaxed">
              Gunakan fitur kalender untuk memilih tanggal yang tersedia dan melakukan permintaan booking secara langsung.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-10 shadow-sm">
            <h2 className="text-2xl font-semibold">Status Pesanan</h2>
            <p className="mt-6 text-neutral-600 leading-relaxed">
              Semua status booking dapat dipantau melalui halaman tiket pada dashboard akun Anda.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-10 shadow-sm">
            <h2 className="text-2xl font-semibold">Butuh Bantuan?</h2>
            <p className="mt-6 text-neutral-600 leading-relaxed">
              Anda dapat langsung menghubungi admin melalui fitur live chat untuk mendapatkan bantuan lebih lanjut.
            </p>
          </div>

        </div>

      </section>

      {/* FAQ LIST */}
      <section className="py-16 px-6">

        <div className="max-w-4xl mx-auto">

          <h2 className="text-3xl font-semibold text-center mb-16">
            Pertanyaan Umum
          </h2>

          <div className="space-y-4">

            {faqs.map((faq, index) => {

              const isOpen = activeIndex === index;

              return (
                <div
                  key={index}
                  className="border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                >

                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >

                    <span className="text-base font-medium">
                      {faq.question}
                    </span>

                    <ArrowUpRight
                      className={`transition-transform duration-300 ${
                        isOpen
                          ? "rotate-45 text-[#C9AE63]"
                          : "text-neutral-400"
                      }`}
                    />

                  </button>

                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? "max-h-60 px-6 pb-6" : "max-h-0"
                    }`}
                  >

                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {faq.answer}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* CONTACT SUPPORT */}
      <section className="py-20 bg-neutral-50 px-6">

        <div className="max-w-3xl mx-auto text-center">

          <h2 className="text-3xl font-semibold">
            Masih membutuhkan bantuan?
          </h2>

          <p className="mt-4 text-neutral-600">
            Jika pertanyaan Anda belum terjawab, silakan hubungi tim kami
            melalui fitur live chat atau kontak yang tersedia.
          </p>

          <button className="mt-8 bg-[#C9AE63] text-white px-8 py-3 rounded-full hover:opacity-90">
            Hubungi Admin
          </button>

        </div>

      </section>

    </div>
  );
}