import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authApi } from "@/lib/api";

type Role = "STUDENT" | "RECRUITER" | "ADMIN" | "USER";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, token) => set({ user, accessToken: token }),
      logout: () => {
        set({ user: null, accessToken: null });
        authApi.post("/logout").catch(() => {});
        window.location.href = "/login";
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage), // Store in session storage, not local storage for better security as per requirements
    }
  )
);
