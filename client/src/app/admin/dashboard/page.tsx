"use client";

import { useMemo } from "react";

import { useDashboard } from "@/hooks/useDashboard";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  CalendarDays,
  Wallet,
  Ticket,
  Clock3,
  ArrowUpRight,
  TrendingUp,
  CircleDollarSign,
  CheckCircle2,
  AlertCircle,
  Users,
  Sparkles,
} from "lucide-react";

/* =====================================================
   HELPERS
===================================================== */

// Ambil array dari semua kemungkinan field name yang mungkin dikembalikan API
function resolveArray(data: any, ...keys: string[]): any[] | null {
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return null;
}

// Ambil nilai numerik dari object dengan beberapa kemungkinan field
function resolveNum(obj: any, ...keys: string[]): number {
  for (const key of keys) {
    const v = obj?.[key];
    if (typeof v === "number") return v;
  }
  return 0;
}

const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","Mei","Jun",
  "Jul","Agu","Sep","Okt","Nov","Des",
];

function buildMonthSlots(count = 12) {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
    return { month: MONTH_NAMES[d.getMonth()], _monthIdx: d.getMonth(), _year: d.getFullYear() };
  });
}

/* =====================================================
   COMPONENT
===================================================== */

export default function AdminDashboardPage() {

  /* =========================================
     FETCH DASHBOARD
  ========================================= */

  const { data } = useDashboard("admin");

  /* =========================================
     PIE DATA — PB-092: ticket per status
  ========================================= */

  const pieData = Object.keys(
    data?.ticketStatus || {}
  ).map((key) => ({
    name: key,
    value: data?.ticketStatus?.[key] || 0,
  }));

  const pieColors = [
    "#0f172a", "#1e293b", "#334155", "#64748b", "#94a3b8",
  ];

  /* =========================================
     MONTHLY ORDER CHART — PB-093
     Mencoba semua kemungkinan field array dari API
  ========================================= */

  const monthlyOrderChart = useMemo(() => {
    const slots = buildMonthSlots(12);

    // Coba semua nama field array yang mungkin ada
    const source = resolveArray(
      data,
      "monthlyOrders",
      "ticketChart",
      "monthlyTickets",
      "orderChart",
      "revenueChart",   // fallback terakhir, pakai field ticket-nya
    );

    return slots.map((slot, i) => ({
      month: slot.month,
      pesanan: source
        ? resolveNum(
            source[i],
            "totalOrders", "pesanan", "totalTicket",
            "ticket", "completed", "count", "total"
          )
        : 0,
    }));
  }, [data]);

  /* =========================================
     MONTHLY REVENUE CHART — PB-094
  ========================================= */

  const monthlyRevenueChart = useMemo(() => {
    const slots = buildMonthSlots(12);

    const source = resolveArray(
      data,
      "revenueChart",
      "monthlyRevenue",
      "paymentChart",
      "monthlyOrders",   // fallback
    );

    return slots.map((slot, i) => ({
      month: slot.month,
      pendapatan: source
        ? resolveNum(
            source[i],
            "totalRevenue", "revenue", "totalPayment",
            "payment", "amount", "total"
          )
        : 0,
    }));
  }, [data]);

  /* =========================================
     SUMMARY — PB-091, PB-092
  ========================================= */

  const summary = [
    {
      title: "Total Revenue",
      value: `Rp ${(
        resolveNum(data, "totalRevenue", "revenue", "total")
      ).toLocaleString("id-ID")}`,
      icon: CircleDollarSign,
      color: "from-emerald-500 to-green-400",
    },
    {
      title: "Total Pelanggan",   // PB-091
      value: resolveNum(data, "totalPelanggan", "pelanggan", "customers"),
      icon: Users,
      color: "from-sky-500 to-cyan-400",
    },
    {
      title: "Total Ticket",      // PB-092
      value: resolveNum(data, "totalTicket", "ticket", "tickets"),
      icon: Ticket,
      color: "from-indigo-500 to-blue-400",
    },
    {
      title: "Pending Ticket",
      value: resolveNum(data, "pendingTicket", "ticketPending"),
      icon: Clock3,
      color: "from-amber-500 to-yellow-400",
    },
    {
      title: "Cashback Pending",
      value: resolveNum(data, "pendingCashback", "cashbackPending"),
      icon: Wallet,
      color: "from-violet-500 to-purple-400",
    },
  ];

  /* =========================================
     RECENT TICKETS — PB-090
  ========================================= */

  const recentTickets: any[] =
    resolveArray(data, "recentTickets", "latestTickets", "tickets") ?? [];

  /* =========================================
     STATUS BADGE HELPER
  ========================================= */

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending:     "bg-gray-100 text-gray-700",
      approved:    "bg-yellow-50 text-yellow-700",
      in_progress: "bg-blue-50 text-blue-700",
      done:        "bg-emerald-50 text-emerald-700",
      rejected:    "bg-red-50 text-red-700",
    };
    return map[status] ?? "bg-neutral-100 text-neutral-700";
  };

  /* =========================================
     LOADING
  ========================================= */

  if (!data) {
    return (
      <div className="p-10 text-neutral-500">
        Loading dashboard...
      </div>
    );
  }

  /* =========================================
     DATE
  ========================================= */

  const today = new Date();

  const currentMonth = today.toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });

  /* =========================================
     ACTIVITY SUMMARY — derived dari data real
     PB-092: persentase per status ticket
  ========================================= */

  const totalAllTickets = pieData.reduce((acc, item) => acc + item.value, 0);

  const doneCount     = data?.ticketStatus?.done ?? 0;
  const approvedCount = (data?.ticketStatus?.approved ?? 0) + (data?.ticketStatus?.in_progress ?? 0);

  const pctDone     = totalAllTickets > 0 ? Math.round((doneCount / totalAllTickets) * 100) : 0;
  const pctApproved = totalAllTickets > 0 ? Math.round((approvedCount / totalAllTickets) * 100) : 0;

  const totalCashback  = resolveNum(data, "totalCashback", "cashback");
  const pendingCashback = resolveNum(data, "pendingCashback", "cashbackPending");
  const pctPendingCashback = totalCashback > 0
    ? Math.round((pendingCashback / totalCashback) * 100)
    : 0;

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6">

      {/* =========================================
         HEADER
      ========================================= */}

      <div className="
        mb-8
        flex
        flex-col
        gap-5
        lg:flex-row
        lg:items-center
        lg:justify-between
      ">
        <div>
          <p className="text-sm tracking-[0.3em] text-neutral-400 uppercase">
            Dashboard Admin
          </p>
          <h1 className="
            mt-2
            text-4xl
            font-bold
            tracking-tight
            text-neutral-900
          ">
            Monitoring Operasional Floraless
          </h1>
          <p className="mt-3 text-neutral-500">
            Ringkasan performa bisnis, ticket, pembayaran, dan aktivitas terbaru.
          </p>
        </div>
      </div>

      {/* =========================================
         SUMMARY CARDS — PB-091, PB-092
      ========================================= */}

      <div className="
        grid
        gap-5
        md:grid-cols-2
        xl:grid-cols-5
      ">
        {summary.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="
                relative
                overflow-hidden
                rounded-[32px]
                bg-white
                p-6
                shadow-sm
              "
            >
              <div className={`
                absolute
                right-0
                top-0
                h-28
                w-28
                rounded-full
                bg-gradient-to-br
                opacity-10
                blur-2xl
                ${item.color}
              `} />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">{item.title}</p>
                  <h3 className="mt-3 text-2xl font-bold text-neutral-900">
                    {item.value}
                  </h3>
                </div>
                <div className={`
                  flex h-14 w-14 items-center justify-center
                  rounded-2xl bg-gradient-to-br text-white
                  ${item.color}
                `}>
                  <Icon size={24} />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-emerald-600">
                <TrendingUp size={16} />
                Data real-time
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================
         MAIN GRID
      ========================================= */}

      <div className="
        mt-8
        grid
        gap-6
        xl:grid-cols-12
      ">

        {/* LEFT ================================= */}

        <div className="space-y-6 xl:col-span-8">

          {/* =========================================
             GRAFIK PESANAN PER BULAN — PB-093
          ========================================= */}

          <div className="rounded-[32px] bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  Statistik Pesanan Bulanan
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Jumlah pesanan/ticket masuk per bulan
                </p>
              </div>
              <div className="
                flex items-center gap-2 rounded-full
                bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600
              ">
                <Ticket size={16} />
                Pesanan
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyOrderChart}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: any) => [v, "Pesanan"]} />
                <Bar dataKey="pesanan" radius={[10, 10, 0, 0]} fill="#1e40af" />
              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* =========================================
             GRAFIK PENDAPATAN PER BULAN — PB-094
          ========================================= */}

          <div className="rounded-[32px] bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">
                  Pendapatan Bulanan
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Total pembayaran yang diterima per bulan
                </p>
              </div>
              <div className="
                flex items-center gap-2 rounded-full
                bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600
              ">
                <ArrowUpRight size={16} />
                Revenue
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenueChart}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) =>
                    v >= 1_000_000
                      ? `${(v / 1_000_000).toFixed(0)}jt`
                      : String(v)
                  }
                />
                <Tooltip
                  formatter={(v: any) => [
                    `Rp ${Number(v).toLocaleString("id-ID")}`,
                    "Pendapatan",
                  ]}
                />
                <Bar dataKey="pendapatan" radius={[10, 10, 0, 0]} fill="#111827" />
              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* =========================================
             ON GOING TICKET + ROADMAP
          ========================================= */}

          <div className="grid gap-6 lg:grid-cols-2">

            {/* ON GOING TICKET — PB-090 */}

            <div className="rounded-[32px] bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">On going Ticket</h2>
                <Sparkles size={18} className="text-amber-500" />
              </div>

              {recentTickets.length === 0 ? (
                <p className="text-sm text-neutral-400">Belum ada ticket aktif.</p>
              ) : (
                <div className="space-y-4">
                  {recentTickets.map((ticket: any, i: number) => (
                    <div
                      key={ticket._id ?? i}
                      className="
                        flex items-center justify-between
                        rounded-2xl border border-neutral-100 p-4
                      "
                    >
                      <div>
                        <h3 className="font-medium text-neutral-900">
                          {ticket.layananId?.nama ||
                            ticket.detail?.nama_acara ||
                            ticket.nama_acara ||
                            `Ticket #${i + 1}`}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-500">
                          {ticket.createdAt
                            ? new Date(ticket.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : ticket.pelangganId?.nama || "-"}
                        </p>
                      </div>
                      <span className={`
                        rounded-full px-3 py-1 text-xs font-medium
                        ${statusBadge(ticket.status)}
                      `}>
                        {ticket.status ?? "-"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* PROGRESS ROADMAP */}

            <div className="rounded-[32px] bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-xl font-semibold">Progress Roadmap</h2>

              <div className="space-y-5">
                {[
                  "Konfirmasi booking pelanggan",
                  "Verifikasi pembayaran DP",
                  "Persiapan dekorasi venue",
                  "Pelaksanaan acara",
                  "Finalisasi dokumentasi",
                ].map((item, i, arr) => (
                  <div key={i} className="flex gap-4">

                    <div className="flex flex-col items-center">
                      <div className="
                        flex h-8 w-8 items-center justify-center
                        rounded-full bg-neutral-900 text-white
                      ">
                        <CheckCircle2 size={16} />
                      </div>
                      {i !== arr.length - 1 && (
                        <div className="h-full w-px bg-neutral-200" />
                      )}
                    </div>

                    <div className="pb-8">
                      <h3 className="font-medium text-neutral-900">{item}</h3>
                      <p className="mt-1 text-sm text-neutral-500">
                        Progress operasional dan workflow event.
                      </p>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT ================================ */}

        <div className="space-y-6 xl:col-span-4">

          {/* CALENDAR */}

          <div className="
            rounded-[32px]
            bg-gradient-to-br from-[#111827] to-[#1f2937]
            p-7 text-white shadow-sm
          ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Calendar</p>
                <h2 className="mt-2 text-2xl font-semibold">{currentMonth}</h2>
              </div>
              <CalendarDays size={30} className="text-white/80" />
            </div>

            <div className="mt-8 grid grid-cols-7 gap-3 text-center">
              {["S","S","R","K","J","S","M"].map((d, i) => (
                <div key={`${d}-${i}`} className="text-xs text-white/50">{d}</div>
              ))}
              {[...Array(31)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    flex h-10 items-center justify-center rounded-xl text-sm
                    ${i + 1 === today.getDate()
                      ? "bg-white text-black font-semibold"
                      : "bg-white/5 text-white/70"}
                  `}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* PIE: TICKET PER STATUS — PB-092 */}

          <div className="rounded-[32px] bg-white p-6 shadow-sm">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Ticket per Status</h2>
              <AlertCircle size={18} className="text-neutral-400" />
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-3">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ background: pieColors[i % pieColors.length] }}
                    />
                    <span className="text-sm text-neutral-600 capitalize">
                      {item.name.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>

          </div>

          {/* ACTIVITY SUMMARY */}

          <div className="rounded-[32px] bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-xl font-semibold">Activity Summary</h2>

            <div className="space-y-5">

              {[
                { label: "Ticket Selesai",  pct: pctDone,            color: "bg-neutral-900" },
                { label: "Ticket Diproses", pct: pctApproved,        color: "bg-emerald-500" },
                { label: "Cashback Pending",pct: pctPendingCashback, color: "bg-amber-500"   },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-neutral-100">
                    <div
                      className={`h-3 rounded-full transition-all ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}