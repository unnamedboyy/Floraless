/**
 * app/layout.tsx — Root Layout Floraless
 *
 * Dibungkus oleh AuthProvider agar:
 * 1. Token di-hydrate dari localStorage sebelum halaman apapun render
 * 2. Redirect berdasarkan role sudah bisa berjalan dari page.tsx
 *
 * Metadata, font, dan globals.css didefinisikan di sini.
 */

import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import AuthProvider from "../components/providers/AuthProvider";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "./globals.css";

// ─── Font ─────────────────────────────────────────────────────────────────────
// Cormorant Garamond di-load via @import di masing-masing halaman (CSS-only)
// karena Next.js font hanya support Google Fonts variable fonts.
// DM Sans di-load di sini untuk body text.

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "Floraless — Dekorasi Bunga Profesional",
    template: "%s | Floraless",
  },
  description:
    "Sistem manajemen pemesanan dekorasi bunga profesional. Pesan, pantau, dan kelola dekorasi impian Anda dengan mudah.",
  keywords: ["dekorasi bunga", "florist", "wedding decoration", "floraless"],
  authors: [{ name: "Floraless" }],
  robots: "noindex, nofollow", // private app — jangan diindex search engine
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={dmSans.variable}>
      <body className="bg-white text-neutral-900">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}