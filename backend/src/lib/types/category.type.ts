import { transactionType } from "@/generated/prisma/enums";

export interface CreateCategoryDTO {
  name: string;
  type: transactionType;
}

export interface UpdateCategoryDTO {
  name?: string;
  type?: transactionType;
}
