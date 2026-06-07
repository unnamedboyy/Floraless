import {
  LayoutDashboard,
  Users,
  User,
  FileText,
  Ticket,
  Star,
  Layers,
  Calendar,
  CreditCard,
  Gift,
  Tag,
} from "lucide-react";

export type Role = "admin" | "pegawai";

type MenuItem = {
  label: string;
  path: string;
  roles: Role[];
  icon?: any;
};

/* ================= ADMIN MENU ================= */
export const adminMenu: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    roles: ["admin"],
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Pegawai",
    path: "/admin/pegawai",
    roles: ["admin"],
    icon: <Users size={18} />,
  },
  {
    label: "Pelanggan",
    path: "/admin/pelanggan",
    roles: ["admin"],
    icon: <User size={18} />,
  },
  {
    label: "Laporan",
    path: "/admin/laporan",
    roles: ["admin"],
    icon: <FileText size={18} />,
  },
  {
    label: "Ticket",
    path: "/admin/ticket",
    roles: ["admin"],
    icon: <Ticket size={18} />,
  },
  {
    label: "Review",
    path: "/admin/review",
    roles: ["admin"],
    icon: <Star size={18} />,
  },
  {
    label: "Layanan",
    path: "/admin/layanan",
    roles: ["admin"],
    icon: <Layers size={18} />,
  },
  {
    label: "Jadwal",
    path: "/admin/jadwal",
    roles: ["admin"],
    icon: <Calendar size={18} />,
  },
  {
    label: "Payment",
    path: "/admin/payment",
    roles: ["admin"],
    icon: <CreditCard size={18} />,
  },
  {
    label: "Cashback",
    path: "/admin/cashback",
    roles: ["admin"],
    icon: <Gift size={18} />,
  },
  {
    label: "Voucher",
    path: "/admin/voucher",
    roles: ["admin"],
    icon: <Tag size={18} />,
  },
  {
    label: "Portfolio",
    path: "/admin/portfolio",
    roles: ["admin"],
    icon: <Tag size={18} />,
  },
];

/* ================= PEGAWAI MENU ================= */
export const pegawaiMenu: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/pegawai/dashboard",
    roles: ["pegawai"],
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Tugas",
    path: "/pegawai/tugas",
    roles: ["pegawai"],
    icon: <Ticket size={18} />,
  },
  {
    label: "Jadwal",
    path: "/pegawai/jadwal",
    roles: ["pegawai"],
    icon: <Calendar size={18} />,
  },
  {
    label: "Payment",
    path: "/pegawai/payment",
    roles: ["pegawai"],
    icon: <CreditCard size={18} />,
  },
  {
    label: "Cashback",
    path: "/pegawai/cashback",
    roles: ["pegawai"],
    icon: <Gift size={18} />,
  },
];