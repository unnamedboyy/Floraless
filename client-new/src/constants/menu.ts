export type Role = "admin" | "pegawai";

type MenuItem = {
  label: string;
  path: string;
  roles: Role[];
};

/* ================= ADMIN MENU ================= */
export const adminMenu: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    roles: ["admin"],
  },
  {
    label: "Pegawai",
    path: "/admin/pegawai",
    roles: ["admin"],
  },
  {
    label: "Pelanggan",
    path: "/admin/pelanggan",
    roles: ["admin"],
  },

  {
    label: "Laporan",
    path: "/admin/laporan",
    roles: ["admin"],
  },

  {
    label: "Ticket",
    path: "/admin/ticket",
    roles: ["admin"],
  },

  {
    label: "Review",
    path: "/admin/review",
    roles: ["admin"],
  },

  {
    label: "Layanan",
    path: "/admin/layanan",
    roles: ["admin"],
  },

  {
    label: "Jadwal",
    path: "/admin/jadwal",
    roles: ["admin"],
  },

  {
    label: "Payment",
    path: "/admin/payment",
    roles: ["admin"],
  },

  {
    label: "Cashback",
    path: "/admin/cashback",
    roles: ["admin"],
  },

  {
    label: "Voucher",
    path: "/admin/voucher",
    roles: ["admin"],
  }
];

/* ================= PEGAWAI MENU ================= */
export const pegawaiMenu: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/pegawai/dashboard",
    roles: ["pegawai"],
  },

  {
    label: "Tugas",
    path: "/pegawai/tugas",
    roles: ["pegawai"],
  },
];