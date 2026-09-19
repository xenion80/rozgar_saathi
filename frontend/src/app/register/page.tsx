"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.post("/register", { name, email, password, role });
      if (response.success) {
        // Automatically route to login
        router.push("/login");
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center pt-20 sm:pt-25 md:pt-30 pb-5 sm:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Join Rozgar Saathi today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-400">Full Name</label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
                placeholder="Enter Full Name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-400">Email address</label>
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
              <label className="text-sm font-medium text-slate-700 dark:text-slate-400">Password</label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  placeholder="Enter Password"
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
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-400">I am a</label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("STUDENT")}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95 ${
                    role === "STUDENT"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-600"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("RECRUITER")}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95 ${
                    role === "RECRUITER"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-600"
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-500">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
