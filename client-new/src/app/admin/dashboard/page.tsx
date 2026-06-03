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
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {

  /* =========================================
     FETCH DASHBOARD
  ========================================= */

  const { data } =
    useDashboard("admin");

  /* =========================================
     SUMMARY
  ========================================= */

const summary = [
  {
    title: "Total Revenue",

    value: `Rp ${(
      data?.totalRevenue || 0
    ).toLocaleString()}`,

    icon: CircleDollarSign,

    color:
      "from-emerald-500 to-green-400",
  },

  {
    title: "Total Ticket",

    value:
      data?.totalTicket || 0,

    icon: Ticket,

    color:
      "from-sky-500 to-cyan-400",
  },

  {
    title: "Pending Ticket",

    value:
      data?.pendingTicket || 0,

    icon: Clock3,

    color:
      "from-amber-500 to-yellow-400",
  },

  {
    title: "Payment Pending",

    value:
      data?.paymentPending || 0,

    icon: CreditCard,

    color:
      "from-rose-500 to-pink-400",
  },

  {
    title: "Cashback Pending",

    value:
      data?.pendingCashback || 0,

    icon: Wallet,

    color:
      "from-violet-500 to-purple-400",
  },
];

  /* =========================================
     PIE DATA
  ========================================= */

  const pieData = Object.keys(
    data?.ticketStatus || {}
  ).map((key) => ({
    name: key,

    value:
      data?.ticketStatus?.[
        key
      ] || 0,
  }));

  const pieColors = [
    "#0f172a",
    "#1e293b",
    "#334155",
    "#64748b",
    "#94a3b8",
  ];

  /* =========================================
     MONTHLY COMPLETED TICKET GRAPH
  ========================================= */

const monthlyTicketChart =
  useMemo(() => {

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    type MonthlyChartType = {
      month: string;
      total: number;
    };

    const result: MonthlyChartType[] =
      [];

    const now = new Date();

    /* =====================================
       CREATE 12 MONTHS
    ===================================== */

    for (let i = 11; i >= 0; i--) {

      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      result.push({
        month:
          monthNames[
            date.getMonth()
          ],

        total: 0,
      });
    }

    /* =====================================
       NO DATA
    ===================================== */

    if (
      !data?.revenueChart ||
      !Array.isArray(
        data.revenueChart
      )
    ) {
      return result;
    }

    /* =====================================
       TEMPORARY FRONTEND MAPPING
       (ADJUST WITH CURRENT API)
    ===================================== */

    data.revenueChart.forEach(
      (
        item: any,
        index: number
      ) => {

        if (
          result[index]
        ) {

          result[index].total =
            item?.completed ||
            item?.totalTicket ||
            item?.ticket ||
            item?.total ||
            0;
        }
      }
    );

    return result;

  }, [data]);

  /* =========================================
    LOADING
  ========================================= */

  if (!data) {
    return (
      <div className="p-10">
        Loading dashboard...
      </div>
    );
  }

  /* =========================================
     DATE
  ========================================= */

  const today = new Date();

  const currentMonth =
    today.toLocaleString(
      "id-ID",
      {
        month: "long",
        year: "numeric",
      }
    );

  /* =========================================
     MOCK DATA
  ========================================= */

  const mockTickets = [
    {
      name:
        "Wedding Adelia & Reza",
      status: "On Progress",
      date: "12 Mei 2026",
    },

    {
      name: "Birthday Event",
      status: "Pending",
      date: "15 Mei 2026",
    },

    {
      name: "Holy Matrimony",
      status: "Approved",
      date: "18 Mei 2026",
    },
  ];

  const roadmap = [
    "Konfirmasi booking pelanggan",

    "Verifikasi pembayaran DP",

    "Persiapan dekorasi venue",

    "Pelaksanaan acara",

    "Finalisasi dokumentasi",
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-6">

      {/* =========================================
         HEADER
      ========================================= */}

      <div
        className="
          mb-8
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div>

          <p className="text-sm tracking-[0.3em] text-neutral-400 uppercase">
            Dashboard Admin
          </p>

          <h1
            className="
              mt-2
              text-4xl
              font-bold
              tracking-tight
              text-neutral-900
            "
          >
            Monitoring Operasional
            Floraless
          </h1>

          <p className="mt-3 text-neutral-500">
            Ringkasan performa bisnis,
            ticket, pembayaran,
            dan aktivitas terbaru.
          </p>

        </div>

      </div>

      {/* =========================================
         SUMMARY
      ========================================= */}

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-5
        "
      >

        {summary.map((item, i) => {

          const Icon =
            item.icon;

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

              <div
                className={`
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
                `}
              />

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <p className="text-sm text-neutral-500">
                    {item.title}
                  </p>

                  <h3
                    className="
                      mt-3
                      text-2xl
                      font-bold
                      text-neutral-900
                    "
                  >
                    {item.value}
                  </h3>

                </div>

                <div
                  className={`
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    text-white
                    ${item.color}
                  `}
                >
                  <Icon size={24} />
                </div>

              </div>

              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-emerald-600
                "
              >
                <TrendingUp
                  size={16}
                />
                +12% dari bulan lalu
              </div>

            </div>
          );
        })}

      </div>

      {/* =========================================
         MAIN GRID
      ========================================= */}

      <div
        className="
          mt-8
          grid
          gap-6
          xl:grid-cols-12
        "
      >

        {/* =========================================
           LEFT
        ========================================= */}

        <div
          className="
            space-y-6
            xl:col-span-8
          "
        >

          {/* =========================================
             GRAPH
          ========================================= */}

          <div
            className="
              rounded-[32px]
              bg-white
              p-6
              shadow-sm
            "
          >

            <div
              className="
                mb-6
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-xl
                    font-semibold
                    text-neutral-900
                  "
                >
                  Ticket Completion Analytics
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Total ticket selesai
                  dari bulan ke bulan
                </p>

              </div>

              <div
                className="
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
                "
              >
                <ArrowUpRight
                  size={16}
                />
                Growth
              </div>

            </div>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={
                  monthlyTicketChart
                }
              >

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="total"
                  radius={[
                    10,
                    10,
                    0,
                    0,
                  ]}
                  fill="#111827"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* =========================================
             ACTIVITY
          ========================================= */}

          <div
            className="
              grid
              gap-6
              lg:grid-cols-2
            "
          >

            {/* =========================================
               TICKET LIST
            ========================================= */}

            <div
              className="
                rounded-[32px]
                bg-white
                p-6
                shadow-sm
              "
            >

              <div
                className="
                  mb-6
                  flex
                  items-center
                  justify-between
                "
              >

                <h2
                  className="
                    text-xl
                    font-semibold
                  "
                >
                  On going Ticket
                </h2>

                <Sparkles
                  size={18}
                  className="text-amber-500"
                />

              </div>

              <div className="space-y-4">

                {mockTickets.map(
                  (
                    ticket,
                    i
                  ) => (
                    <div
                      key={i}
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
                          {
                            ticket.name
                          }
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500">
                          {
                            ticket.date
                          }
                        </p>

                      </div>

                      <span
                        className="
                          rounded-full
                          bg-neutral-100
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-neutral-700
                        "
                      >
                        {
                          ticket.status
                        }
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* =========================================
               ROADMAP
            ========================================= */}

            <div
              className="
                rounded-[32px]
                bg-white
                p-6
                shadow-sm
              "
            >

              <h2
                className="
                  mb-6
                  text-xl
                  font-semibold
                "
              >
                Progress Roadmap
              </h2>

              <div className="space-y-5">

                {roadmap.map(
                  (
                    item,
                    i
                  ) => (
                    <div
                      key={i}
                      className="flex gap-4"
                    >

                      <div
                        className="
                          flex
                          flex-col
                          items-center
                        "
                      >

                        <div
                          className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-neutral-900
                            text-white
                          "
                        >
                          <CheckCircle2
                            size={16}
                          />
                        </div>

                        {i !==
                          roadmap.length -
                            1 && (
                          <div
                            className="
                              h-full
                              w-px
                              bg-neutral-200
                            "
                          />
                        )}

                      </div>

                      <div className="pb-8">

                        <h3 className="font-medium text-neutral-900">
                          {item}
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500">
                          Progress
                          operasional
                          dan workflow
                          event.
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </div>

        {/* =========================================
           RIGHT
        ========================================= */}

        <div
          className="
            space-y-6
            xl:col-span-4
          "
        >

          {/* =========================================
             CALENDAR
          ========================================= */}

          <div
            className="
              rounded-[32px]
              bg-gradient-to-br
              from-[#111827]
              to-[#1f2937]
              p-7
              text-white
              shadow-sm
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p className="text-sm text-white/60">
                  Calendar
                </p>

                <h2 className="mt-2 text-2xl font-semibold">
                  {
                    currentMonth
                  }
                </h2>

              </div>

              <CalendarDays
                size={30}
                className="text-white/80"
              />

            </div>

            <div
              className="
                mt-8
                grid
                grid-cols-7
                gap-3
                text-center
              "
            >

              {[
                "S",
                "S",
                "R",
                "K",
                "J",
                "S",
                "M",
              ].map((d, i) => (

                <div
                  key={`${d}-${i}`}
                  className="
                    text-xs
                    text-white/50
                  "
                >
                  {d}
                </div>

              ))}

              {[...Array(31)].map(
                (_, i) => (
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
                        i + 1 ===
                        today.getDate()
                          ? "bg-white text-black font-semibold"
                          : "bg-white/5 text-white/70"
                      }
                    `}
                  >
                    {i + 1}
                  </div>
                )
              )}

            </div>

          </div>

          {/* =========================================
             PIE
          ========================================= */}

          <div
            className="
              rounded-[32px]
              bg-white
              p-6
              shadow-sm
            "
          >

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-xl
                  font-semibold
                "
              >
                Ticket Status
              </h2>

              <AlertCircle
                size={18}
                className="text-neutral-400"
              />

            </div>

            <ResponsiveContainer
              width="100%"
              height={260}
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >

                  {pieData.map(
                    (
                      _,
                      i
                    ) => (
                      <Cell
                        key={i}
                        fill={
                          pieColors[
                            i %
                              pieColors.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

            <div className="mt-6 space-y-3">

              {pieData.map(
                (
                  item,
                  i
                ) => (
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
                          background:
                            pieColors[
                              i %
                                pieColors.length
                            ],
                        }}
                      />

                      <span className="text-sm text-neutral-600">
                        {
                          item.name
                        }
                      </span>

                    </div>

                    <span className="font-medium">
                      {
                        item.value
                      }
                    </span>

                  </div>
                )
              )}

            </div>

          </div>

          {/* =========================================
             MINI STATS
          ========================================= */}

          <div
            className="
              rounded-[32px]
              bg-white
              p-6
              shadow-sm
            "
          >

            <h2
              className="
                mb-5
                text-xl
                font-semibold
              "
            >
              Activity Summary
            </h2>

            <div className="space-y-5">

              <div>

                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
                >
                  <span>
                    Ticket Approved
                  </span>

                  <span>
                    78%
                  </span>

                </div>

                <div className="h-3 rounded-full bg-neutral-100">

                  <div className="h-3 w-[78%] rounded-full bg-neutral-900" />

                </div>

              </div>

              <div>

                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
                >
                  <span>
                    Payment Success
                  </span>

                  <span>
                    64%
                  </span>

                </div>

                <div className="h-3 rounded-full bg-neutral-100">

                  <div className="h-3 w-[64%] rounded-full bg-emerald-500" />

                </div>

              </div>

              <div>

                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
                >
                  <span>
                    Cashback Process
                  </span>

                  <span>
                    32%
                  </span>

                </div>

                <div className="h-3 rounded-full bg-neutral-100">

                  <div className="h-3 w-[32%] rounded-full bg-amber-500" />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}