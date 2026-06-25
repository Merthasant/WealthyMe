import type { ApiError } from "@/lib/types/api.type";
import { navigateTo } from "@/lib/utils/navigate.utils";
import { useAuthStore } from "@/store/auth.store";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { authRefresh } from "../services/auth.service";

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
};

const setAccessToken = useAuthStore.getState().setAccessToken;
const logout = useAuthStore.getState().logout;

const interceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
        setAccessToken(tokenValue);
      }
      return response;
    },
    async (err: AxiosError<ApiError>) => {
      const originalRequest = err.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      const status = err.response?.status;

      if (
        status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/refresh")
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(instance(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await authRefresh();
          const newToken = res.data?.accessToken;
          if (!newToken) throw new Error("no access token returned");

          setAccessToken(newToken);
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          setAccessToken(null);
          logout();
          navigateTo("/sign-in");
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      }

      const normalizedError: ApiError = {
        message: err.response?.data.message ?? "server error",
        statusCode: status ?? 500,
        errors: err.response?.data.errors,
      };
      return Promise.reject(normalizedError);
    },
  );
};

export default interceptors;
