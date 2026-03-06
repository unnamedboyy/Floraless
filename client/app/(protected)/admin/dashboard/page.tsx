"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooking: 0,
    pending: 0,
    approved: 0,
    layanan: 0,
  });

  useEffect(() => {
    async function load() {
      try {
        const tickets = await apiFetch("/ticket");
        const layanan = await apiFetch("/layanan");

        const pending = tickets.filter(
          (t: any) => t.status === "pending"
        ).length;

        const approved = tickets.filter(
          (t: any) => t.status === "approved"
        ).length;

        setStats({
          totalBooking: tickets.length,
          pending,
          approved,
          layanan: layanan.length,
        });
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  return (

    <div className="bg-neutral-100 min-h-screen">
      <AdminNavbar />
      <div className="grid gap-6 md:grid-cols-4 p-10">
        {/* TOTAL BOOKING */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <p className="text-sm text-neutral-500">
            Total Booking
          </p>

          <h2 className="text-2xl font-semibold mt-2">
            {stats.totalBooking}
          </h2>

        </div>

        {/* PENDING */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <p className="text-sm text-neutral-500">
            Pending Booking
          </p>

          <h2 className="text-2xl font-semibold mt-2">
            {stats.pending}
          </h2>

        </div>

        {/* APPROVED */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <p className="text-sm text-neutral-500">
            Approved Booking
          </p>

          <h2 className="text-2xl font-semibold mt-2">
            {stats.approved}
          </h2>

        </div>

        {/* LAYANAN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <p className="text-sm text-neutral-500">
            Total Layanan
          </p>

          <h2 className="text-2xl font-semibold mt-2">
            {stats.layanan}
          </h2>

        </div>

        {/* CHART PLACEHOLDER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm col-span-2">

          <h3 className="font-semibold mb-4">
            Aktivitas Booking
          </h3>

          <div className="h-40 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400">
            Chart Coming Soon
          </div>

        </div>

        {/* UPCOMING EVENTS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm col-span-2">

          <h3 className="font-semibold mb-4">
            Booking Terbaru
          </h3>

          <div className="text-sm text-neutral-500">
            Data booking terbaru akan muncul di sini
          </div>

        </div>

      </div> 
    </div>


  );
}