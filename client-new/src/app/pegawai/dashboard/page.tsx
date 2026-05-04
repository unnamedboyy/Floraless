"use client";

import { useDashboard } from "@/hooks/useDashboard";

export default function PegawaiDashboardPage() {
  const { data } = useDashboard("pegawai");

  if (!data) return <p>Loading...</p>;

  const cards = [
    { label: "Assigned Ticket", value: data.assigned },
    { label: "In Progress", value: data.inProgress },
    { label: "Completed", value: data.completed },
    { label: "Today Schedule", value: data.todaySchedule },
  ];

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Dashboard Pegawai</h1>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="p-4 bg-white shadow rounded">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

    </div>
  );
}