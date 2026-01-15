const features = [
  { title: "Layanan Konsultasi", desc: "Lorem ipsum dolor sit amet consectetur. Nunc commodo lorem." },
  { title: "Tepat Waktu", desc: "Lorem ipsum dolor sit amet consectetur. Id purus magna." },
  { title: "Jangkauan Luas", desc: "Lorem ipsum dolor sit amet consectetur. Ultricies varius." },
  { title: "Semua Acara", desc: "Lorem ipsum dolor sit amet consectetur. Amet sed nulla." },
];

export default function Features() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex gap-3">
              <div className="mt-1 h-9 w-9 shrink-0 rounded-full bg-[#E9E1C6]" />
              <div>
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-neutral-200" />
      </div>
    </section>
  );
}
