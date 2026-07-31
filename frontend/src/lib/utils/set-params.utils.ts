// lib/searchParams.ts
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Value yang diterima untuk tiap key:
 * - string / number -> di-set ke params (number otomatis di-stringify)
 * - null / undefined / "" -> key dihapus dari params
 */
export type ParamUpdates = Record<string, string | number | null | undefined>;

/**
 * Pure function — tidak bergantung React, bisa dites terpisah.
 * Menggabungkan `updates` ke dalam URLSearchParams yang sudah ada.
 */
export function mergeSearchParams(
  prev: URLSearchParams,
  updates: ParamUpdates,
): URLSearchParams {
  const next = new URLSearchParams(prev);

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined || value === "") {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
  }

  return next;
}

/**
 * Hook reusable untuk update banyak search params sekaligus.
 * Default `replace: true` supaya tidak spam browser history,
 * tapi bisa di-override per pemanggilan kalau perlu.
 */
export function useUpdateSearchParams() {
  const [, setSearchParams] = useSearchParams();

  const updateParams = useCallback(
    (updates: ParamUpdates, options?: { replace?: boolean }) => {
      setSearchParams((prev) => mergeSearchParams(prev, updates), {
        replace: options?.replace ?? true,
      });
    },
    [setSearchParams],
  );

  return updateParams;
}
