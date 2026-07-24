/**
 * Format angka (string) menjadi tampilan mata uang.
 * Mendukung: IDR, USD, SGD, EUR
 */

import type { CurrencyCode } from "../types/account.type";

// Setiap currency punya locale masing-masing biar formatnya sesuai kebiasaan
const LOCALE: Record<CurrencyCode, string> = {
  IDR: "id-ID",
  USD: "en-US",
  SGD: "en-SG",
  EUR: "de-DE",
};

function formatCurrency(amount: string, currencyCode: CurrencyCode): string {
  // 1. Ubah string jadi number
  const numericValue = Number(amount);

  // 2. Kalau bukan angka valid, kasih tau errornya
  if (isNaN(numericValue)) {
    throw new Error(`"${amount}" bukan angka yang valid`);
  }

  // 3. Format sesuai currency
  return new Intl.NumberFormat(LOCALE[currencyCode], {
    style: "currency",
    currency: currencyCode,
  }).format(numericValue);
}

// Contoh pemakaian:
// formatCurrency("1500000", "IDR")  -> "Rp1.500.000"
// formatCurrency("1500000.5", "USD") -> "$1,500,000.50"
// formatCurrency("2500.75", "SGD")   -> "S$2,500.75"
// formatCurrency("1500000", "EUR")   -> "1.500.000,00 €"

export { formatCurrency };
