"use client";

import { useMemo } from "react";

import { useDashboard }
from "@/hooks/useDashboard";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {

  ClipboardList,

  Clock3,

  CheckCircle2,

  CalendarDays,

  TrendingUp,

  Sparkles,

  ArrowUpRight,

  CircleCheckBig,

} from "lucide-react";

export default function PegawaiDashboardPage() {

  const { data } =
    useDashboard("pegawai");

  /* =====================================================
     LOADING
  ===================================================== */

  if (!data) {

    return (

      <div className="
        p-10
      ">
        Loading dashboard...
      </div>
    );
  }

  /* =====================================================
     SUMMARY
  ===================================================== */

  const summary = [

    {
      title: "Assigned Ticket",

      value:
        data.assigned || 0,

      icon:
        ClipboardList,

      color:
        "from-sky-500 to-cyan-400",
    },

    {
      title: "In Progress",

      value:
        data.inProgress || 0,

      icon:
        Clock3,

      color:
        "from-amber-500 to-yellow-400",
    },

    {
      title: "Completed",

      value:
        data.completed || 0,

      icon:
        CheckCircle2,

      color:
        "from-emerald-500 to-green-400",
    },

    {
      title: "Today Schedule",

      value:
        data.todaySchedule || 0,

      icon:
        CalendarDays,

      color:
        "from-violet-500 to-purple-400",
    },
  ];

  /* =====================================================
     PIE
  ===================================================== */

  const pieData = [

    {
      name: "Assigned",
      value:
        data.assigned || 0,
    },

    {
      name: "Progress",
      value:
        data.inProgress || 0,
    },

    {
      name: "Done",
      value:
        data.completed || 0,
    },
  ];

  const pieColors = [

    "#0f172a",

    "#334155",

    "#94a3b8",
  ];

  /* =====================================================
     MOCK CHART
  ===================================================== */

  const activityChart = [

    {
      day: "Mon",
      total: 2,
    },

    {
      day: "Tue",
      total: 4,
    },

    {
      day: "Wed",
      total: 3,
    },

    {
      day: "Thu",
      total: 5,
    },

    {
      day: "Fri",
      total: 6,
    },

    {
      day: "Sat",
      total: 4,
    },

    {
      day: "Sun",
      total: 7,
    },
  ];

  /* =====================================================
     MOCK TASK
  ===================================================== */

  const tasks = [

    {
      title:
        "Wedding Decoration",

      status:
        "In Progress",

      date:
        "12 Mei 2026",
    },

    {
      title:
        "Birthday Event",

      status:
        "Assigned",

      date:
        "14 Mei 2026",
    },

    {
      title:
        "Engagement Setup",

      status:
        "Completed",

      date:
        "16 Mei 2026",
    },
  ];

  const roadmap = [

    "Cek detail ticket pelanggan",

    "Persiapan perlengkapan acara",

    "Pelaksanaan dekorasi venue",

    "Monitoring acara berlangsung",

    "Finalisasi tugas dan dokumentasi",
  ];

  const today =
    new Date();

  const currentMonth =
    today.toLocaleString(
      "id-ID",
      {

        month: "long",

        year: "numeric",
      }
    );

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="
      min-h-screen
      bg-[#f5f7fb]
      p-6
    ">

      {/* =================================================
         HEADER
      ================================================= */}

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

          <p className="
            text-sm
            uppercase
            tracking-[0.3em]
            text-neutral-400
          ">
            Dashboard Pegawai
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
            Monitoring Tugas & Jadwal
          </h1>

          <p className="
            mt-3
            text-neutral-500
          ">
            Ringkasan tugas pegawai,
            jadwal acara, dan aktivitas
            operasional terbaru.
          </p>

        </div>

        {/* DATE CARD */}

        <div
          className="
            rounded-3xl
            border
            border-neutral-200
            bg-white
            p-5
            shadow-sm
          "
        >

          <div className="
            flex
            items-center
            gap-4
          ">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-black
                text-white
              "
            >
              <CalendarDays
                size={24}
              />
            </div>

            <div>

              <p className="
                text-sm
                text-neutral-500
              ">
                Bulan Aktif
              </p>

              <h3 className="
                mt-1
                text-xl
                font-semibold
              ">
                {currentMonth}
              </h3>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
         SUMMARY
      ================================================= */}

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        {summary.map(
          (item, i) => {

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

                    <p className="
                      text-sm
                      text-neutral-500
                    ">
                      {item.title}
                    </p>

                    <h3
                      className="
                        mt-3
                        text-3xl
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

                  Aktivitas meningkat

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* =================================================
         MAIN GRID
      ================================================= */}

      <div
        className="
          mt-8
          grid
          gap-6
          xl:grid-cols-12
        "
      >

        {/* =================================================
           LEFT
        ================================================= */}

        <div
          className="
            space-y-6
            xl:col-span-8
          "
        >

          {/* ACTIVITY */}

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
                  Weekly Activity
                </h2>

                <p className="
                  mt-1
                  text-sm
                  text-neutral-500
                ">
                  Aktivitas pekerjaan
                  mingguan pegawai
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

              <AreaChart
                data={
                  activityChart
                }
              >

                <defs>

                  <linearGradient
                    id="pegawaiActivity"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#111827"
                      stopOpacity={0.3}
                    />

                    <stop
                      offset="95%"
                      stopColor="#111827"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <XAxis
                  dataKey="day"
                />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#111827"
                  fillOpacity={1}
                  fill="url(#pegawaiActivity)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

          {/* TASK + ROADMAP */}

          <div
            className="
              grid
              gap-6
              lg:grid-cols-2
            "
          >

            {/* TASK */}

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
                  Tugas Berjalan
                </h2>

                <Sparkles
                  size={18}
                  className="
                    text-amber-500
                  "
                />

              </div>

              <div className="
                space-y-4
              ">

                {tasks.map(
                  (task, i) => (

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

                        <h3
                          className="
                            font-medium
                            text-neutral-900
                          "
                        >
                          {task.title}
                        </h3>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-neutral-500
                          "
                        >
                          {task.date}
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
                        {task.status}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* ROADMAP */}

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
                Workflow Pegawai
              </h2>

              <div className="
                space-y-5
              ">

                {roadmap.map(
                  (item, i) => (

                    <div
                      key={i}
                      className="
                        flex
                        gap-4
                      "
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

                          <CircleCheckBig
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

                      <div className="
                        pb-8
                      ">

                        <h3
                          className="
                            font-medium
                            text-neutral-900
                          "
                        >
                          {item}
                        </h3>

                        <p
                          className="
                            mt-1
                            text-sm
                            text-neutral-500
                          "
                        >
                          Progress pekerjaan
                          dan operasional
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

        {/* =================================================
           RIGHT
        ================================================= */}

        <div
          className="
            space-y-6
            xl:col-span-4
          "
        >

          {/* CALENDAR */}

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

                <p className="
                  text-sm
                  text-white/60
                ">
                  Calendar
                </p>

                <h2
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                  "
                >
                  {currentMonth}
                </h2>

              </div>

              <CalendarDays
                size={30}
                className="
                  text-white/80
                "
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

                          ? `
                            bg-white
                            text-black
                            font-semibold
                          `

                          : `
                            bg-white/5
                            text-white/70
                          `
                      }
                    `}
                  >
                    {i + 1}
                  </div>
                )
              )}

            </div>

          </div>

          {/* PIE */}

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
                Ticket Progress
              </h2>

              <Sparkles
                size={18}
                className="
                  text-neutral-400
                "
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
                    (_, i) => (

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

            <div className="
              mt-6
              space-y-3
            ">

              {pieData.map(
                (item, i) => (

                  <div
                    key={i}
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          h-3
                          w-3
                          rounded-full
                        "
                        style={{
                          background:
                            pieColors[
                              i %
                                pieColors.length
                            ],
                        }}
                      />

                      <span
                        className="
                          text-sm
                          text-neutral-600
                        "
                      >
                        {item.name}
                      </span>

                    </div>

                    <span
                      className="
                        font-medium
                      "
                    >
                      {item.value}
                    </span>

                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}