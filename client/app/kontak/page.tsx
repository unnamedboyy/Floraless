import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Navbar />

      <main className="pt-20">
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-semibold">Kontak</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600">
            Lorem ipsum dolor sit amet consectetur. Posuere dolor commodo tellus diam
            mauris dolor at dui.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="rounded-2xl border border-neutral-200 p-6">
                <h3 className="text-lg font-semibold">Info Kontak</h3>
                <div className="mt-4 space-y-2 text-sm text-neutral-600">
                  <p>Email: lorem@ipsum.com</p>
                  <p>WhatsApp: +62 8xx-xxxx-xxxx</p>
                  <p>Alamat: Lorem ipsum, Yogyakarta</p>
                </div>

                <a
                  href="#"
                  className="mt-6 inline-flex rounded-full bg-[#C9AE63] px-5 py-3 text-xs font-semibold text-white hover:opacity-90"
                >
                  Chat via WhatsApp
                </a>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="rounded-2xl border border-neutral-200 p-6">
                <h3 className="text-lg font-semibold">Kirim Pesan</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  Lorem ipsum dolor sit amet consectetur. Eget sed aenean maecenas.
                </p>

                <form className="mt-5 space-y-3">
                  <input
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C9AE63]/40"
                    placeholder="Nama"
                  />
                  <input
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C9AE63]/40"
                    placeholder="Email"
                  />
                  <textarea
                    className="min-h-[140px] w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#C9AE63]/40"
                    placeholder="Pesan"
                  />
                  <button
                    type="button"
                    className="w-full rounded-full bg-[#C9AE63] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                  >
                    Kirim
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
