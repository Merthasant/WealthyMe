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
