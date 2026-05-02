"use client";

import { usePegawaiDashboard } from "@/hooks/useDashboard";

export default function PegawaiDashboardPage() {
  const { data, loading } = usePegawaiDashboard();

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!data) {
    return <div>Gagal mengambil data</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pegawai Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Assigned Ticket" value={data.assignedTicket} />
        <Card title="In Progress" value={data.inProgress} />
        <Card title="Completed" value={data.completed} />
        <Card title="Today Schedule" value={data.todaySchedule} />
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-semibold">{value ?? 0}</p>
    </div>
  );
}