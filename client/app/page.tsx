"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>
          Floraless – Sistem Pemesanan Dekorasi
        </h1>
        <p style={{ marginBottom: 24, color: "#555" }}>
          Pilih peran untuk masuk ke halaman yang sesuai.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/customer">
            <button
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#0066AE",
                color: "white",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Halaman Customer
            </button>
          </Link>

          <Link href="/admin">
            <button
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "1px solid #0066AE",
                backgroundColor: "white",
                color: "#0066AE",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Halaman Admin
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
