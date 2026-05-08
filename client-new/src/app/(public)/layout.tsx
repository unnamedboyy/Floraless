import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        overflow-x-hidden
        bg-[#f8f8f8]
        text-neutral-900
      "
    >

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}