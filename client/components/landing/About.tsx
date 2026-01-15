import Image from "next/image";

export default function About() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-10 pt-2 md:grid-cols-12 md:items-center">
        <div className="md:col-span-6">
          <div className="relative h-[260px] w-full overflow-hidden rounded-2xl md:h-[320px]">
            <Image src="/about.jpg" alt="About" fill className="object-cover" />
          </div>
        </div>

        <div className="md:col-span-6">
          <div className="rounded-2xl bg-[#C9AE63] p-7 text-white shadow-sm">
            <h2 className="text-2xl font-semibold">Tentang Floraless</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              Lorem ipsum dolor sit amet consectetur. Viverra mattis vitae dignissim. Sed ornare
              euismod. Nibh neque et diam. Lorem ipsum dolor sit amet consectetur.
            </p>
            <a
              href="/tentang"
              className="mt-5 inline-flex rounded-full border border-white/60 px-5 py-2 text-xs font-semibold hover:bg-white/10"
            >
              Selengkapnya
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
