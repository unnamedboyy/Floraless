import Image from "next/image";

export default function About() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-2 pt-2">
        <div className="relative md:min-h-[360px]">
          {/* Gambar (kiri) */}
          <div className="md:w-7/12">
            <div className="relative h-[260px] w-full overflow-hidden rounded-2xl md:h-[340px]">
              <Image src="/about.jpg" alt="About" fill className="object-cover" />
            </div>
          </div>

          {/* Card (kanan) - bertumpuk */}
          <div className="mt-4 md:mt-0 md:absolute md:right-0 md:top-1/2 md:w-7/12 md:-translate-y-1/2">
            <div className="relative z-10 rounded-2xl bg-[#C9AE63] p-8 text-white shadow-sm md:ml-auto md:max-w-[540px]">
              <h2 className="text-4xl font-semibold">
                Tentang Floraless
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/90">
                Flora.less adalah jasa dekorasi gereja dan event tematik di Yogyakarta, dengan fokus pada
                pernikahan dan misa pemberkatan. Kami merancang dekorasi yang indah dan bermakna,
                menciptakan suasana sakral yang menyatu dengan nilai dan cerita setiap acara.
              </p>

              <a
                href="/tentang"
                className="mt-6 inline-flex rounded-full border border-white/60 px-5 py-2 text-xs font-semibold hover:bg-white/10"
              >
                Selengkapnya
              </a>
            </div>
          </div>

          {/* Spacer agar tinggi container cukup saat md (karena card absolute) */}
          <div className="hidden md:block md:h-[20px]" />
        </div>
      </div>
    </section>
  );
}
