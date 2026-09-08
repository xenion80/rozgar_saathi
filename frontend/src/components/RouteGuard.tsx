"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/context/AuthContext";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const publicPaths = ["/", "/login", "/register"];
    const isPublic = publicPaths.includes(pathname);

    if (!user && !isPublic) {
      router.push("/login");
      return;
    }

    if (user) {
      if (isPublic && pathname !== "/") {
        // Redirect authenticated users away from login/register
        router.push(user.role === "STUDENT" ? "/student/profile" : "/recruiter/dashboard");
        return;
      }
      
      // Role protection
      if (pathname.startsWith("/student") && user.role !== "STUDENT") {
        router.push("/recruiter/dashboard");
      }
      if (pathname.startsWith("/recruiter") && user.role !== "RECRUITER") {
        router.push("/student/profile");
      }
    }
  }, [user, pathname, router, mounted]);

  if (!mounted) return null; // Prevent hydration mismatch

  return <>{children}</>;
}
