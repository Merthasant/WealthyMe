import { ValidationError } from "./error.utils";

const validationUtils = {
  matchingPassword(password: string, confPassword: string) {
    if (password !== confPassword)
      throw new ValidationError("password and confirm password not match!");
  },

  requiredValue(value: number | string | undefined, valueName: string) {
    if (!value) throw new ValidationError(`${valueName} is required!`);
  },
};

export default validationUtils;
