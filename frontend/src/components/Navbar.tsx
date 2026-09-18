"use client";

import Link from "next/link";
import { useAuthStore } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const getDashboardLink = () => {
    if (user?.role === "STUDENT") return "/student/dashboard";
    if (user?.role === "RECRUITER") return "/recruiter/dashboard";
    if (user?.role === "ADMIN") return "/admin/dashboard";
    return "/";
  };

  const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
    <Link
      href={href}
      className={cn(
        "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
        isActive ? "text-indigo-700 dark:text-indigo-400" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 rounded-full bg-indigo-100 dark:bg-indigo-500/20"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </Link>
  );

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between rounded-full glass-panel px-4 sm:px-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
        <Link href={getDashboardLink()} className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg transition-transform group-hover:scale-105">
            <Image src="/Rozgar_Saathi.webp" alt="Rozgar Saathi Logo" width={40} height={40} className="object-cover" />
          </div>
          <span className="text-xl font-extrabold tracking-wider text-slate-900 dark:text-white hidden sm:block">
            Rozgar Saathi
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-6">
            <nav className="hidden items-center gap-1 lg:flex overflow-x-auto">
              {user.role === "STUDENT" && (
                <>
                  <NavLink href="/student/dashboard" isActive={pathname === "/student/dashboard"}>Overview</NavLink>
                  <NavLink href="/student/opportunities" isActive={pathname.startsWith("/student/opportunities")}>Find Jobs</NavLink>
                  <NavLink href="/student/skill-gaps" isActive={pathname.startsWith("/student/skill-gaps")}>Skill Gap</NavLink>
                  <NavLink href="/student/applications" isActive={pathname === "/student/applications"}>Applications</NavLink>
                  <NavLink href="/student/profile" isActive={pathname === "/student/profile"}>Profile</NavLink>
                </>
              )}
              {user.role === "RECRUITER" && (
                <>
                  <NavLink href="/recruiter/dashboard" isActive={pathname === "/recruiter/dashboard"}>Overview</NavLink>
                  <NavLink href="/recruiter/pipeline" isActive={pathname === "/recruiter/pipeline"}>Pipeline</NavLink>
                  <NavLink href="/recruiter/analytics" isActive={pathname === "/recruiter/analytics"}>Analytics</NavLink>
                  <NavLink href="/recruiter/opportunities/new" isActive={pathname === "/recruiter/opportunities/new"}>Post Job</NavLink>
                </>
              )}
              {user.role === "ADMIN" && (
                <>
                  <NavLink href="/admin/dashboard" isActive={pathname === "/admin/dashboard"}>Overview</NavLink>
                  <NavLink href="/admin/users" isActive={pathname === "/admin/users"}>Users</NavLink>
                  <NavLink href="/admin/reports" isActive={pathname === "/admin/reports"}>Reports</NavLink>
                </>
              )}
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{user.role}</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400" onClick={logout} title="Log out">
                <LogOut size={18} />
              </Button>
              {/* Mobile menu button */}
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                <Menu size={20} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" className="rounded-full font-medium">Log in</Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 border-0">Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
