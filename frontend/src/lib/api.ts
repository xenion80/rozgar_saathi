import axios, { type AxiosRequestConfig } from "axios";
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

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  withCredentials: true,
});

// Add access token to authenticated requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle API responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

// Handle auth responses
authApi.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

