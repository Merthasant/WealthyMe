type Currency = "USD" | "IDR" | "SGD" | "EUR";

const exchangeRates: Record<Currency, number> = {
  USD: 17300,
  IDR: 1,
  SGD: 13550,
  EUR: 20250,
};

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
): number {
  // ubah jumlah ke IDR terlebih dahulu
  const amountInIDR = amount * exchangeRates[from];

  const result = amountInIDR / exchangeRates[to];

  return Number(result.toFixed(2));
}
