import { transactionType } from "@/generated/prisma/enums";
import { ValidationError } from "./error.utils";

const validationUtils = {
  matchingPassword(password: string, confPassword: string) {
    if (password !== confPassword)
      throw new ValidationError("password and confirm password not match!");
  },

  requiredValue(value: number | string | undefined, valueName: string) {
    if (!value) throw new ValidationError(`${valueName} is required!`);
  },

  isTransactionType(type: transactionType) {
    if (type !== "expense" && type !== "income")
      throw new ValidationError("type must be expense or income!");
  },
};

export default validationUtils;
