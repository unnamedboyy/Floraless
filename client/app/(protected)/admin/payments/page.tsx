"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminPaymentsPage() {

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {

    const res = await fetch(`${API}/pembayaran`, {
      credentials: "include",
    });

    const data = await res.json();

    setPayments(data);
    setLoading(false);

  }

  useEffect(() => {
    load();
  }, []);

  /* =========================
     STATS
  ========================= */

  const stats = useMemo(() => {

    return {

      pending: payments.filter((p) => p.status === "pending").length,

      verified: payments.filter((p) => p.status === "verified").length,

      rejected: payments.filter((p) => p.status === "rejected").length,

    };

  }, [payments]);

  /* =========================
     GROUP BY TICKET
  ========================= */

  const grouped = useMemo(() => {

    const map: any = {};

    payments.forEach((p) => {

      const id = p.ticket?._id;

      if (!map[id]) map[id] = [];

      map[id].push(p);

    });

    return map;

  }, [payments]);

  /* =========================
     VERIFY
  ========================= */

  async function verify(id: string) {

    await fetch(`${API}/pembayaran/${id}/verify`, {
      method: "PATCH",
      credentials: "include",
    });

    load();

  }

  async function reject(id: string) {

    await fetch(`${API}/pembayaran/${id}/reject`, {
      method: "PATCH",
      credentials: "include",
    });

    load();

  }

  /* =========================
     BADGE STYLE
  ========================= */

  function badge(status: string) {

    switch (status) {

      case "verified":
        return "bg-emerald-50 text-emerald-600";

      case "pending":
        return "bg-amber-50 text-amber-600";

      case "rejected":
        return "bg-red-50 text-red-600";

      default:
        return "bg-neutral-100 text-neutral-600";

    }

  }

  if (loading) {

    return (
      <div className="bg-neutral-100 min-h-screen">

        <div className="p-10 text-neutral-500">Loading...</div>
      </div>
    );

  }

  return (

    <div className="bg-neutral-100 min-h-screen">

      <div className="p-10 space-y-10">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-semibold">
            Payment Verification
          </h1>

          <p className="text-sm text-neutral-500 mt-2">
            Kelola dan verifikasi pembayaran pelanggan
          </p>

        </div>

        {/* METRICS */}

        <div className="grid grid-cols-3 gap-6">

          <StatCard title="Pending Payment" value={stats.pending} />

          <StatCard title="Verified Payment" value={stats.verified} />

          <StatCard title="Rejected Payment" value={stats.rejected} />

        </div>

        {/* LIST */}

        <div className="space-y-6">

          {Object.entries(grouped).map(([ticketId, items]: any) => (

            <div
              key={ticketId}
              className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
            >

              {/* TICKET HEADER */}

              <div className="flex items-center justify-between border-b pb-4">

                <div>

                  <h2 className="font-semibold text-lg">
                    Ticket #{ticketId.slice(-6)}
                  </h2>

                  <p className="text-sm text-neutral-500">
                    {items[0].ticket?.layanan?.nama_layanan}
                  </p>

                </div>

                <p className="text-sm text-neutral-400">
                  {items[0].pelanggan?.username}
                </p>

              </div>

              {/* PAYMENTS */}

              <div className="divide-y">

                {items.map((p: any) => (

                  <div
                    key={p._id}
                    className="flex items-center justify-between py-4"
                  >

                    {/* TYPE */}

                    <div>

                      <p className="text-sm font-medium uppercase">
                        {p.jenis_pembayaran}
                      </p>

                      <p className="text-xs text-neutral-500">
                        Rp {p.jumlah?.toLocaleString()}
                      </p>

                    </div>

                    {/* STATUS */}

                    <div>

                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${badge(
                          p.status
                        )}`}
                      >

                        {p.status}

                      </span>

                    </div>

                    {/* ACTION */}

                    <div className="flex items-center gap-3">

                      {p.bukti_pembayaran && (

                        <a
                          href={`${API}${p.bukti_pembayaran}`}
                          target="_blank"
                          className="text-xs underline text-neutral-500"
                        >

                          Lihat Bukti

                        </a>

                      )}

                      {p.status === "pending" && (
                        <>
                          <button
                            onClick={() => verify(p._id)}
                            className="text-xs px-3 py-1 rounded-md bg-emerald-600 text-white hover:opacity-90"
                          >
                            Verify
                          </button>

                          <button
                            onClick={() => reject(p._id)}
                            className="text-xs px-3 py-1 rounded-md bg-red-600 text-white hover:opacity-90"
                          >
                            Reject
                          </button>
                        </>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-sm">

      <p className="text-sm text-neutral-500">
        {title}
      </p>

      <p className="text-2xl font-semibold mt-2">
        {value}
      </p>

    </div>

  );

}