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
  const accessToken = res.data.data.token.accessToken;
  localStorage.setItem("accessToken", accessToken);
  return res.data;
};

export const authRegister = async (
  dto: CreateUserInput,
): Promise<ApiResponse<AuthResponse>> => {
  const res = await instance.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    dto,
  );
  const accessToken = res.data.data.token.accessToken;
  localStorage.setItem("accessToken", accessToken);
  return res.data;
};

export const authLogout = async (): Promise<ApiResponse<null>> => {
  const res = await instance.post<ApiResponse<null>>("/auth/logout");
  localStorage.removeItem("accessToken");
  return res.data;
};

export const authMe = async () => {
  const res = await instance.get<ApiResponse<AuthMe>>("/auth/me");
  return res.data;
};
