import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <main className="pt-20">
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-semibold">Tentang</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600">
            Lorem ipsum dolor sit amet consectetur. Amet sed nulla. Vulputate quis
            viverra lectus. Lorem ipsum dolor sit amet consectetur. Integer vitae augue.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold">Visi</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Lorem ipsum dolor sit amet consectetur. Nunc commodo lorem.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold">Misi</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Lorem ipsum dolor sit amet consectetur. Id purus magna.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold">Nilai</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Lorem ipsum dolor sit amet consectetur. Ultricies varius.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-[#C9AE63] p-8 text-white">
            <h2 className="text-xl font-semibold">Cerita Singkat</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              Lorem ipsum dolor sit amet consectetur. In aliquet in sed massa. Arcu
              tortor egestas aenean. Tristique sed feugiat volutpat. Lorem ipsum dolor
              sit amet consectetur.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
