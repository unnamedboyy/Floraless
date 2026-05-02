"use client";

import { useAdminDashboard } from "@/hooks/useDashboard";

export default function AdminDashboardPage() {
  const { data, loading } = useAdminDashboard();

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!data) {
    return <div>Gagal mengambil data</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Total User" value={data.totalUser} />
        <Card title="Total Ticket" value={data.totalTicket} />
        <Card title="Pending Ticket" value={data.pendingTicket} />
        <Card title="Completed Ticket" value={data.completedTicket} />
        <Card title="Pending Cashback" value={data.pendingCashback} />
        <Card title="Approved Cashback" value={data.approvedCashback} />
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