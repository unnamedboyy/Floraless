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