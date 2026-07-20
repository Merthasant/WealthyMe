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

const getQueryKeyAccount = (key: string, id?: string) => ["account", key, id];

// get one account
const getQueryOptionsOneAccount = (id: string) => {
  return queryOptions({
    queryKey: getQueryKeyAccount("one", id),
    queryFn: () => getOneAccount(id),
  });
};

type UseGetOneAccountParams = {
  queryConfig?: QueryConfig<typeof getQueryOptionsOneAccount>;
};

export const useGetOneAccount = (
  id: string,
  params: UseGetOneAccountParams = {},
) => {
  return useQuery({
    ...getQueryOptionsOneAccount(id),
    ...params?.queryConfig,
  });
};

// get all account

const getQueryOptionsAllAccount = () => {
  return queryOptions({
    queryKey: getQueryKeyAccount("all"),
    queryFn: getAllAccounts,
  });
};

type UseGetAllAccountParams = {
  queryConfig?: QueryConfig<typeof getQueryOptionsAllAccount>;
};

export const useGetAllAccount = (params: UseGetAllAccountParams = {}) => {
  return useQuery({
    ...getQueryOptionsAllAccount(),
    ...params?.queryConfig,
  });
};

// create account

type CreateAccountParams = {
  mutationConfig?: MutationConfig<typeof createAccount>;
};

export const useCreateAccount = (
  dto: CreateAccountDTO,
  params: CreateAccountParams = {},
) => {
  return useMutation({
    mutationFn: () => createAccount(dto),
    ...params?.mutationConfig,
  });
};

// update account

type UpdateAccountParams = {
  mutationConfig?: MutationConfig<typeof updateAccount>;
};

export const useUpdateAccount = (
  dto: UpdateAccountDTO,
  params: UpdateAccountParams = {},
) => {
  return useMutation({
    mutationFn: () => updateAccount(dto),
    ...params?.mutationConfig,
  });
};

// delete account

type DeleteAccountParams = {
  mutationConfig?: MutationConfig<typeof deleteAccount>;
};

export const useDeleteAccount = (
  id: string,
  params: DeleteAccountParams = {},
) => {
  return useMutation({
    mutationFn: () => deleteAccount(id),
    ...params?.mutationConfig,
  });
};
