/**
 * lib/format.ts
 * Utility formatting untuk tampilan UI Floraless.
 */

/**
 * Format angka ke format Rupiah Indonesia.
 * @example formatRupiah(150000) → "Rp 150.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ISO date string ke format lokal Indonesia.
 * @example formatTanggal("2025-04-20") → "20 April 2025"
 */
export function formatTanggal(isoString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoString));
}

/**
 * Format ISO date string ke format pendek.
 * @example formatTanggalPendek("2025-04-20") → "20/04/2025"
 */
export function formatTanggalPendek(isoString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(isoString));
}

/**
 * Format ISO datetime ke tanggal + waktu.
 * @example formatDateTime("2025-04-20T10:30:00") → "20 April 2025, 10.30"
 */
export function formatDateTime(isoString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

/**
 * Format angka persentase.
 * @example formatPersen(0.05) → "5%"
 */
export function formatPersen(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/**
 * Hitung countdown dari sekarang ke tanggal target.
 * @returns string seperti "3 hari lagi" atau "Sudah lewat"
 */
export function hitungCountdown(targetDate: string): string {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return "Sudah lewat";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Hari ini";
  if (days === 1) return "Besok";
  return `${days} hari lagi`;
}

/**
 * Potong teks panjang dengan ellipsis.
 * @example truncate("Hello World", 5) → "Hello..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}