"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentPage() {

  const router = useRouter();
  const params = useSearchParams();

  const API = process.env.NEXT_PUBLIC_API_URL;

  const ticket = params.get("ticket");
  const type = params.get("type");

  const [summary, setSummary] = useState<any>(null);
  const [metode, setMetode] = useState("transfer");
  const [bukti, setBukti] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  /* ========================
     LOAD PAYMENT SUMMARY
  ======================== */

  useEffect(() => {

    async function loadSummary() {

      if (!ticket) return;

      const res = await fetch(
        `${API}/pembayaran/summary/${ticket}`,
        { credentials: "include" }
      );

      const data = await res.json();

      setSummary(data);

    }

    loadSummary();

  }, [ticket]);

  /* ========================
     LABEL
  ======================== */

  function label(type: string | null) {

    if (type === "dp1") return "DP 1 (20%)";
    if (type === "dp2") return "DP 2 (30%)";
    if (type === "pelunasan") return "Pelunasan";

    return "Pembayaran";

  }

  /* ========================
     HITUNG NOMINAL
  ======================== */

  function calculateAmount() {

    if (!summary) return 0;

    const total = summary.total_harga;

    if (type === "dp1") return Math.round(total * 0.2);

    if (type === "dp2") return Math.round(total * 0.3);

    if (type === "pelunasan") return summary.sisa;

    return 0;

  }

  /* ========================
     FILE HANDLER
  ======================== */

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {

    const file = e.target.files?.[0];

    if (!file) return;

    setBukti(file);
    setPreview(URL.createObjectURL(file));

  }

  /* ========================
     SUBMIT
  ======================== */

  async function submit(e: React.FormEvent) {

    e.preventDefault();

    if (!ticket || !type) {
      alert("Parameter pembayaran tidak valid");
      return;
    }

    setLoading(true);

    try {

      const form = new FormData();

      form.append("ticket", ticket);
      form.append("jenis_pembayaran", type);
      form.append("jumlah", String(calculateAmount()));
      form.append("metode_pembayaran", metode);

      if (bukti) {
        form.append("bukti_pembayaran", bukti);
      }

      const res = await fetch(`${API}/pembayaran`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setSuccess("Pembayaran berhasil dikirim");

      setTimeout(() => {
        router.push("/user/tickets");
      }, 1500);

    } catch (err: any) {

      alert(err.message);

    }

    setLoading(false);

  }

  return (
    <div className="max-w-xl mx-auto py-16 px-6">

      <h1 className="text-3xl font-semibold mb-2">
        Pembayaran {label(type)}
      </h1>

      <p className="text-sm text-neutral-500 mb-8">
        Nominal pembayaran dihitung otomatis
      </p>

      {success && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
          {success}
        </div>
      )}

      <form
        onSubmit={submit}
        className="space-y-6 border border-neutral-200 rounded-xl p-6"
      >

        {/* TICKET */}
        <div>
          <label className="text-sm text-neutral-600 block mb-1">
            ID Ticket
          </label>

          <div className="text-sm font-medium">
            #{ticket?.slice(-6)}
          </div>
        </div>

        {/* TYPE */}
        <div>
          <label className="text-sm text-neutral-600 block mb-1">
            Jenis Pembayaran
          </label>

          <div className="text-sm font-medium">
            {label(type)}
          </div>
        </div>

        {/* JUMLAH AUTO */}
        <div>
          <label className="text-sm text-neutral-600 block mb-2">
            Jumlah Pembayaran
          </label>

          <input
            type="number"
            value={calculateAmount()}
            disabled
            className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm bg-neutral-100"
          />
        </div>

        {/* METODE */}
        <div>

          <label className="text-sm text-neutral-600 block mb-2">
            Metode Pembayaran
          </label>

          <select
            value={metode}
            onChange={(e) => setMetode(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm"
          >
            <option value="transfer">Transfer Bank</option>
            <option value="qris">QRIS</option>
            <option value="cash">Cash</option>
          </select>

        </div>

        {/* UPLOAD BUKTI */}
        <div>

          <label className="text-sm text-neutral-600 block mb-2">
            Upload Bukti Transfer
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="text-sm"
          />

        </div>

        {/* PREVIEW */}
        {preview && (
          <div className="border rounded-lg p-2">

            <p className="text-xs text-neutral-500 mb-2">
              Preview Bukti Transfer
            </p>

            <img
              src={preview}
              alt="preview"
              className="rounded-lg max-h-60 object-contain"
            />

          </div>
        )}

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg text-sm"
        >
          {loading ? "Memproses..." : "Kirim Pembayaran"}
        </button>

      </form>

    </div>
  );
}