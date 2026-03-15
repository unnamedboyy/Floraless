"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

type Ticket = {
  _id: string;
  status: string;
  info_acara?: string;
  createdAt: string;

  pelanggan?: {
    _id: string;
    username?: string;
  } | null;

  layanan?: {
    _id: string;
    nama_layanan?: string;
    harga?: number;
  } | null;
};

export default function AdminTicketsPage() {

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [selected, setSelected] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);

  async function load() {

    setLoading(true);

    const res = await fetch(`${API}/ticket`, {
      credentials: "include",
    });

    const data = await res.json();

    setTickets(data);
    setLoading(false);

  }

  useEffect(() => {
    load();
  }, []);

  /* =======================
     SEARCH + FILTER
  ======================= */

  const filtered = useMemo(() => {

    return tickets.filter((t) => {

      const username =
        t.pelanggan?.username?.toLowerCase() || "";

      const layanan =
        t.layanan?.nama_layanan?.toLowerCase() || "";

      const matchSearch =
        username.includes(search.toLowerCase()) ||
        layanan.includes(search.toLowerCase());

      const matchFilter =
        filter === "all" ? true : t.status === filter;

      return matchSearch && matchFilter;

    });

  }, [tickets, search, filter]);

  /* =======================
     METRICS
  ======================= */

  const metrics = useMemo(() => {

    return {
      pending: tickets.filter((t) => t.status === "pending").length,
      approved: tickets.filter((t) => t.status === "approved").length,
      rejected: tickets.filter((t) => t.status === "rejected").length,
    };

  }, [tickets]);

  /* =======================
     UPDATE STATUS
  ======================= */

  async function updateStatus(id: string, status: string) {

    await fetch(`${API}/ticket/${id}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    load();

  }

  /* =======================
     OPEN DETAIL
  ======================= */

  async function openDetail(ticket: Ticket) {

    setSelected(ticket);

    const res = await fetch(`${API}/ticket/${ticket._id}`, {
      credentials: "include",
    });

    const data = await res.json();

    setDetail(data);

  }

  /* =======================
     STATUS BADGE
  ======================= */

  function badge(status: string) {

    switch (status) {

      case "approved":
        return "bg-emerald-50 text-emerald-600";

      case "pending":
        return "bg-amber-50 text-amber-600";

      case "rejected":
        return "bg-red-50 text-red-600";

      default:
        return "bg-neutral-100 text-neutral-600";

    }

  }

  return (

    <div className="bg-neutral-100 min-h-screen">
      <div className="p-10 space-y-10">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-semibold">
            Ticket Management
          </h1>

          <p className="text-sm text-neutral-500 mt-2">
            Monitor dan kelola semua pemesanan pelanggan
          </p>

        </div>

        {/* METRICS */}

        <div className="grid grid-cols-3 gap-6">

          <Metric title="Pending Booking" value={metrics.pending} />

          <Metric title="Approved Booking" value={metrics.approved} />

          <Metric title="Rejected Booking" value={metrics.rejected} />

        </div>

        {/* TABLE CARD */}

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">

          {/* SEARCH + FILTER */}

          <div className="flex items-center gap-4">

            <div className="relative flex-1">

              <Search
                size={16}
                className="absolute left-3 top-3 text-neutral-400"
              />

              <input
                placeholder="Search username atau layanan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-neutral-200 rounded-lg pl-9 pr-4 py-2 text-sm"
              />

            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-neutral-200 rounded-lg px-4 py-2 text-sm"
            >

              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>

            </select>

          </div>

          {/* TABLE HEADER */}

          <div className="grid grid-cols-12 text-xs uppercase tracking-widest text-neutral-400 border-b pb-3">

            <div className="col-span-3">User</div>
            <div className="col-span-3">Layanan</div>
            <div className="col-span-2">Harga</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Action</div>

          </div>

          {/* LIST */}

          {loading ? (

            <p className="text-neutral-500">Loading...</p>

          ) : (

            <div className="divide-y">

              {filtered.map((t) => (

                <div
                  key={t._id}
                  className="grid grid-cols-12 items-center py-4 hover:bg-neutral-50"
                >

                  <div className="col-span-3 font-medium">
                    {t.pelanggan?.username || "Unknown"}
                  </div>

                  <div className="col-span-3">
                    {t.layanan?.nama_layanan}
                  </div>

                  <div className="col-span-2 text-sm text-neutral-600">
                    Rp {t.layanan?.harga?.toLocaleString() || "-"}
                  </div>

                  <div className="col-span-2">

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${badge(
                        t.status
                      )}`}
                    >
                      {t.status}
                    </span>

                  </div>

                  <div className="col-span-2 flex justify-end gap-2">

                    {t.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(t._id, "approved")
                          }
                          className="text-xs px-3 py-1 rounded-md bg-emerald-600 text-white"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(t._id, "rejected")
                          }
                          className="text-xs px-3 py-1 rounded-md bg-red-600 text-white"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => openDetail(t)}
                      className="text-xs px-3 py-1 border rounded-md"
                    >
                      Detail
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* MODAL */}

      {selected && detail && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white rounded-2xl p-8 w-full max-w-xl space-y-5 shadow-xl">

            <h2 className="text-xl font-semibold">
              Ticket Detail
            </h2>

            <div className="space-y-2 text-sm">

              <p>
                <span className="text-neutral-500">User</span>
                <br />
                {detail.ticket.pelanggan?.username}
              </p>

              <p>
                <span className="text-neutral-500">Layanan</span>
                <br />
                {detail.ticket.layanan?.nama_layanan}
              </p>

              <p>
                <span className="text-neutral-500">Status</span>
                <br />
                {detail.ticket.status}
              </p>

              <p>
                <span className="text-neutral-500">Info Acara</span>
                <br />
                {detail.ticket.info_acara || "-"}
              </p>

            </div>

            <div className="flex justify-end pt-4">

              <button
                onClick={() => {
                  setSelected(null);
                  setDetail(null);
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

/* METRIC CARD */

function Metric({
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