import {
  MessageCircle,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Layanan Konsultasi",
    desc: "Diskusi konsep, kebutuhan, dan estimasi secara transparan sebelum acara dimulai.",
    icon: MessageCircle,
  },
  {
    title: "Tepat Waktu",
    desc: "Tim kami bekerja terjadwal dan profesional untuk memastikan semuanya siap sesuai timeline.",
    icon: Clock,
  },
  {
    title: "Jangkauan Luas",
    desc: "Melayani berbagai wilayah dengan koordinasi tim yang terstruktur dan efisien.",
    icon: MapPin,
  },
  {
    title: "Semua Acara",
    desc: "Mulai dari pernikahan, corporate event, hingga private celebration kami tangani dengan detail.",
    icon: Sparkles,
  },
];
export default function Features() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;

            return (
              <div key={f.title} className="flex gap-4 items-start group">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9E1C6] text-[#C9AE63] transition group-hover:bg-[#C9AE63] group-hover:text-white">
                  <Icon size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-600">
                    {f.desc}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        <div className="mt-10 border-t border-neutral-200" />
      </div>
    </section>
  );
}
