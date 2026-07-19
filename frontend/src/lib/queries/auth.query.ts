import {
  authMe,
  authLogin,
  authRegister,
  authLogout,
} from "@/lib/APIs/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import type { LoginInput } from "../types/auth.type";
import type { MutationConfig } from "../types/query.type";
import type { CreateUserInput } from "../types/user.type";

// auth me query
const getAccessToken = () => useAuthStore.getState().accessToken;

const getAuthQueryKey = (key: string) => ["auth", key];

const getAuthMeQueryOptions = () => {
  return queryOptions({
    queryKey: getAuthQueryKey("me"),
    queryFn: authMe,
  });
};

export const useAuthMe = () => {
  return useQuery({
    ...getAuthMeQueryOptions(),
    enabled: !!getAccessToken,
    retry: false,
    staleTime: Infinity,
  });
};
// auth login mutation
type AuthLoginParams = { mutationConfig?: MutationConfig<typeof authLogin> };

export const useAuthLogin = (params: AuthLoginParams = {}) => {
  return useMutation({
    mutationFn: (data: LoginInput) => authLogin(data),
    ...params.mutationConfig,
  });
};

// auth register mutation
type AuthRegisterParams = {
  mutationConfig?: MutationConfig<typeof authRegister>;
};

export const useAuthRegister = (params: AuthRegisterParams = {}) => {
  return useMutation({
    mutationFn: (data: CreateUserInput) => authRegister(data),
    ...params.mutationConfig,
  });
};

// auth logout mutation
type AuthLogoutParams = {
  mutationConfig?: MutationConfig<typeof authLogout>;
};

export const useAuthLogout = (params: AuthLogoutParams = {}) => {
  return useMutation({
    mutationFn: () => authLogout(),
    ...params.mutationConfig,
  });
};
