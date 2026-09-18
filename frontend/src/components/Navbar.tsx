"use client";

import Link from "next/link";
import { useAuthStore } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, GraduationCap, Briefcase } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={user?.role === "STUDENT" ? "/student/profile" : user?.role === "RECRUITER" ? "/recruiter/dashboard" : user?.role === "ADMIN" ? "/admin/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <GraduationCap size={20} />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Rozgar Saathi
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
              {user.role === "STUDENT" && (
                <>
                  <Link href="/student/profile" className={cn("transition-colors hover:text-blue-600", pathname === "/student/profile" && "text-blue-600 font-semibold")}>
                    Profile
                  </Link>
                  <Link href="/student/skills" className={cn("transition-colors hover:text-blue-600", pathname === "/student/skills" && "text-blue-600 font-semibold")}>
                    Skills
                  </Link>
                  <Link href="/student/opportunities" className={cn("transition-colors hover:text-blue-600", pathname.startsWith("/student/opportunities") && "text-blue-600 font-semibold")}>
                    Opportunities
                  </Link>
                  <Link href="/student/applications" className={cn("transition-colors hover:text-blue-600", pathname === "/student/applications" && "text-blue-600 font-semibold")}>
                    Applications
                  </Link>
                </>
              )}
              {user.role === "RECRUITER" && (
                <>
                  <Link href="/recruiter/dashboard" className={cn("transition-colors hover:text-blue-600", pathname === "/recruiter/dashboard" && "text-blue-600 font-semibold")}>
                    Dashboard
                  </Link>
                  <Link href="/recruiter/opportunities/new" className={cn("transition-colors hover:text-blue-600", pathname === "/recruiter/opportunities/new" && "text-blue-600 font-semibold")}>
                    Post Opportunity
                  </Link>
                </>
              )}
              {user.role === "ADMIN" && (
                <>
                  <Link href="/admin/dashboard" className={cn("transition-colors hover:text-blue-600", pathname === "/admin/dashboard" && "text-blue-600 font-semibold")}>
                    Dashboard
                  </Link>
                  <Link href="/admin/users" className={cn("transition-colors hover:text-blue-600", pathname === "/admin/users" && "text-blue-600 font-semibold")}>
                    Users
                  </Link>
                </>
              )}
            </nav>
            <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
              <div className="text-sm">
                <p className="font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} title="Log out">
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
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
