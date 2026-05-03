"use client";

import { useState } from "react";
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
  /* ================= FILTER MODE ================= */

  const [useFilter, setUseFilter] = useState(false);

  const [query, setQuery] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const { data } = useAdminDashboard(
    useFilter ? query : {}
  );

  if (!data) return <p>Loading...</p>;

  /* ================= SUMMARY ================= */

  const summary = [
    {
      label: "Revenue",
      value: `Rp ${data.totalRevenue.toLocaleString()}`,
    },
    { label: "Total Ticket", value: data.totalTicket },
    { label: "Pending Ticket", value: data.pendingTicket },
    { label: "Payment Pending", value: data.paymentPending },
    { label: "Cashback Pending", value: data.pendingCashback },
  ];

  const pieData = Object.keys(data.ticketStatus).map((key) => ({
    name: key,
    value: data.ticketStatus[key],
  }));

  /* ================= UI ================= */

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Dashboard Admin</h1>

      {/* 🔥 FILTER */}
      <div className="flex gap-3 items-center">

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useFilter}
            onChange={(e) => setUseFilter(e.target.checked)}
          />
          Filter Bulan
        </label>

        {useFilter && (
          <>
            <select
              value={query.month}
              onChange={(e) =>
                setQuery({
                  ...query,
                  month: Number(e.target.value),
                })
              }
              className="border p-2"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>
                  Bulan {i + 1}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={query.year}
              onChange={(e) =>
                setQuery({
                  ...query,
                  year: Number(e.target.value),
                })
              }
              className="border p-2 w-[100px]"
            />
          </>
        )}
      </div>

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
          <h2 className="font-bold mb-4">
            Revenue {useFilter ? "(Filtered)" : "(All)"}
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.revenueChart}>
              <XAxis dataKey="day" />
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
              <Pie data={pieData} dataKey="value">
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