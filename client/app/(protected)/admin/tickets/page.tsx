"use client";

import { useEffect, useMemo, useState } from "react";

type Ticket = {
  _id: string;
  status: string;
  info_acara?: string;
  createdAt: string;
  pelanggan: {
    _id: string;
    nama: string;
    username: string;
  };
  layanan: {
    _id: string;
    nama_layanan: string;
    harga: number;
  };
  admin?: {
    _id: string;
    username: string;
  };
};

export default function AdminTicketsPage() {
  const API = process.env.NEXT_PUBLIC_API_URL;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Ticket | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch(`${API}/ticket_pemesanan`, {
      credentials: "include",
    });
    const data = await res.json();
    setTickets(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        t.pelanggan.username
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        t.layanan.nama_layanan
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchFilter =
        filter === "all" ? true : t.status === filter;

      return matchSearch && matchFilter;
    });
  }, [tickets, search, filter]);

  const metrics = useMemo(() => {
    return {
      pending: tickets.filter((t) => t.status === "pending").length,
      approved: tickets.filter((t) => t.status === "approved").length,
      rejected: tickets.filter((t) => t.status === "rejected").length,
      done: tickets.filter((t) => t.status === "done").length,
    };
  }, [tickets]);

  async function updateStatus(id: string, status: string) {
    await fetch(`${API}/ticket_pemesanan/${id}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    load();
  }

  function badgeColor(status: string) {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "done":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  }

  return (
    <div className="p-8 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Ticket Management
        </h1>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-4 gap-4">
        <Metric title="Pending" value={metrics.pending} />
        <Metric title="Approved" value={metrics.approved} />
        <Metric title="Rejected" value={metrics.rejected} />
        <Metric title="Done" value={metrics.done} />
      </div>

      {/* FILTER */}
      <div className="flex gap-4">
        <input
          placeholder="Search username / layanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((t) => (
            <div
              key={t._id}
              className="border rounded-2xl p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {t.layanan.nama_layanan}
                </h3>

                <p className="text-sm text-neutral-500">
                  User: {t.pelanggan.username}
                </p>

                <p className="text-sm text-neutral-500">
                  Rp {t.layanan.harga.toLocaleString()}
                </p>

                <span
                  className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${badgeColor(
                    t.status
                  )}`}
                >
                  {t.status}
                </span>
              </div>

              <div className="flex gap-3">
                {t.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateStatus(t._id, "approved")
                      }
                      className="px-3 py-1 bg-green-600 text-white rounded-lg"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(t._id, "rejected")
                      }
                      className="px-3 py-1 bg-red-600 text-white rounded-lg"
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  onClick={() => setSelected(t)}
                  className="px-3 py-1 border rounded-lg"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DETAIL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-xl space-y-4">
            <h2 className="text-xl font-semibold">
              Ticket Detail
            </h2>

            <p>
              <strong>User:</strong>{" "}
              {selected.pelanggan.username}
            </p>

            <p>
              <strong>Layanan:</strong>{" "}
              {selected.layanan.nama_layanan}
            </p>

            <p>
              <strong>Status:</strong> {selected.status}
            </p>

            <p>
              <strong>Info Acara:</strong>{" "}
              {selected.info_acara || "-"}
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setSelected(null)}
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

function Metric({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="border rounded-xl p-4 text-center">
      <p className="text-sm text-neutral-500">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}