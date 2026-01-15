import Image from "next/image";

const pkgs = [
  { title: "Paket 1", img: "/package-1.jpg" },
  { title: "Paket 2", img: "/package-2.jpg" },
  { title: "Paket 3", img: "/package-3.jpg" },
];

const bullets = [
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
  "Lorem ipsum dolor sit amet",
];

export default function Packages() {
  return (
    <section id="packages" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <h2 className="text-2xl font-semibold">
              Pilih Paket Dekorasi <br /> Sesuai Kebutuhan
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-sm leading-relaxed text-neutral-600">
              Lorem ipsum dolor sit amet consectetur. Posuere dolor commodo tellus diam mauris dolor at dui.
              Lorem ipsum dolor sit amet.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {pkgs.map((p) => (
            <div key={p.title} className="group relative overflow-hidden rounded-2xl border border-neutral-200">
              <div className="relative h-[420px]">
                <Image src={p.img} alt={p.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/45" />
              </div>

              <div className="absolute inset-x-0 top-0 p-5 text-white">
                <h3 className="text-xl font-semibold">{p.title}</h3>

                <ul className="mt-4 space-y-2 text-sm text-white/90">
                  {bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-4 w-4 rounded-full bg-[#C9AE63]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <button className="mt-6 rounded-full bg-[#C9AE63] px-5 py-2 text-xs font-semibold hover:opacity-90">
                  Selengkapnya
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
