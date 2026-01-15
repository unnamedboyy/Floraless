export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="text-sm font-semibold tracking-widest">FLORALESS</div>
            <p className="mt-4 text-sm text-white/70">
              Lorem ipsum dolor sit amet consectetur. Amet sed nulla. Vulputate quis viverra.
            </p>
            <p className="mt-6 text-xs text-white/50">© 2026 Floraless</p>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold">Menu</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><a href="/" className="hover:text-white">Beranda</a></li>
              <li><a href="/tentang" className="hover:text-white">Tentang</a></li>
              <li><a href="/kontak" className="hover:text-white">Kontak</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold">Kontak</h4>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>floraless@email.com</p>
              <p>+62 8xx-xxxx-xxxx</p>
              <p>Lorem ipsum dolor sit amet, Yogyakarta</p>
            </div>

            <button className="mt-6 rounded-full bg-[#25D366] px-5 py-3 text-xs font-semibold text-neutral-950 hover:opacity-90">
              Chat via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
