"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

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

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-center text-4xl font-semibold text-neutral-900 mb-16">
          Frequently Asked Questions
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
                  <span className="text-base font-medium text-neutral-900">
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
  );
}