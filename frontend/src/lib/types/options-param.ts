import { z } from "zod";

const sortByParam = ["createdAt", "updatedAt"] as const;
const sortOrderParam = ["asc", "desc"] as const;

export type sortByParam = (typeof sortByParam)[number];
export type SortOrderParam = (typeof sortOrderParam)[number];

export const baseOptionSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  search: z.string().default(""),
  sortBy: z.enum(sortByParam).default("updatedAt"),
  sortOrder: z.enum(sortOrderParam).default("asc"),
});

const accountSortByParam = [...sortByParam, "balance"] as const;
const accountTypeParam = [
  "cash",
  "e_wallet",
  "bank",
  "investment",
  "all",
] as const;

export type AccountSoryByParam = (typeof accountSortByParam)[number];
export type AccountTypeParam = (typeof accountTypeParam)[number];

export const accountOptionSchema = baseOptionSchema.extend({
  sortBy: z.enum(accountSortByParam).default("updatedAt"),
  type: z.enum(accountTypeParam).default("all"),
});

export const categoryOptionSchema = baseOptionSchema.extend({
  type: z.enum(["income", "expense", "all"]).default("all"),
});

const transactionSortByParam = [
  ...sortByParam,
  "amount",
  "transactionAt",
] as const;

export type TransactionSortByParam = (typeof transactionSortByParam)[number];

export const transactionOptionSchema = baseOptionSchema.extend({
  sortBy: z.enum(transactionSortByParam).default("transactionAt"),
  type: z.enum(["income", "expense", "all"]).default("all"),
  from_date: z.number().optional(),
  to_date: z.number().optional(),
});

export const transactionChartOptionSchema = transactionOptionSchema.pick({
  type: true,
  from_date: true,
  to_date: true,
});

export const transactionIdQuerySchema = z.object({
  accountId: z.string().optional(),
  transactionId: z.string().optional(),
});

export type BaseOptionParams = z.infer<typeof baseOptionSchema>;
export type AccountOptionParams = z.infer<typeof accountOptionSchema>;
export type CategoryOptionParams = z.infer<typeof categoryOptionSchema>;
export type TransactionOptionParams = z.infer<typeof transactionOptionSchema>;
export type TransactionChartOptionParams = z.infer<
  typeof transactionChartOptionSchema
>;
export type TransactionIdQuery = z.infer<typeof transactionIdQuerySchema>;
