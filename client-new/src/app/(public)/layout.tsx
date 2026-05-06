import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0F172A] text-white overflow-x-hidden">

      <Navbar />

      <main className="min-h-screen">
        {children}
      </main>

      <Footer />

    </div>
  );
}