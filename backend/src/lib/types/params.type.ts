export interface OptionParam {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface AccountOptionParam extends OptionParam {
  type: "cash" | "e_wallet" | "bank" | "investment" | "all";
}

export interface TransactionOptionParam extends OptionParam {
  type?: "income" | "expense" | "all";
  on_date?: number;
  to_date?: number;
}
