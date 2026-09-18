"use client";

import Link from "next/link";
import { useAuthStore } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, GraduationCap } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 shadow-sm shadow-slate-950/5 backdrop-blur-xl">
      <div className="container mx-auto flex min-h-16 items-center justify-between gap-3 px-4">
        <Link href={user?.role === "STUDENT" ? "/student/profile" : user?.role === "RECRUITER" ? "/recruiter/dashboard" : user?.role === "ADMIN" ? "/admin/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
            <GraduationCap size={20} />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight sm:text-xl">
            Rozgar Saathi
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="flex max-w-[36vw] items-center gap-1 overflow-x-auto text-sm font-medium text-slate-600 lg:max-w-none">
              {user.role === "STUDENT" && (
                <>
                  <Link href="/student/profile" className={cn("rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600", pathname === "/student/profile" && "bg-blue-50 text-blue-600 font-semibold")}>
                    Profile
                  </Link>
                  <Link href="/student/skills" className={cn("rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600", pathname === "/student/skills" && "bg-blue-50 text-blue-600 font-semibold")}>
                    Skills
                  </Link>
                  <Link href="/student/skill-gaps" className={cn("rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600", pathname === "/student/skill-gaps" && "bg-blue-50 text-blue-600 font-semibold")}>
                    Skill Gaps
                  </Link>
                  <Link href="/student/opportunities" className={cn("rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600", pathname.startsWith("/student/opportunities") && "bg-blue-50 text-blue-600 font-semibold")}>
                    Opportunities
                  </Link>
                  <Link href="/student/applications" className={cn("rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600", pathname === "/student/applications" && "bg-blue-50 text-blue-600 font-semibold")}>
                    Applications
                  </Link>
                </>
              )}
              {user.role === "RECRUITER" && (
                <>
                  <Link href="/recruiter/dashboard" className={cn("rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600", pathname === "/recruiter/dashboard" && "bg-blue-50 text-blue-600 font-semibold")}>
                    Dashboard
                  </Link>
                  <Link href="/recruiter/opportunities/new" className={cn("rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600", pathname === "/recruiter/opportunities/new" && "bg-blue-50 text-blue-600 font-semibold")}>
                    Post Opportunity
                  </Link>
                </>
              )}
              {user.role === "ADMIN" && (
                <>
                  <Link href="/admin/dashboard" className={cn("rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600", pathname === "/admin/dashboard" && "bg-blue-50 text-blue-600 font-semibold")}>
                    Dashboard
                  </Link>
                  <Link href="/admin/users" className={cn("rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 hover:text-blue-600", pathname === "/admin/users" && "bg-blue-50 text-blue-600 font-semibold")}>
                    Users
                  </Link>
                </>
              )}
            </nav>
            <ThemeToggle />
            <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:gap-3 sm:pl-4">
              <div className="hidden text-right text-sm sm:block">
                <p className="font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={logout} title="Log out">
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
