export interface CreateAccountDTO {
  name: string;
  type: "cash" | "e_wallet" | "bank" | "investment";
  balance?: number;
}

export interface UpdateAccountDTO {
  name?: string;
  type?: "cash" | "e_wallet" | "bank" | "investment";
  balance?: number;
}
