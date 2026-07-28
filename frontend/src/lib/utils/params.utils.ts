import type {
  AccountSoryByParam,
  AccountTypeParam,
  SortOrderParam,
} from "../types/options-param";

export const getNumberParam = (
  searchParams: URLSearchParams,
  key: string,
  fallback: number,
): number => {
  const raw = searchParams.get(key);
  if (raw === null) return fallback;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const getSortOrderParam = (
  searchParams: URLSearchParams,
  fallback: SortOrderParam,
): SortOrderParam => {
  const raw = searchParams.get("sortOrder"); // pasti key sortOrder
  if (raw === null) return fallback;
  if (raw !== "desc" && raw !== "asc") return "desc";
  return raw;
};

export const getAccountSoryByParam = (
  searchParams: URLSearchParams,
  fallback: AccountSoryByParam,
): AccountSoryByParam => {
  const raw = searchParams.get("sortBy"); // pasti key sortBy
  if (raw === null) return fallback;
  if (raw !== "createdAt" && raw !== "updatedAt" && raw !== "balance")
    return "updatedAt";
  return raw;
};

export const getAccountTypeParam = (
  searchParams: URLSearchParams,
  fallback: AccountTypeParam,
): AccountTypeParam => {
  const raw = searchParams.get("type"); // pasti key Type
  if (raw === null) return fallback;
  if (
    raw !== "cash" &&
    raw !== "e_wallet" &&
    raw !== "bank" &&
    raw !== "investment" &&
    raw !== "all"
  )
    return "all";
  return raw;
};
