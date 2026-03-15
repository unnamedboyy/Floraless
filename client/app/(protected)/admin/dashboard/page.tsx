"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import AdminNavbar from "@/components/AdminNavbar";
import CalendarView from "@/components/calendar/CalendarView";

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    totalBooking: 0,
    pending: 0,
    approved: 0,
    layanan: 0,
  });

  const [recentTickets, setRecentTickets] = useState<any[]>([]);

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

        setRecentTickets(tickets.slice(0,5));

      } catch (err) {

        console.error(err);

      }

    }

    load();

  }, []);

  return (

    <div className="bg-neutral-100 min-h-screen">

      <AdminNavbar />

      <div className="p-10 space-y-8">

        {/* STATS */}

        <div className="grid gap-6 md:grid-cols-4">

          <StatCard
            title="Total Booking"
            value={stats.totalBooking}
          />

          <StatCard
            title="Pending Booking"
            value={stats.pending}
          />

          <StatCard
            title="Approved Booking"
            value={stats.approved}
          />

          <StatCard
            title="Total Layanan"
            value={stats.layanan}
          />

        </div>

        {/* MAIN DASHBOARD */}

        <div className="grid md:grid-cols-3 gap-6">

          {/* CALENDAR */}

          <div className="bg-white rounded-2xl shadow-sm p-6 md:col-span-2">

            <h3 className="font-semibold mb-6">
              Event Calendar
            </h3>

            <CalendarView role="admin" />

          </div>

          {/* RECENT BOOKINGS */}

          <div className="bg-white rounded-2xl shadow-sm p-6">

            <h3 className="font-semibold mb-6">
              Recent Bookings
            </h3>

            <div className="space-y-4">

              {recentTickets.map((t: any) => (

                <div
                  key={t._id}
                  className="border-b pb-3"
                >

                  <p className="font-medium text-sm">
                    {t.pelanggan?.username || "User"}
                  </p>

                  <p className="text-xs text-neutral-500">
                    {t.layanan?.nama_layanan}
                  </p>

                  <p className="text-xs text-neutral-400">
                    {new Date(
                      t.createdAt
                    ).toLocaleDateString("id-ID")}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

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

      <h2 className="text-2xl font-semibold mt-2">
        {value}
      </h2>

    </div>

  );

}