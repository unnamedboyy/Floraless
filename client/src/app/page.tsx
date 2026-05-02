"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/authStore";

const ROLE_DASHBOARD: Record<string, string> = {
  admin:     "/admin/dashboard",
  pegawai:   "/pegawai/dashboard",
  pelanggan: "/pelanggan/dashboard",
};

/**
 * app/page.tsx — Root page (/)
 *
 * Logika:
 * - Jika sudah login → redirect ke dashboard sesuai role
 * - Jika belum login → redirect ke /login
 *
 * Tidak menampilkan UI apapun, hanya redirect.
 * Menunggu isHydrated = true sebelum redirect agar tidak
 * flash redirect akibat store belum terisi dari localStorage.
 */
export default function RootPage() {
  const router     = useRouter();
  const role       = useAuthStore((s) => s.role);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return; // tunggu store siap

    if (role) {
      router.replace(ROLE_DASHBOARD[role] ?? "/login");
    } else {
      router.replace("/login");
    }
  }, [isHydrated, role, router]);

  // Tampilkan loading flower spinner sambil menunggu hydration & redirect
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400&display=swap');

        @keyframes fl-spin    { to { transform: rotate(360deg); } }
        @keyframes fl-pulse   { 0%,100%{opacity:.3;transform:scale(.92)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fl-fadein  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .fl-root {
          position: fixed; inset: 0;
          background: #faf8f5;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 24px;
          font-family: 'DM Sans', sans-serif;
          animation: fl-fadein .3s ease both;
        }
        .fl-root::after {
          content: '';
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 480px; height: 480px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,149,110,.09) 0%, transparent 65%);
          pointer-events: none;
        }

        /* Flower */
        .fl-flower { position: relative; width: 60px; height: 60px; }
        .fl-center {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 13px; height: 13px; border-radius: 50%;
          background: linear-gradient(135deg,#c9956e,#8b5a2b);
          z-index: 2;
          animation: fl-pulse 1.6s ease-in-out infinite;
        }
        .fl-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 1.5px solid transparent;
          border-top-color: #c9956e;
          border-right-color: rgba(201,149,110,.25);
          animation: fl-spin 1.1s linear infinite;
        }
        .fl-petal {
          position: absolute; top: 50%; left: 50%;
          width: 7px; height: 15px;
          margin-left: -3.5px; margin-top: -7.5px;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          background: linear-gradient(180deg,rgba(201,149,110,.5) 0%,rgba(139,90,43,.15) 100%);
          transform-origin: center 28px;
          opacity: .7;
        }
        .fl-petal:nth-child(1){transform:rotate(0deg)   translateY(-20px)}
        .fl-petal:nth-child(2){transform:rotate(45deg)  translateY(-20px)}
        .fl-petal:nth-child(3){transform:rotate(90deg)  translateY(-20px)}
        .fl-petal:nth-child(4){transform:rotate(135deg) translateY(-20px)}
        .fl-petal:nth-child(5){transform:rotate(180deg) translateY(-20px)}
        .fl-petal:nth-child(6){transform:rotate(225deg) translateY(-20px)}
        .fl-petal:nth-child(7){transform:rotate(270deg) translateY(-20px)}
        .fl-petal:nth-child(8){transform:rotate(315deg) translateY(-20px)}

        /* Brand */
        .fl-brand {
          display: flex; flex-direction: column;
          align-items: center; gap: 5px;
          position: relative; z-index: 1;
        }
        .fl-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; font-weight: 400;
          letter-spacing: .2em; color: #1a1208;
          text-transform: uppercase;
        }
        .fl-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 12px; font-style: italic;
          font-weight: 300; color: #c9956e;
          letter-spacing: .06em;
        }

        /* Dots */
        .fl-dots { display: flex; gap: 5px; position: relative; z-index: 1; }
        .fl-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #c9956e;
          animation: fl-pulse 1.2s ease-in-out infinite;
        }
        .fl-dot:nth-child(2){animation-delay:.2s}
        .fl-dot:nth-child(3){animation-delay:.4s}

        /* Ornament */
        .fl-orn {
          display: flex; align-items: center;
          gap: 8px; width: 160px;
          position: relative; z-index: 1;
        }
        .fl-orn-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, #e2d8ce);
        }
        .fl-orn-line.r { background: linear-gradient(90deg,#e2d8ce,transparent); }
        .fl-orn-dot { width: 3px; height: 3px; border-radius: 50%; background: #c9956e; flex-shrink: 0; }
      `}</style>

      <div className="fl-root" role="status" aria-label="Memuat Floraless">
        <div className="fl-flower">
          {[0,1,2,3,4,5,6,7].map((i) => <div key={i} className="fl-petal" />)}
          <div className="fl-ring" />
          <div className="fl-center" />
        </div>

        <div className="fl-brand">
          <span className="fl-name">Floraless</span>
          <span className="fl-tagline">Dekorasi yang tak terlupakan</span>
        </div>

        <div className="fl-orn">
          <div className="fl-orn-line" />
          <div className="fl-orn-dot" />
          <div className="fl-orn-line r" />
        </div>

        <div className="fl-dots" aria-hidden="true">
          <div className="fl-dot" />
          <div className="fl-dot" />
          <div className="fl-dot" />
        </div>
      </div>
    </>
  );
}