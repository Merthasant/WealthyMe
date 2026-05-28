import type { ApiError } from "@/lib/types/api.type";
import { navigateTo } from "@/lib/utils/navigate.utils";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

const interceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("accessToken");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      const newToken = response.headers["x-new-access-token"] as string;
      if (newToken) {
        const tokenValue = newToken.startsWith("Bearer")
          ? newToken.split(" ")[1]
          : newToken;
        localStorage.setItem("accessToken", tokenValue);
      }
      return response;
    },
    (err: AxiosError<ApiError>) => {
      const status = err.status;

      if (status === 401) {
        localStorage.removeItem("accessToken");
        navigateTo("/sign-in");
      }

      const normalizedError: ApiError = {
        message: err.response?.data.message ?? "server error",
        statusCode: err.status ?? 500,
        errors: err.response?.data.errors,
      };
      return Promise.reject(normalizedError);
    },
  );
};

export default interceptors;
