import z from "zod";

export const accountTypeList = [
  "cash",
  "e_wallet",
  "bank",
  "investment",
] as const;
export type AccountType = (typeof accountTypeList)[number];

export const currencyCodeList = ["IDR", "USD", "SGD", "EUR"] as const;
export type CurrencyCode = (typeof currencyCodeList)[number];

export type Accounts = {
  id: string;
  name: string;
  balance: string; // aslinya decimal (15,2) biar aman pakek string
  type: AccountType;
  currency_code: CurrencyCode;
  createdAt: number;
  updatedAt: number;
};

export const createAccountSchema = z.object({
  name: z
    .string({ message: "name is required" })
    .min(2, { message: "name must be at least 2 characters" }),
  type: z.enum(accountTypeList, {
    message:
      "account type must be either 'cash', 'e_wallet', 'bank' or 'investment'",
  }),
  currency_code: z.enum(currencyCodeList, {
    message: "currency code must be either 'IDR','USD','SGD' or 'EUR'",
  }),
  balance: z.number().default(0),
});

export const updateAccountSchema = createAccountSchema
  .extend({
    balance: z.number().optional(),
  })
  .partial();

export type CreateAccountDTO = z.infer<typeof createAccountSchema>;
export type UpdateAccountDTO = z.infer<typeof updateAccountSchema>;
