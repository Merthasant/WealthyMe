import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import {
  createAccount,
  deleteAccount,
  getAllAccounts,
  getOneAccount,
  updateAccount,
} from "../APIs/services/account.service";
import type { MutationConfig, QueryConfig } from "../types/query.type";
import type { CreateAccountDTO, UpdateAccountDTO } from "../types/account.type";

export const getQueryKeyOneAccount = (id: string) => ["account", "one", id];

// get one account
const getQueryOptionsOneAccount = (id: string) => {
  return queryOptions({
    queryKey: getQueryKeyOneAccount(id),
    queryFn: () => getOneAccount(id),
  });
};

type UseGetOneAccountParams = {
  queryConfig?: QueryConfig<typeof getQueryOptionsOneAccount>;
  id: string;
};

export const useGetOneAccount = (params: UseGetOneAccountParams) => {
  return useQuery({
    ...getQueryOptionsOneAccount(params.id),
    ...params.queryConfig,
  });
};

// get all account

export const getQueryKeyAllAccount = () => ["account", "all"];

const getQueryOptionsAllAccount = () => {
  return queryOptions({
    queryKey: getQueryKeyAllAccount(),
    queryFn: getAllAccounts,
  });
};

type UseGetAllAccountParams = {
  queryConfig?: QueryConfig<typeof getQueryOptionsAllAccount>;
};

export const useGetAllAccount = (params: UseGetAllAccountParams = {}) => {
  return useQuery({
    ...getQueryOptionsAllAccount(),
    ...params.queryConfig,
  });
};

// create account

type CreateAccountParams = {
  mutationConfig?: MutationConfig<typeof createAccount>;
};

export const useCreateAccount = (params: CreateAccountParams = {}) => {
  return useMutation({
    mutationFn: (data: CreateAccountDTO) => createAccount(data),
    ...params.mutationConfig,
  });
};

// update account

type UpdateAccountParams = {
  mutationConfig?: MutationConfig<typeof updateAccount>;
};

export const useUpdateAccount = (params: UpdateAccountParams = {}) => {
  return useMutation({
    mutationFn: (data: UpdateAccountDTO) => updateAccount(data),
    ...params.mutationConfig,
  });
};

// delete account

type DeleteAccountParams = {
  mutationConfig?: MutationConfig<typeof deleteAccount>;
};

export const useDeleteAccount = (params: DeleteAccountParams = {}) => {
  return useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    ...params.mutationConfig,
  });
};
