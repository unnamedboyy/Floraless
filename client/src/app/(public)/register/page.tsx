"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../hooks/useAuth";

interface Form { nama:string; username:string; no_telp:string; password:string; confirm:string; }
const INIT: Form = { nama:"", username:"", no_telp:"", password:"", confirm:"" };

export default function RegisterPage() {
  const { registerPelanggan, isLoading } = useAuth();
  const [form, setForm]   = useState<Form>(INIT);
  const [error, setError] = useState<string|null>(null);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.username || !form.password) { setError("Nama, username, dan password wajib diisi."); return; }
    if (form.password !== form.confirm) { setError("Password dan konfirmasi tidak cocok."); return; }
    if (form.password.length < 6) { setError("Password minimal 6 karakter."); return; }
    try {
      await registerPelanggan({ nama: form.nama, username: form.username, password: form.password, no_telp: form.no_telp||undefined });
    } catch (msg) { setError(msg as string); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif}
        .root{min-height:100vh;background:#faf8f5;display:flex;align-items:center;justify-content:center;padding:40px 24px;position:relative}
        .root::before{content:'';position:fixed;top:-100px;right:-100px;width:480px;height:480px;border-radius:50%;background:radial-gradient(circle,rgba(201,149,110,.1) 0%,transparent 70%);pointer-events:none}
        .root::after{content:'';position:fixed;bottom:-100px;left:-100px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(139,90,43,.07) 0%,transparent 70%);pointer-events:none}
        .card{background:#fff;border-radius:20px;box-shadow:0 4px 40px rgba(139,90,43,.1),0 1px 8px rgba(0,0,0,.04);padding:48px 44px;width:100%;max-width:500px;position:relative;z-index:1;animation:fu .45s ease both}
        @keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .top{display:flex;align-items:center;gap:12px;margin-bottom:28px}
        .dot{width:10px;height:10px;border-radius:50%;background:linear-gradient(135deg,#c9956e,#8b5a2b);flex-shrink:0}
        .line{flex:1;height:1px;background:#ede5da}
        .blabel{font-family:'Cormorant Garamond',serif;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#c9956e;font-weight:500}
        h1{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:400;color:#1a1208;letter-spacing:-.02em;margin-bottom:4px}
        .sub{font-size:13.5px;color:#9a8878;font-weight:300;margin-bottom:28px}
        .row2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .field{margin-bottom:16px}
        .flabel{display:block;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:#7a6a5a;margin-bottom:6px}
        .opt{font-size:10px;color:#b8a898;font-weight:400;letter-spacing:.05em;margin-left:4px;text-transform:none}
        .fwrap{position:relative}
        .finput{width:100%;height:46px;padding:0 14px;border:1.5px solid #e2d8ce;border-radius:10px;background:#fdfcfb;font-size:14px;font-family:'DM Sans',sans-serif;color:#1a1208;transition:border-color .2s,box-shadow .2s;outline:none}
        .finput:focus{border-color:#c9956e;box-shadow:0 0 0 3px rgba(201,149,110,.12)}
        .finput::placeholder{color:#c4b8ac}
        .fwrap .finput{padding-right:44px}
        .ficon{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#c4b8ac;cursor:pointer;display:flex;transition:color .15s}
        .ficon:hover{color:#8b5a2b}
        .ae{background:#fef5f5;color:#a33030;border:1px solid #f5c6c6;border-radius:8px;padding:11px 14px;font-size:13px;margin-bottom:18px;line-height:1.5}
        .btnsubmit{width:100%;height:50px;background:linear-gradient(135deg,#8b5a2b,#c9956e);border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;color:#fff;letter-spacing:.04em;cursor:pointer;transition:opacity .2s,transform .15s,box-shadow .2s;box-shadow:0 4px 16px rgba(139,90,43,.28);margin-top:8px;position:relative;overflow:hidden}
        .btnsubmit::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 60%)}
        .btnsubmit:hover:not(:disabled){opacity:.92;transform:translateY(-1px);box-shadow:0 8px 24px rgba(139,90,43,.36)}
        .btnsubmit:disabled{opacity:.55;cursor:not-allowed}
        .spin{width:15px;height:15px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:sp .7s linear infinite;display:inline-block;vertical-align:middle;margin-right:8px}
        @keyframes sp{to{transform:rotate(360deg)}}
        .loginlink{text-align:center;margin-top:20px;font-size:13px;color:#9a8878}
        .loginlink a{color:#8b5a2b;font-weight:500;text-decoration:none;border-bottom:1px solid rgba(139,90,43,.3);padding-bottom:1px}
        .loginlink a:hover{border-color:#8b5a2b}
        .note{font-size:11px;color:#b8a898;margin-top:5px;display:block}
        @media(max-width:540px){.card{padding:36px 24px}.row2{grid-template-columns:1fr}}
      `}</style>

      <div className="root">
        <div className="card">
          <div className="top">
            <div className="dot"/><div className="line"/>
            <span className="blabel">Floraless</span>
            <div className="line"/><div className="dot"/>
          </div>

          <h1>Buat Akun</h1>
          <p className="sub">Bergabunglah dan mulai pesan dekorasi impian Anda</p>

          {error && <div className="ae">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row2">
              <div className="field">
                <label className="flabel">Nama Lengkap</label>
                <input className="finput" type="text" name="nama" placeholder="Budi Santoso"
                  value={form.nama} onChange={handleChange} disabled={isLoading}/>
              </div>
              <div className="field">
                <label className="flabel">Username</label>
                <input className="finput" type="text" name="username" placeholder="budisantoso"
                  value={form.username} onChange={handleChange} autoComplete="username" disabled={isLoading}/>
              </div>
            </div>

            <div className="field">
              <label className="flabel">No. Telepon <span className="opt">(opsional)</span></label>
              <input className="finput" type="tel" name="no_telp" placeholder="08xxxxxxxxxx"
                value={form.no_telp} onChange={handleChange} disabled={isLoading}/>
            </div>

            <div className="row2">
              <div className="field">
                <label className="flabel">Password</label>
                <div className="fwrap">
                  <input className="finput" type={showPass?"text":"password"} name="password" placeholder="Min. 6 karakter"
                    value={form.password} onChange={handleChange} disabled={isLoading}/>
                  <span className="ficon" onClick={()=>setShowPass(!showPass)}>
                    {showPass
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="flabel">Konfirmasi Password</label>
                <input className="finput" type={showPass?"text":"password"} name="confirm" placeholder="Ulangi password"
                  value={form.confirm} onChange={handleChange} disabled={isLoading}/>
              </div>
            </div>
            <span className="note">Username akan digunakan untuk login, tidak bisa diubah setelah registrasi.</span>

            <button type="submit" className="btnsubmit" disabled={isLoading}>
              {isLoading ? <><span className="spin"/>Memproses...</> : "Buat Akun"}
            </button>
          </form>

          <div className="loginlink">
            Sudah punya akun? <Link href="/login">Masuk di sini</Link>
          </div>
        </div>
      </div>
    </>
  );
}