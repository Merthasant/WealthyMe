export interface CreateAccountDTO {
  name: string;
  type: "cash" | "e_wallet" | "bank" | "investment";
  account_code: "IDR" | "USD" | "SGD" | "EUR";
  balance?: number;
}

export interface UpdateAccountDTO {
  name?: string;
  type?: "cash" | "e_wallet" | "bank" | "investment";
  account_code: "IDR" | "USD" | "SGD" | "EUR";
  balance?: number;
}
