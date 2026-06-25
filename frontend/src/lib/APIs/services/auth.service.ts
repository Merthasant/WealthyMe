import type { LoginInput, AuthResponse, AuthMe } from "@/lib/types/auth.type";
import instance from "../axios";
import type { ApiResponse } from "@/lib/types/api.type";
import type { CreateUserInput } from "@/lib/types/user.type";

export const authLogin = async (
  dto: LoginInput,
): Promise<ApiResponse<AuthResponse>> => {
  const res = await instance.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    dto,
  );
  return res.data;
};

export const authRegister = async (
  dto: CreateUserInput,
): Promise<ApiResponse<AuthResponse>> => {
  const res = await instance.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    dto,
  );
  return res.data;
};

export const authLogout = async (): Promise<ApiResponse<null>> => {
  const res = await instance.post<ApiResponse<null>>("/auth/logout");
  return res.data;
};

export const authRefresh = async (): Promise<
  ApiResponse<{ accessToken: string }>
> => {
  const res =
    await instance.get<ApiResponse<{ accessToken: string }>>("/auth/refresh");
  return res.data;
};

export const authMe = async () => {
  const res = await instance.get<ApiResponse<AuthMe>>("/auth/me");
  return res.data;
};
