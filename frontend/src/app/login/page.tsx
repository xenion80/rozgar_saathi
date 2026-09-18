"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.post("/login", { email, password });
      if (response.success && response.data) {
        const { id, name, email: userEmail, role, accessToken } = response.data;
        const user = { id, name: name || userEmail.split('@')[0], email: userEmail, role };
        setAuth(user, accessToken);
        if (user.role === "STUDENT") {
          router.push("/student/profile");
        } else if (user.role === "RECRUITER") {
          router.push("/recruiter/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      setError(err?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-100"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Please sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Email address</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="example@gmail.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-500">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
