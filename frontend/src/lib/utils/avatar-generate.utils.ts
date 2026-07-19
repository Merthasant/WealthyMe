/**
 * uiAvatars.ts
 * Lib function untuk generate URL avatar dari https://ui-avatars.com
 *
 * Contoh pakai:
 *   const url = getUiAvatarUrl({ name: "John Doe" });
 *   const url2 = getUiAvatarUrl({ name: "De Mertha", background: "0D8ABC", color: "fff", rounded: true });
 */

export type UiAvatarFormat = "svg" | "png";

export interface UiAvatarOptions {
  /** Nama untuk generate inisial. Default: "John Doe" */
  name?: string;
  /** Ukuran gambar dalam px, 16–512. Default: 64 */
  size?: number;
  /** Ukuran font, persentase dari `size`, 0.1–1. Default: 0.5 */
  fontSize?: number;
  /** Jumlah karakter inisial. Default: 2 */
  length?: number;
  /** Gambar berbentuk bulat. Default: false */
  rounded?: boolean;
  /** Font tebal. Default: false */
  bold?: boolean;
  /** Warna background hex TANPA tanda pagar (#). Bisa juga "random". Default: "f0e9e9" */
  background?: string;
  /** Warna font hex TANPA tanda pagar (#). Default: "8b5d5d" */
  color?: string;
  /** Uppercase nama/inisial. Default: true */
  uppercase?: boolean;
  /** Format gambar: "svg" atau "png" */
  format?: UiAvatarFormat;
}

const BASE_URL = "https://ui-avatars.com/api/";

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate URL avatar dari UI Avatars API berdasarkan opsi yang diberikan.
 * Semua opsi bersifat optional, mengikuti default dari API aslinya.
 */
export function getUiAvatarUrl(options: UiAvatarOptions = {}): string {
  const {
    name,
    size,
    fontSize,
    length,
    rounded,
    bold,
    background,
    color,
    uppercase,
    format,
  } = options;

  const params = new URLSearchParams();

  if (name) params.set("name", name);

  if (size !== undefined) {
    params.set("size", String(clamp(Math.round(size), 16, 512)));
  }

  if (fontSize !== undefined) {
    params.set("font-size", String(clamp(fontSize, 0.1, 1)));
  }

  if (length !== undefined) {
    params.set("length", String(length));
  }

  if (rounded !== undefined) {
    params.set("rounded", String(rounded));
  }

  if (bold !== undefined) {
    params.set("bold", String(bold));
  }

  if (background) {
    // buang '#' kalau user tetap kirim
    params.set("background", background.replace("#", ""));
  }

  if (color) {
    params.set("color", color.replace("#", ""));
  }

  if (uppercase !== undefined) {
    params.set("uppercase", String(uppercase));
  }

  if (format) {
    params.set("format", format);
  }

  const query = params.toString();
  return query ? `${BASE_URL}?${query}` : BASE_URL;
}

/**
 * Helper khusus: generate avatar dengan warna background random.
 * (Sesuai rekomendasi API: jangan kirim `color` biar auto hitam/putih)
 */
export function getUiAvatarUrlRandomColor(
  options: Omit<UiAvatarOptions, "background" | "color"> = {},
): string {
  return getUiAvatarUrl({ ...options, background: "random" });
}
