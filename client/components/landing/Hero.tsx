import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative">
      <div className="relative h-[78vh] min-h-[560px] w-full">
        <Image src="/hero.jpg" alt="Hero" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 text-center">
            <p className="mb-3 text-[11px] tracking-[0.35em] text-white/80">
              FLOWER ARRANGEMENT
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
              Dekorasi Gereja & Event
              <br className="hidden md:block" /> Yogyakarta
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
              Lorem ipsum dolor sit amet consectetur. Posuere dolor commodo tellus diam mauris
              dolor at dui. Lorem ipsum dolor sit amet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
