/**
 * lib/constants.ts
 * Konstanta UI yang dipakai di seluruh komponen Floraless.
 * Sumber kebenaran tunggal untuk label status, warna badge, dll.
 */

import type { TicketStatus } from "../services/ticket.service";
import type { PaymentType, PaymentStatus } from "../services/payment.service";
import type { CashbackStatus } from "../services/cashback.service";

// ─── Status Ticket ────────────────────────────────────────────────────────────

export const TICKET_STATUS_LABEL: Record<TicketStatus, string> = {
  pending:     "Menunggu Konfirmasi",
  approved:    "Disetujui",
  rejected:    "Ditolak",
  in_progress: "Sedang Dikerjakan",
  done:        "Selesai",
};

/** Warna Tailwind untuk badge status ticket */
export const TICKET_STATUS_COLOR: Record<TicketStatus, string> = {
  pending:     "bg-amber-100 text-amber-800",
  approved:    "bg-blue-100 text-blue-800",
  rejected:    "bg-red-100 text-red-800",
  in_progress: "bg-purple-100 text-purple-800",
  done:        "bg-green-100 text-green-800",
};

// ─── Tipe & Status Pembayaran ─────────────────────────────────────────────────

export const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  DP1:       "Down Payment 1 (20%)",
  DP2:       "Down Payment 2 (30%)",
  PELUNASAN: "Pelunasan (50%)",
};

export const PAYMENT_TYPE_SHORT: Record<PaymentType, string> = {
  DP1:       "DP1",
  DP2:       "DP2",
  PELUNASAN: "Pelunasan",
};

/** Persentase per tipe pembayaran */
export const PAYMENT_TYPE_PERCENT: Record<PaymentType, number> = {
  DP1:       0.2,
  DP2:       0.3,
  PELUNASAN: 0.5,
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending:  "Menunggu Verifikasi",
  approved: "Terverifikasi",
  rejected: "Ditolak",
};

export const PAYMENT_STATUS_COLOR: Record<PaymentStatus, string> = {
  pending:  "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

// ─── Status Cashback ──────────────────────────────────────────────────────────

export const CASHBACK_STATUS_LABEL: Record<CashbackStatus, string> = {
  pending:  "Menunggu Proses",
  approved: "Disetujui",
  rejected: "Ditolak",
};

export const CASHBACK_STATUS_COLOR: Record<CashbackStatus, string> = {
  pending:  "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

// ─── Role ─────────────────────────────────────────────────────────────────────

export const ROLE_LABEL: Record<string, string> = {
  admin:     "Admin",
  pegawai:   "Pegawai",
  pelanggan: "Pelanggan",
};

// ─── Navigasi Sidebar per Role ────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: string; // nama icon (Lucide)
}

export const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard",   href: "/admin/dashboard",   icon: "LayoutDashboard" },
  { label: "Ticket",      href: "/admin/ticket",       icon: "ClipboardList" },
  { label: "Pelanggan",   href: "/admin/pelanggan",    icon: "Users" },
  { label: "Pegawai",     href: "/admin/pegawai",      icon: "UserCheck" },
  { label: "Layanan",     href: "/admin/layanan",      icon: "Flower2" },
  { label: "Portfolio",   href: "/admin/portfolio",    icon: "ImageIcon" },
  { label: "Kalender",    href: "/admin/kalender",     icon: "CalendarDays" },
  { label: "Review",      href: "/admin/review",       icon: "Star" },
  { label: "Cashback",    href: "/admin/cashback",      icon: "Wallet" },
  { label: "Log",         href: "/admin/log",           icon: "ScrollText" },
];

export const PEGAWAI_NAV: NavItem[] = [
  { label: "Dashboard",   href: "/pegawai/dashboard",  icon: "LayoutDashboard" },
  { label: "Ticket",      href: "/pegawai/ticket",      icon: "ClipboardList" },
  { label: "Pembayaran",  href: "/pegawai/pembayaran",  icon: "CreditCard" },
  { label: "Cashback",    href: "/pegawai/cashback",    icon: "Wallet" },
  { label: "Profil",      href: "/pegawai/profil",      icon: "UserCircle" },
];

export const PELANGGAN_NAV: NavItem[] = [
  { label: "Dashboard",   href: "/pelanggan/dashboard",  icon: "LayoutDashboard" },
  { label: "Ticket Saya", href: "/pelanggan/ticket",     icon: "ClipboardList" },
  { label: "Pembayaran",  href: "/pelanggan/pembayaran", icon: "CreditCard" },
  { label: "Kalender",    href: "/pelanggan/kalender",   icon: "CalendarDays" },
  { label: "Voucher",     href: "/pelanggan/voucher",    icon: "Tag" },
  { label: "Cashback",    href: "/pelanggan/cashback/ajukan", icon: "Wallet" },
  { label: "Profil",      href: "/pelanggan/profil",     icon: "UserCircle" },
];