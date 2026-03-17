"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Star, X } from "lucide-react";

export default function TestimoniModal({
  ticketId,
  onClose,
  onSuccess,
}: {
  ticketId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    try {
      setLoading(true);

      await apiFetch("/testimoni", {
        method: "POST",
        body: JSON.stringify({
          ticket: ticketId,
          rating,
          komentar,
        }),
      });

      onSuccess();
      onClose();

    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">

        {/* CLOSE BUTTON */}

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-black"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold mb-6">
          Berikan Testimoni
        </h2>

        {/* STAR RATING */}

        <div className="mb-6">

          <label className="text-sm text-neutral-600 block mb-3">
            Rating
          </label>

          <div className="flex gap-2">

            {[1, 2, 3, 4, 5].map((star) => {

              const active = star <= (hover || rating);

              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={`transition ${
                      active
                        ? "text-[#C9AE63] fill-[#C9AE63]"
                        : "text-neutral-300"
                    }`}
                  />
                </button>
              );

            })}

          </div>

          <p className="text-xs text-neutral-400 mt-2">
            Klik bintang untuk memberikan rating
          </p>

        </div>

        {/* KOMENTAR */}

        <div className="mb-6">

          <label className="text-sm text-neutral-600 block mb-2">
            Komentar
          </label>

          <textarea
            placeholder="Bagikan pengalaman Anda menggunakan layanan Floraless..."
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            rows={4}
            className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-300"
          />

        </div>

        {/* BUTTON */}

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
          >
            Batal
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-5 py-2 bg-[#C9AE63] text-white rounded-lg hover:opacity-90 transition"
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>

        </div>

      </div>

    </div>
  );
}