"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import { Search, Clock } from "lucide-react";
import TicketDetailModal from "@/components/TicketDetailModal";
import TestimoniModal from "@/components/TestimoniModal";

type TicketType = {
  _id: string;
  layanan?: {
    nama_layanan?: string;
    gambar?: string;
  };
  info_acara?: string;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "fully_paid"
    | "selesai";
  createdAt?: string;
  tanggal_acara?: string;
};

export default function UserTicketsPage() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [layananFilter, setLayananFilter] = useState("all");

  const [offset, setOffset] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [testimoniTicket, setTestimoniTicket] = useState<string | null>(null);

  async function loadTickets() {
    try {
      const data = await apiFetch("/ticket/user/my");
      setTickets(data);
      setFilteredTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let result = [...tickets];

    if (search) {
      result = result.filter(
        (t) =>
          t.layanan?.nama_layanan
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          t.info_acara?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (layananFilter !== "all") {
      result = result.filter(
        (t) => t.layanan?.nama_layanan === layananFilter
      );
    }

    setFilteredTickets(result);
  }, [search, statusFilter, layananFilter, tickets]);

  function statusBadge(status: string) {
    switch (status) {
      case "approved":
        return "text-emerald-600";
      case "pending":
        return "text-amber-600";
      case "rejected":
        return "text-red-600";
      case "fully_paid":
        return "text-blue-600";
      case "selesai":
        return "text-neutral-700";
      default:
        return "text-neutral-500";
    }
  }

  function statusText(status: string) {
    switch (status) {
      case "approved":
        return "Disetujui";
      case "pending":
        return "Menunggu";
      case "rejected":
        return "Ditolak";
      case "fully_paid":
        return "Lunas";
      case "selesai":
        return "Selesai";
      default:
        return status;
    }
  }

  const layananOptions = [
    ...new Set(tickets.map((t) => t.layanan?.nama_layanan)),
  ];

  return (
    <div className="bg-white">

      {/* HERO */}
      {/* <section className="relative h-[420px] overflow-hidden">

        <div
          className="absolute inset-0 scale-110"
          style={{ transform: `translateY(${offset * 0.35}px)` }}
        >
          <Image
            src="/hero.jpg"
            alt="Tickets"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div className="max-w-3xl">

            <p className="text-white/70 tracking-[0.35em] text-xs mb-4">
              FLORALESS EVENT
            </p>

            <h1 className="text-4xl md:text-5xl font-semibold text-white">
              Riwayat Pesanan
            </h1>

            <p className="mt-6 text-white/80 text-sm">
              Pantau semua booking acara Anda secara transparan.
            </p>

          </div>
        </div>

      </section> */}

      {/* HERO PARALLAX */}
      <section className="relative h-[520px] w-full overflow-hidden">

        <div
          className="absolute inset-0 scale-110"
          style={{
            transform: `translateY(${offset * 0.35}px)`
          }}
        >
          <Image
            src="/hero.jpg"
            alt="Contact Floraless"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight tracking-tight">
            Transaksi Anda
          </h1>
        </div>

      </section>

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">

          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-3 text-neutral-400"
            />

            <input
              placeholder="Cari layanan atau deskripsi acara..."
              className="w-full border border-neutral-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-neutral-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border border-neutral-200 rounded-full px-4 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
            <option value="fully_paid">Lunas</option>
            <option value="selesai">Selesai</option>
          </select>

          <select
            className="border border-neutral-200 rounded-full px-4 py-2 text-sm"
            value={layananFilter}
            onChange={(e) => setLayananFilter(e.target.value)}
          >
            <option value="all">Semua Layanan</option>

            {layananOptions.map((l, i) => (
              <option key={i} value={l}>
                {l}
              </option>
            ))}

          </select>

        </div>

        {/* LIST HEADER */}
        <div className="hidden md:grid grid-cols-12 text-xs text-neutral-400 pb-3 border-b mb-2">
          <div className="col-span-5">Layanan</div>
          <div className="col-span-3">Tanggal Dibuat</div>
          <div className="col-span-2 text-right">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* LIST */}
        <div>

          {loading && (
            <p className="text-neutral-400 text-sm">
              Memuat data pesanan...
            </p>
          )}

          {!loading && filteredTickets.length === 0 && (
            <div className="text-center py-16 text-neutral-400">
              Anda belum memiliki pesanan.
            </div>
          )}

          {filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              className="grid md:grid-cols-12 gap-4 items-center py-6 border-b border-neutral-200 hover:bg-neutral-50 transition"
            >

              {/* LAYANAN */}
              <div
                className="md:col-span-5 cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <p className="font-medium">
                  {ticket.layanan?.nama_layanan || "Booking Acara"}
                </p>

                <p className="text-sm text-neutral-500">
                  ID #{ticket._id.slice(-6)}
                </p>
              </div>

              {/* TANGGAL */}
              <div className="md:col-span-3 flex items-center gap-2 text-neutral-500 text-sm">

                <Clock size={14} />

                {ticket.createdAt &&
                  new Date(ticket.createdAt).toLocaleDateString("id-ID")}

              </div>

              {/* STATUS */}
              <div className="md:col-span-2 text-right">

                <span
                  className={`text-sm font-medium ${statusBadge(
                    ticket.status
                  )}`}
                >
                  {statusText(ticket.status)}
                </span>

              </div>

              {/* ACTION */}
              <div className="md:col-span-2 text-right">

                {ticket.status === "fully_paid" && (
                  <button
                    onClick={() => setTestimoniTicket(ticket._id)}
                    className="text-xs px-3 py-1 bg-[#C9AE63] text-white rounded-full hover:opacity-90"
                  >
                    Berikan Testimoni
                  </button>
                )}

                {ticket.status === "selesai" && (
                  <span className="text-xs text-neutral-400">
                    Testimoni terkirim
                  </span>
                )}

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* DETAIL MODAL */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      {/* TESTIMONI MODAL */}
      {testimoniTicket && (
        <TestimoniModal
          ticketId={testimoniTicket}
          onClose={() => setTestimoniTicket(null)}
          onSuccess={loadTickets}
        />
      )}

    </div>
  );
}