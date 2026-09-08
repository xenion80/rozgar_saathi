import axios from "axios";
import { useAuthStore } from "@/context/AuthContext";

const API_BASE_URL = "http://localhost:8080/api";
const AUTH_BASE_URL = "http://localhost:8080/auth";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

authApi.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error.message)
);

export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data: T;
};

declare module "axios" {
  export interface AxiosInstance {
    request<T = any, R = ApiResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
    get<T = any, R = ApiResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    delete<T = any, R = ApiResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    head<T = any, R = ApiResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    options<T = any, R = ApiResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    post<T = any, R = ApiResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    put<T = any, R = ApiResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
    patch<T = any, R = ApiResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  }
}
