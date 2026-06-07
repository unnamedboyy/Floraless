"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export default function BeforeAfterSection() {
  const beforeSrc = "/before3.png";
  const afterSrc = "/after3.png";
  const heightClassName = "h-[480px] md:h-[640px]";

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const [ratio, setRatio] = useState(0.5);

  const clamp = (v: number) => Math.min(1, Math.max(0, v));

  const setFromClientX = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = (clientX - rect.left) / rect.width;
    setRatio(clamp(next));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    const up = () => (draggingRef.current = false);
    window.addEventListener("pointerup", up);
    return () => window.removeEventListener("pointerup", up);
  }, []);

  const percent = useMemo(() => `${ratio * 100}%`, [ratio]);

  return (
    <section className="bg-white">
      <div className="w-full">
        <div
          ref={wrapRef}
          className={["relative w-full overflow-hidden", heightClassName].join(" ")}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          role="slider"
          aria-label="Before After Slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(ratio * 100)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setRatio((r) => clamp(r - 0.02));
            if (e.key === "ArrowRight") setRatio((r) => clamp(r + 0.02));
          }}
        >
          {/* AFTER (base) */}
          <Image
            src={afterSrc}
            alt="After"
            fill
            priority
            className="pointer-events-none select-none object-cover"
          />

          {/* BEFORE (overlay clipped) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - ratio * 100}% 0 0)` }}
          >
            <Image
              src={beforeSrc}
              alt="Before"
              fill
              priority
              className="pointer-events-none select-none object-cover"
            />
          </div>

          {/* Labels */}
          <div className="absolute left-5 top-5 z-20">
            <span className="rounded-full bg-black/55 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              Konsep Awal
            </span>
          </div>
          <div className="absolute right-5 top-5 z-20">
            <span className="rounded-full bg-black/55 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              Hasil Eksekusi
            </span>
          </div>

          {/* Divider + Handle */}
          <div className="absolute top-0 z-30 h-full" style={{ left: percent }}>
            <div className="absolute -left-[1px] top-0 h-full w-[2px] bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-[2px] bg-neutral-300" />
                  <span className="h-5 w-[2px] bg-neutral-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Hint */}
          <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
            <span className="rounded-full bg-black/45 px-4 py-2 text-xs font-medium text-white backdrop-blur">
              Geser untuk melihat Before / After
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
