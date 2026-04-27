import z from "zod";

export const createAccountSchema = z.object({
  name: z
    .string({ message: "name is required" })
    .min(2, { message: "name must be at least 2 characters" }),
  type: z.enum(["cash", "e_wallet", "bank", "investment"], {
    message: "Invalid account type",
  }),
  currency_code: z.enum(["IDR", "USD", "SGD", "EUR"], {
    message: "Invalid currency code",
  }),
  balance: z.coerce.number().default(0),
});

export const updateAccountSchema = createAccountSchema.partial();

export type CreateAccountDTO = z.infer<typeof createAccountSchema>;
export type UpdateAccountDTO = z.infer<typeof updateAccountSchema>;
