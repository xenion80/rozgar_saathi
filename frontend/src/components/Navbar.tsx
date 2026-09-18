"use client";

import Link from "next/link";
import { useAuthStore } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

import Image from "next/image";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const getDashboardLink = () => {
    if (user?.role === "STUDENT") return "/student/profile";
    if (user?.role === "RECRUITER") return "/recruiter/dashboard";
    if (user?.role === "ADMIN") return "/admin/dashboard";
    return "/";
  };

  const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
    <Link 
      href={href} 
      className={cn(
        "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
        isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-500/20"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </Link>
  );

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between rounded-full glass-panel px-4 sm:px-6">
        <Link href={getDashboardLink()} className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg shadow-md transition-transform group-hover:scale-105">
            <Image src="/Rozgar_Saathi.webp" alt="Rozgar Saathi Logo" width={40} height={40} className="object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900  hidden sm:block">
            Rozgar Saathi
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-6">
            <nav className="hidden items-center gap-1 md:flex">
              {user.role === "STUDENT" && (
                <>
                  <NavLink href="/student/profile" isActive={pathname === "/student/profile"}>Profile</NavLink>
                  <NavLink href="/student/skills" isActive={pathname === "/student/skills"}>Skills</NavLink>
                  <NavLink href="/student/skill-gaps" isActive={pathname === "/student/skill-gaps"}>Skill Gaps</NavLink>
                  <NavLink href="/student/opportunities" isActive={pathname.startsWith("/student/opportunities")}>Opportunities</NavLink>
                  <NavLink href="/student/applications" isActive={pathname === "/student/applications"}>Applications</NavLink>
                </>
              )}
              {user.role === "RECRUITER" && (
                <>
                  <NavLink href="/recruiter/dashboard" isActive={pathname === "/recruiter/dashboard"}>Dashboard</NavLink>
                  <NavLink href="/recruiter/opportunities/new" isActive={pathname === "/recruiter/opportunities/new"}>Post Opportunity</NavLink>
                </>
              )}
              {user.role === "ADMIN" && (
                <>
                  <NavLink href="/admin/dashboard" isActive={pathname === "/admin/dashboard"}>Dashboard</NavLink>
                  <NavLink href="/admin/users" isActive={pathname === "/admin/users"}>Users</NavLink>
                </>
              )}
            </nav>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.name}</p>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{user.role}</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400" onClick={logout} title="Log out">
                <LogOut size={18} />
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
              <Button className="rounded-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 border-0">Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
