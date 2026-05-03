"use client";

import { useAdminDashboard } from "@/hooks/useDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboardPage() {
  const { data } = useAdminDashboard();

  if (!data) return <p>Loading...</p>;

  const summary = [
    { label: "Revenue", value: `Rp ${data.totalRevenue.toLocaleString()}` },
    { label: "Total Ticket", value: data.totalTicket },
    { label: "Pending Ticket", value: data.pendingTicket },
    { label: "Payment Pending", value: data.paymentPending },
    { label: "Cashback Pending", value: data.pendingCashback },
  ];

  const pieData = Object.keys(data.ticketStatus).map((key) => ({
    name: key,
    value: data.ticketStatus[key],
  }));

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Dashboard Admin</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-5 gap-4">
        {summary.map((item, i) => (
          <div key={i} className="p-4 bg-white shadow rounded">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="grid grid-cols-2 gap-6">

        {/* REVENUE */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-bold mb-4">Revenue</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.revenueChart}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* STATUS */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-bold mb-4">Ticket Status</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name">
                {pieData.map((_, i) => (
                  <Cell key={i} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}