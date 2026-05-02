import z from "zod";

export const createAccountSchema = z.object({
  name: z
    .string({ message: "name is required" })
    .min(2, { message: "name must be at least 2 characters" }),
  type: z.enum(["cash", "e_wallet", "bank", "investment"], {
    message:
      "account type must be either 'cash', 'e_wallet', 'bank' or 'investment'",
  }),
  currency_code: z.enum(["IDR", "USD", "SGD", "EUR"], {
    message: "currency code must be either 'IDR','USD','SGD' or 'EUR'",
  }),
  balance: z.coerce.number().default(0),
});

export const updateAccountSchema = createAccountSchema
  .extend({
    balance: z.coerce.number().optional(),
  })
  .partial();

export type CreateAccountDTO = z.infer<typeof createAccountSchema>;
export type UpdateAccountDTO = z.infer<typeof updateAccountSchema>;
