import {
  authLogin,
  authRegister,
  authLogout,
  authMe,
} from "@/lib/APIs/services/auth.service";
import { useQuery } from "@tanstack/react-query";
import type { CreateUserInput } from "../types/user.type";
import type { LoginInput } from "../types/auth.type";

export const useAuthLogin = (dto: LoginInput) => {
  return useQuery({
    queryKey: ["auth", "login"],
    queryFn: () => authLogin(dto),
  });
};

export const useAuthRegister = (dto: CreateUserInput) => {
  return useQuery({
    queryKey: ["auth", "register"],
    queryFn: () => authRegister(dto),
  });
};

export const useAuthLogout = () => {
  return useQuery({
    queryKey: ["auth", "logout"],
    queryFn: authLogout,
  });
};

export const useAuthMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authMe,
    enabled: !!localStorage.getItem("accessToken"),
    retry: false,
    staleTime: Infinity,
  });
};
