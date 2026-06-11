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
  CreditCard,
  Wallet,
  Ticket,
  Clock3,
  ArrowUpRight,
  TrendingUp,
  CircleDollarSign,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {

  /* =========================================
     FETCH DASHBOARD
  ========================================= */

  const { data } =
    useDashboard("admin");

  /* =========================================
     SUMMARY — PB-091, PB-092
  ========================================= */

  const summary = [
    {
      title: "Total Revenue",
      value: `Rp ${(
        data?.totalRevenue || 0
      ).toLocaleString("id-ID")}`,
      icon: CircleDollarSign,
      color: "from-emerald-500 to-green-400",
    },
    {
      // PB-091: kalkulasi jumlah pelanggan
      title: "Total Pelanggan",
      value: data?.totalPelanggan || 0,
      icon: Users,
      color: "from-sky-500 to-cyan-400",
    },
    {
      // PB-092: jumlah ticket (semua status)
      title: "Total Ticket",
      value: data?.totalTicket || 0,
      icon: Ticket,
      color: "from-indigo-500 to-blue-400",
    },
    {
      title: "Pending Ticket",
      value: data?.pendingTicket || 0,
      icon: Clock3,
      color: "from-amber-500 to-yellow-400",
    },
    {
      title: "Cashback Pending",
      value: data?.pendingCashback || 0,
      icon: Wallet,
      color: "from-violet-500 to-purple-400",
    },
  ];

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
    "#0f172a",
    "#1e293b",
    "#334155",
    "#64748b",
    "#94a3b8",
  ];

  /* =========================================
     MONTHLY ORDER CHART — PB-093
     Grafik statistik pesanan per bulan
  ========================================= */

  const monthlyOrderChart = useMemo(() => {

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];

    const now = new Date();

    const result = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return {
        month: monthNames[date.getMonth()],
        pesanan: 0,
      };
    });

    if (!Array.isArray(data?.monthlyOrders)) return result;

    data.monthlyOrders.forEach((item: any, index: number) => {
      if (result[index]) {
        result[index].pesanan =
          item?.totalOrders ??
          item?.pesanan ??
          item?.total ??
          0;
      }
    });

    return result;

  }, [data]);

  /* =========================================
     MONTHLY REVENUE CHART — PB-094
     Grafik pendapatan per bulan
  ========================================= */

  const monthlyRevenueChart = useMemo(() => {

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
    ];

    const now = new Date();

    const result = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return {
        month: monthNames[date.getMonth()],
        pendapatan: 0,
      };
    });

    if (!Array.isArray(data?.revenueChart)) return result;

    data.revenueChart.forEach((item: any, index: number) => {
      if (result[index]) {
        result[index].pendapatan =
          item?.totalRevenue ??
          item?.revenue ??
          item?.total ??
          0;
      }
    });

    return result;

  }, [data]);

  /* =========================================
     RECENT TICKETS — PB-090
  ========================================= */

  const recentTickets: any[] =
    data?.recentTickets || [];

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

  const totalAllTickets = pieData.reduce(
    (acc, item) => acc + item.value,
    0
  );

  const doneCount =
    data?.ticketStatus?.done ?? 0;

  const approvedCount =
    (data?.ticketStatus?.approved ?? 0) +
    (data?.ticketStatus?.in_progress ?? 0);

  const pctDone =
    totalAllTickets > 0
      ? Math.round((doneCount / totalAllTickets) * 100)
      : 0;

  const pctApproved =
    totalAllTickets > 0
      ? Math.round((approvedCount / totalAllTickets) * 100)
      : 0;

  const pctPendingCashback =
    (data?.totalCashback || 0) > 0
      ? Math.round(
          ((data?.pendingCashback || 0) / data.totalCashback) * 100
        )
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
         SUMMARY CARDS
         PB-091: Total Pelanggan
         PB-092: Total Ticket & Pending Ticket
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

              <div className="
                flex
                items-center
                justify-between
              ">

                <div>
                  <p className="text-sm text-neutral-500">
                    {item.title}
                  </p>
                  <h3 className="
                    mt-3
                    text-2xl
                    font-bold
                    text-neutral-900
                  ">
                    {item.value}
                  </h3>
                </div>

                <div className={`
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  text-white
                  ${item.color}
                `}>
                  <Icon size={24} />
                </div>

              </div>

              <div className="
                mt-6
                flex
                items-center
                gap-2
                text-sm
                text-emerald-600
              ">
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

        {/* =========================================
           LEFT
        ========================================= */}

        <div className="
          space-y-6
          xl:col-span-8
        ">

          {/* =========================================
             GRAFIK PESANAN PER BULAN — PB-093
          ========================================= */}

          <div className="
            rounded-[32px]
            bg-white
            p-6
            shadow-sm
          ">

            <div className="
              mb-6
              flex
              items-center
              justify-between
            ">

              <div>
                <h2 className="
                  text-xl
                  font-semibold
                  text-neutral-900
                ">
                  Statistik Pesanan Bulanan
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Jumlah pesanan/ticket masuk per bulan
                </p>
              </div>

              <div className="
                flex
                items-center
                gap-2
                rounded-full
                bg-blue-50
                px-4
                py-2
                text-sm
                font-medium
                text-blue-600
              ">
                <Ticket size={16} />
                Pesanan
              </div>

            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyOrderChart}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => [value, "Pesanan"]}
                />
                <Bar
                  dataKey="pesanan"
                  radius={[10, 10, 0, 0]}
                  fill="#1e40af"
                />
              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* =========================================
             GRAFIK PENDAPATAN PER BULAN — PB-094
          ========================================= */}

          <div className="
            rounded-[32px]
            bg-white
            p-6
            shadow-sm
          ">

            <div className="
              mb-6
              flex
              items-center
              justify-between
            ">

              <div>
                <h2 className="
                  text-xl
                  font-semibold
                  text-neutral-900
                ">
                  Pendapatan Bulanan
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Total pembayaran yang diterima per bulan
                </p>
              </div>

              <div className="
                flex
                items-center
                gap-2
                rounded-full
                bg-emerald-50
                px-4
                py-2
                text-sm
                font-medium
                text-emerald-600
              ">
                <ArrowUpRight size={16} />
                Revenue
              </div>

            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenueChart}>
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(v) =>
                    v >= 1_000_000
                      ? `${(v / 1_000_000).toFixed(0)}jt`
                      : v.toString()
                  }
                />
                <Tooltip
                  formatter={(value: any) => [
                    `Rp ${Number(value).toLocaleString("id-ID")}`,
                    "Pendapatan",
                  ]}
                />
                <Bar
                  dataKey="pendapatan"
                  radius={[10, 10, 0, 0]}
                  fill="#111827"
                />
              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* =========================================
             RECENT TICKETS — PB-090
          ========================================= */}

          <div className="
            rounded-[32px]
            bg-white
            p-6
            shadow-sm
          ">

            <div className="
              mb-6
              flex
              items-center
              justify-between
            ">

              <h2 className="text-xl font-semibold">
                Ticket Terbaru
              </h2>

              <Ticket
                size={18}
                className="text-neutral-400"
              />

            </div>

            {recentTickets.length === 0 ? (

              <p className="text-sm text-neutral-400">
                Belum ada ticket terbaru.
              </p>

            ) : (

              <div className="space-y-4">

                {recentTickets.map((ticket: any, i: number) => (
                  <div
                    key={ticket._id ?? i}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-neutral-100
                      p-4
                    "
                  >

                    <div>
                      <h3 className="font-medium text-neutral-900">
                        {ticket.layananId?.nama ||
                          ticket.nama_acara ||
                          `Ticket #${i + 1}`}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-500">
                        {ticket.pelangganId?.nama || "-"}
                        {ticket.createdAt && (
                          <>
                            {" · "}
                            {new Date(ticket.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </>
                        )}
                      </p>
                    </div>

                    <span className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${statusBadge(ticket.status)}
                    `}>
                      {ticket.status ?? "-"}
                    </span>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

        {/* =========================================
           RIGHT
        ========================================= */}

        <div className="
          space-y-6
          xl:col-span-4
        ">

          {/* =========================================
             CALENDAR
          ========================================= */}

          <div className="
            rounded-[32px]
            bg-gradient-to-br
            from-[#111827]
            to-[#1f2937]
            p-7
            text-white
            shadow-sm
          ">

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>
                <p className="text-sm text-white/60">Calendar</p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {currentMonth}
                </h2>
              </div>

              <CalendarDays size={30} className="text-white/80" />

            </div>

            <div className="
              mt-8
              grid
              grid-cols-7
              gap-3
              text-center
            ">

              {["S","S","R","K","J","S","M"].map((d, i) => (
                <div key={`${d}-${i}`} className="text-xs text-white/50">
                  {d}
                </div>
              ))}

              {[...Array(31)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    flex
                    h-10
                    items-center
                    justify-center
                    rounded-xl
                    text-sm
                    ${
                      i + 1 === today.getDate()
                        ? "bg-white text-black font-semibold"
                        : "bg-white/5 text-white/70"
                    }
                  `}
                >
                  {i + 1}
                </div>
              ))}

            </div>

          </div>

          {/* =========================================
             PIE: TICKET PER STATUS — PB-092
          ========================================= */}

          <div className="
            rounded-[32px]
            bg-white
            p-6
            shadow-sm
          ">

            <div className="
              mb-5
              flex
              items-center
              justify-between
            ">
              <h2 className="text-xl font-semibold">
                Ticket per Status
              </h2>
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
                    <Cell
                      key={i}
                      fill={pieColors[i % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-3">
              {pieData.map((item, i) => (
                <div
                  key={i}
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        background: pieColors[i % pieColors.length],
                      }}
                    />
                    <span className="text-sm text-neutral-600 capitalize">
                      {item.name.replace("_", " ")}
                    </span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>

          </div>

          {/* =========================================
             ACTIVITY SUMMARY — derived dari data real
          ========================================= */}

          <div className="
            rounded-[32px]
            bg-white
            p-6
            shadow-sm
          ">

            <h2 className="mb-5 text-xl font-semibold">
              Activity Summary
            </h2>

            <div className="space-y-5">

              <div>
                <div className="
                  mb-2
                  flex
                  items-center
                  justify-between
                  text-sm
                ">
                  <span>Ticket Selesai</span>
                  <span>{pctDone}%</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-100">
                  <div
                    className="h-3 rounded-full bg-neutral-900 transition-all"
                    style={{ width: `${pctDone}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="
                  mb-2
                  flex
                  items-center
                  justify-between
                  text-sm
                ">
                  <span>Ticket Diproses</span>
                  <span>{pctApproved}%</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-100">
                  <div
                    className="h-3 rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${pctApproved}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="
                  mb-2
                  flex
                  items-center
                  justify-between
                  text-sm
                ">
                  <span>Cashback Pending</span>
                  <span>{pctPendingCashback}%</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-100">
                  <div
                    className="h-3 rounded-full bg-amber-500 transition-all"
                    style={{ width: `${pctPendingCashback}%` }}
                  />
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}