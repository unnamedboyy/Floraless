import Image from "next/image";

const steps = [
  { title: "Step 1 – Konsultasi", desc: "Lorem ipsum dolor sit amet consectetur. Nunc sed." },
  { title: "Step 2 – Perencanaan Kreatif", desc: "Lorem ipsum dolor sit amet consectetur. Amet diam." },
  { title: "Step 3 – Eksekusi", desc: "Lorem ipsum dolor sit amet consectetur. Integer lectus." },
  { title: "Step 4 – Hasil Acara", desc: "Lorem ipsum dolor sit amet consectetur. Vulputate." },
];

export default function ProcessAndConsultation() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-semibold text-[#C9AE63]">
          Perencanaan Dekorasi Gereja & Event <br className="hidden md:block" />
          yang Mulus Bersama Floraless
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-neutral-600">
          Lorem ipsum dolor sit amet consectetur. Tellus in id sed adipiscing magna. Aliquam sit amet.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-12 md:items-start">
          <div className="md:col-span-4">
            <div className="space-y-3">
              {steps.map((s) => (
                <div key={s.title} className="rounded-xl bg-neutral-100 p-4">
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="grid gap-4 md:grid-cols-12 md:items-stretch">
              <div className="md:col-span-6">
                <div className="relative h-[320px] overflow-hidden rounded-2xl md:h-[360px]">
                  <Image src="/process.jpg" alt="Process" fill className="object-cover" />
                </div>
              </div>

              <div className="md:col-span-6">
                <div className="h-full rounded-2xl border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold">Konsultasi</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    Lorem ipsum dolor sit amet consectetur. Eget sed aenean maecenas. Velit ultricies eu.
                  </p>

                  <form className="mt-5 space-y-3">
                    <input
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C9AE63]/40"
                      placeholder="Nama"
                    />
                    <input
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C9AE63]/40"
                      placeholder="No. WhatsApp"
                    />
                    <textarea
                      className="min-h-[110px] w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C9AE63]/40"
                      placeholder="Pesan"
                    />
                    <button
                      type="button"
                      className="w-full rounded-full bg-[#C9AE63] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                    >
                      Hubungi Kami
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
