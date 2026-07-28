import type {
  Accounts,
  CreateAccountDTO,
  UpdateAccountDTO,
} from "@/lib/types/account.type";
import type { ApiResponse } from "@/lib/types/api.type";
import instance from "../axios";
import type { AccountOptionParams } from "@/lib/types/options-param";

// create account
export const createAccount = async (
  dto: CreateAccountDTO,
): Promise<ApiResponse<Accounts>> => {
  const res = await instance.post<ApiResponse<Accounts>>("/account", dto);
  return res.data;
};

// get one account
export const getOneAccount = async (
  id: string,
): Promise<ApiResponse<Accounts>> => {
  const res = await instance.get<ApiResponse<Accounts>>(`/account/${id}`);
  return res.data;
};

// get all accounts
export const getAllAccounts = async (
  params: AccountOptionParams = {
    limit: 25,
    page: 1,
    search: "",
    sortBy: "updatedAt",
    sortOrder: "desc",
    type: "all",
  },
): Promise<ApiResponse<Accounts[]>> => {
  const res = await instance.get<ApiResponse<Accounts[]>>("/account", {
    params,
  });
  return res.data;
};

// update account
export const updateAccount = async (
  dto: UpdateAccountDTO,
): Promise<ApiResponse<Accounts>> => {
  const res = await instance.patch<ApiResponse<Accounts>>("/account", dto);
  return res.data;
};

// delete account
export const deleteAccount = async (id: string): Promise<ApiResponse<null>> => {
  const res = await instance.delete<ApiResponse<null>>(`/account/${id}`);
  return res.data;
};
