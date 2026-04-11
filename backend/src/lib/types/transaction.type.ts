export interface CreateTransactionDTO {
  amount: number;
  type: "income" | "expense";
  transactionAt: number;
  deletedAt: null;
  categoryId: string;
  currency_code: "IDR" | "USD" | "SGD" | "EUR";
  note?: string;
  receiptUrl?: string;
}

export interface UpdateTransactionDTO {
  amount?: number;
  type?: "income" | "expense";
  transactionAt?: number;
  deletedAt?: number;
  categoryId?: number;
  currency_code?: "IDR" | "USD" | "SGD" | "EUR";
  note?: string;
  receiptUrl?: string;
}
