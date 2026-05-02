"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isLoggedIn, getDashboardPath } = useAuth();
  const [form, setForm]         = useState({ username: "", password: "" });
  const [error, setError]       = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => { if (isLoggedIn) router.replace(getDashboardPath()); }, [isLoggedIn, router, getDashboardPath]);
  useEffect(() => { if (searchParams.get("registered") === "1") setRegistered(true); }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) { setError("Username dan password wajib diisi."); return; }
    try { await login(form); } catch (msg) { setError(msg as string); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif}
        .lr{min-height:100vh;display:grid;grid-template-columns:1fr 1fr}
        /* Left */
        .ll{position:relative;background:#1a1208;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:56px}
        .ll-bg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 30% 40%,rgba(139,90,43,.35) 0%,transparent 70%),radial-gradient(ellipse 40% 50% at 80% 20%,rgba(92,54,20,.3) 0%,transparent 70%)}
        .deco{position:absolute;top:-40px;right:-60px;width:400px;height:400px;opacity:.1;pointer-events:none}
        .lc{position:relative;z-index:1}
        .bmark{display:inline-flex;align-items:center;gap:10px;margin-bottom:48px}
        .bicon{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#c9956e,#8b5a2b);display:flex;align-items:center;justify-content:center}
        .bname{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:#e8d5bb;letter-spacing:.08em}
        .ltag{font-family:'Cormorant Garamond',serif;font-size:50px;font-weight:300;line-height:1.1;color:#f5ede0;margin-bottom:20px;letter-spacing:-.02em}
        .ltag em{font-style:italic;color:#c9956e}
        .lsub{font-size:14px;font-weight:300;color:rgba(232,213,187,.5);line-height:1.6;max-width:300px}
        /* Right */
        .rp{display:flex;align-items:center;justify-content:center;padding:48px 56px;background:#faf8f5;position:relative}
        .rp::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 80% 20%,rgba(201,149,110,.07) 0%,transparent 70%);pointer-events:none}
        .fw{width:100%;max-width:380px;position:relative;z-index:1}
        .orn{display:flex;align-items:center;gap:12px;margin-bottom:28px}
        .ol{flex:1;height:1px;background:linear-gradient(90deg,transparent,#e2d8ce)}
        .olr{flex:1;height:1px;background:linear-gradient(90deg,#e2d8ce,transparent)}
        .od{width:4px;height:4px;border-radius:50%;background:#c9956e}
        .fh{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:400;color:#1a1208;letter-spacing:-.02em;margin-bottom:6px}
        .fsub{font-size:13.5px;color:#9a8878;margin-bottom:32px;font-weight:300}
        /* Alert */
        .alert{padding:12px 16px;border-radius:8px;font-size:13px;margin-bottom:18px;line-height:1.5;border:1px solid}
        .as{background:#f0faf4;color:#2d6a4f;border-color:#b7dfc9}
        .ae{background:#fef5f5;color:#a33030;border-color:#f5c6c6}
        /* Field */
        .field{margin-bottom:18px}
        .flabel{display:block;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:#7a6a5a;margin-bottom:8px}
        .fwrap{position:relative}
        .finput{width:100%;height:48px;padding:0 44px 0 16px;border:1.5px solid #e2d8ce;border-radius:10px;background:#fdfcfb;font-size:14px;font-family:'DM Sans',sans-serif;color:#1a1208;transition:border-color .2s,box-shadow .2s;outline:none}
        .finput:focus{border-color:#c9956e;box-shadow:0 0 0 3px rgba(201,149,110,.12)}
        .finput::placeholder{color:#c4b8ac}
        .ficon{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#c4b8ac;display:flex;cursor:pointer;transition:color .15s}
        .ficon:hover{color:#8b5a2b}
        .fhint{font-size:11px;color:#b8a898;margin-top:5px;display:block;letter-spacing:.01em}
        /* Button */
        .btnsubmit{width:100%;height:50px;background:linear-gradient(135deg,#8b5a2b,#c9956e);border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:#fff;letter-spacing:.04em;cursor:pointer;transition:opacity .2s,transform .15s,box-shadow .2s;box-shadow:0 4px 16px rgba(139,90,43,.28);margin-top:8px;position:relative;overflow:hidden}
        .btnsubmit::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 60%)}
        .btnsubmit:hover:not(:disabled){opacity:.92;transform:translateY(-1px);box-shadow:0 8px 24px rgba(139,90,43,.36)}
        .btnsubmit:active:not(:disabled){transform:translateY(0)}
        .btnsubmit:disabled{opacity:.55;cursor:not-allowed}
        .spin{width:15px;height:15px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:sp .7s linear infinite;display:inline-block;vertical-align:middle;margin-right:8px}
        @keyframes sp{to{transform:rotate(360deg)}}
        .reglink{text-align:center;margin-top:22px;font-size:13px;color:#9a8878}
        .reglink a{color:#8b5a2b;font-weight:500;text-decoration:none;border-bottom:1px solid rgba(139,90,43,.3);padding-bottom:1px}
        .reglink a:hover{border-color:#8b5a2b}
        .fu{animation:fu .45s ease both}
        .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}
        @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:768px){.lr{grid-template-columns:1fr}.ll{display:none}.rp{padding:40px 24px}}
      `}</style>

      <div className="lr">
        {/* ── Left Panel ── */}
        <div className="ll">
          <div className="ll-bg"/>
          <svg className="deco" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="6" fill="#c9956e"/>
            {[0,45,90,135,180,225,270,315].map((d,i)=>(
              <ellipse key={i} cx="100" cy="100" rx="8" ry="38" fill="#c9956e"
                transform={`rotate(${d} 100 100) translate(0 -32)`}/>
            ))}
          </svg>
          <div className="lc">
            <div className="bmark">
              <div className="bicon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fdfcfb" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <span className="bname">FLORALESS</span>
            </div>
            <h1 className="ltag">Keindahan yang<br/><em>tak terlupakan</em></h1>
            <p className="lsub">Dekorasi bunga profesional untuk setiap momen berharga dalam hidup Anda.</p>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="rp">
          <div className="fw">
            <div className="orn fu"><div className="ol"/><div className="od"/><div className="olr"/></div>
            <h2 className="fh fu d1">Masuk</h2>
            <p className="fsub fu d1">Selamat datang kembali di Floraless</p>

            {registered && <div className="alert as fu">✓ Registrasi berhasil! Silakan login.</div>}
            {error      && <div className="alert ae fu">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field fu d2">
                <label className="flabel">Username</label>
                <div className="fwrap">
                  <input className="finput" type="text" name="username" placeholder="Masukkan username Anda"
                    value={form.username} onChange={handleChange} autoComplete="username" disabled={isLoading}/>
                  <span className="ficon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </span>
                </div>
                <span className="fhint">Gunakan username yang didaftarkan, bukan email</span>
              </div>

              <div className="field fu d3">
                <label className="flabel">Password</label>
                <div className="fwrap">
                  <input className="finput" type={showPass?"text":"password"} name="password" placeholder="••••••••"
                    value={form.password} onChange={handleChange} autoComplete="current-password" disabled={isLoading}/>
                  <span className="ficon" onClick={()=>setShowPass(!showPass)}>
                    {showPass
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </span>
                </div>
              </div>

              <button type="submit" className="btnsubmit fu d4" disabled={isLoading}>
                {isLoading ? <><span className="spin"/>Memproses...</> : "Masuk"}
              </button>
            </form>

            <div className="reglink fu d4">
              Belum punya akun? <Link href="/register">Daftar sekarang</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}