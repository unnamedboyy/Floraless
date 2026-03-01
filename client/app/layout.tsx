import { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="id">
      <body className="bg-white text-neutral-900">
        <AuthProvider>
          <Navbar />
          <main className="pt-[72px]">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}