import axios, {
  type AxiosRequestConfig,
  type AxiosInstance,
} from "axios";
import { useAuthStore } from "@/context/AuthContext";

declare const process: {
  env: {
    NEXT_PUBLIC_BACKEND_URL?: string;
  };
};

const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

const API_BASE_URL = `${BACKEND_URL}/api`;
const AUTH_BASE_URL = `${BACKEND_URL}/auth`;

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  timeStamp: string;
  error: string;
  status: number;
  path: string;
};

type ApiClient = {
  get<T = any>(
      url: string,
      config?: AxiosRequestConfig
  ): Promise<T>;

  post<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
  ): Promise<T>;

  put<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
  ): Promise<T>;

  patch<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
  ): Promise<T>;

  delete<T = any>(
      url: string,
      config?: AxiosRequestConfig
  ): Promise<T>;
};

const axiosApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const axiosAuth = axios.create({
  baseURL: AUTH_BASE_URL,
  withCredentials: true,
});

const axiosRoot = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

axiosApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosApi.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }

      return Promise.reject(error);
    }
);

axiosAuth.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

axiosRoot.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosRoot.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }

      return Promise.reject(error);
    }
);

export const api = axiosApi as unknown as ApiClient;
export const authApi = axiosAuth as unknown as ApiClient;
export const rootApi = axiosRoot as unknown as ApiClient;