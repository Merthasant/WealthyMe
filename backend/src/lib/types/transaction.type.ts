import z from "zod";

export const createTransactionSchema = z.object({
  amount: z.coerce.number(),
  type: z.enum(["income", "expense"], {
    message: "type must be either 'income' or 'expense'",
  }),
  transactionAt: z.coerce.number().int().min(1).max(2_147_483_647, {
    message:
      "transactionAt must be a valid timestamp in milliseconds on int32 range",
  }),
  deletedAt: z.coerce
    .number()
    .int()
    .min(1)
    .max(2_147_483_647, {
      message:
        "deletedAt must be a valid timestamp in milliseconds on int32 range",
    })
    .optional(),
  categoryId: z.uuid({ message: "category id is uuid" }),
  currency_code: z.enum(["IDR", "USD", "SGD", "EUR"], {
    message: "currency code must be either 'IDR','USD','SGD' or 'EUR'",
  }),
  note: z
    .string()
    .max(255, { message: "note must be at most 255 characters long" })
    .optional(),
  receiptUrl: z.string().optional(),
  receiptPublicId: z.string().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>;
