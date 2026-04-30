import { z } from "zod";

export const baseOptionSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  search: z.string().default(""),
  sortBy: z.string().default("updatedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const accountOptionSchema = baseOptionSchema.extend({
  type: z
    .enum(["cash", "e_wallet", "bank", "investment", "all"])
    .default("all"),
});

export const categoryOptionSchema = baseOptionSchema.extend({
  type: z.enum(["income", "expense", "all"]).default("all"),
});

export const transactionOptionSchema = baseOptionSchema.extend({
  type: z.enum(["income", "expense", "all"]).default("all"),
  from_date: z.coerce.number().optional(),
  to_date: z.coerce.number().optional(),
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
