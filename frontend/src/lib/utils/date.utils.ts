export const getDefaultTimezone = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return tz;
};

/**
 * By Claude
 */

/**
 * Kumpulan utility untuk mengubah unix timestamp (dalam detik, hasil bagi 1000)
 * menjadi Date object maupun teks relatif yang lebih ramah untuk ditampilkan di UI.
 */

/**
 * Mengubah unix timestamp (detik) menjadi objek Date.
 *
 * Catatan: unix timestamp biasanya dalam detik, sedangkan JS Date butuh milidetik,
 * jadi kita kalikan 1000 di sini.
 *
 * @param unixSeconds - unix timestamp dalam detik (misal: hasil dari `Date.now() / 1000`)
 * @returns objek Date yang sesuai
 *
 * @example
 * unixToDate(1735689600) // => Date object untuk 1 Jan 2025
 */
export function unixToDate(unixSeconds: number): Date {
  return new Date(unixSeconds * 1000);
}

/**
 * Mengubah unix timestamp (detik) menjadi teks waktu relatif yang mudah dibaca manusia,
 * seperti "just now", "5 minutes ago", "yesterday", "2 weeks ago", "1 year ago", dst.
 *
 * @param unixSeconds - unix timestamp dalam detik
 * @param baseDate - waktu pembanding, default-nya waktu sekarang (berguna untuk testing)
 * @returns string relative time yang ramah dibaca
 *
 * @example
 * unixToRelativeTime(1735689600) // => "2 months ago" (tergantung waktu sekarang)
 */
export function unixToRelativeTime(
  unixSeconds: number,
  baseDate: Date = new Date(),
): string {
  const targetDate = unixToDate(unixSeconds);

  // Selisih waktu dalam detik. Bisa negatif kalau targetDate ada di masa depan.
  const diffInSeconds = Math.floor(
    (baseDate.getTime() - targetDate.getTime()) / 1000,
  );

  const isFuture = diffInSeconds < 0;
  const absDiff = Math.abs(diffInSeconds);

  // Definisikan setiap satuan waktu beserta ambang batas (dalam detik).
  // Urutan dari yang terbesar ke terkecil supaya bisa dicek satu-satu.
  const units: { label: string; seconds: number }[] = [
    { label: "year", seconds: 60 * 60 * 24 * 365 },
    { label: "month", seconds: 60 * 60 * 24 * 30 },
    { label: "week", seconds: 60 * 60 * 24 * 7 },
    { label: "day", seconds: 60 * 60 * 24 },
    { label: "hour", seconds: 60 * 60 },
    { label: "minute", seconds: 60 },
  ];

  // Kasus khusus: baru saja terjadi (kurang dari 1 menit)
  if (absDiff < 60) {
    return "just now";
  }

  // Kasus khusus: kemarin / besok (pas 1 hari)
  const oneDaySeconds = 60 * 60 * 24;
  if (absDiff >= oneDaySeconds && absDiff < oneDaySeconds * 2) {
    return isFuture ? "tomorrow" : "yesterday";
  }

  // Cari satuan waktu yang paling cocok (yang terbesar yang masih terpenuhi)
  for (const unit of units) {
    const value = Math.floor(absDiff / unit.seconds);
    if (value >= 1) {
      const unitLabel = value > 1 ? `${unit.label}s` : unit.label;
      return isFuture
        ? `in ${value} ${unitLabel}`
        : `${value} ${unitLabel} ago`;
    }
  }

  // Fallback (seharusnya tidak pernah sampai sini)
  return "just now";
}
