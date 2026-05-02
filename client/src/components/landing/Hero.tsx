"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const cards = ["/gal-1.jpg","/gal-2.jpg","/gal-3.jpg","/gal-4.jpg"];
const allCards = [...cards,...cards];

export default function Hero() {
  const { isLoggedIn, role } = useAuth();
  const [index, setIndex] = useState(0);
  const next = () => setIndex(p=>p+1);
  const prev = () => setIndex(p=>(p===0?cards.length-1:p-1));
  useEffect(()=>{ const t=setInterval(next,4000); return ()=>clearInterval(t); },[]);
  const bookingHref = isLoggedIn && role==="pelanggan" ? "/pelanggan/ticket/buat" : "/login";

  return (
    <section className="bg-white py-0">
      <div className="relative h-[80vh] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
        <Image src="/hero.jpg" alt="Floraless" fill priority className="object-cover scale-[1.02]"/>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"/>
        <div className="absolute left-8 top-1/2 max-w-xl -translate-y-1/2 text-white md:left-16">
          <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-[#C9AE63] uppercase">Floraless — Yogyakarta</p>
          <h1 className="text-4xl font-semibold leading-[1.1] md:text-6xl">Jasa Dekorasi<br/>Gereja & Event</h1>
          <p className="mt-6 text-sm text-white/80 leading-relaxed max-w-sm">Kami menghadirkan dekorasi bunga yang sakral dan elegan untuk pernikahan serta berbagai acara istimewa di Yogyakarta.</p>
          <div className="mt-10 flex items-center gap-4 flex-wrap">
            <Link href={bookingHref} className="rounded-full bg-[#C9AE63] px-8 py-4 text-sm font-semibold text-white hover:opacity-90 transition">Booking Sekarang</Link>
            <Link href="/kontak" className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition">Konsultasi</Link>
          </div>
        </div>
        <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 md:block">
          <div className="relative w-[600px] overflow-hidden">
            <div className="flex gap-6 transition-transform duration-700 ease-out" style={{transform:`translateX(-${index*260}px)`}}>
              {allCards.map((img,i)=>(
                <div key={i} className="relative h-[360px] w-[400px] flex-shrink-0 overflow-hidden rounded-[22px] shadow-2xl">
                  <Image src={img} alt="gallery" fill className="object-cover transition-transform duration-700 hover:scale-110"/>
                  <div className="absolute inset-0 bg-black/20"/>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 right-14 flex items-center gap-6 text-white">
          <div className="flex items-center gap-3">
            <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 hover:bg-white/10 transition">←</button>
            <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 hover:bg-white/10 transition">→</button>
          </div>
          <div className="relative h-[2px] w-[200px] bg-white/30 md:w-[350px]">
            <div className="absolute left-0 top-0 h-full bg-white transition-all duration-500" style={{width:`${((index%cards.length)+1)*25}%`}}/>
          </div>
          <div className="text-lg font-semibold">{String((index%cards.length)+1).padStart(2,"0")}</div>
        </div>
      </div>
    </section>
  );
}