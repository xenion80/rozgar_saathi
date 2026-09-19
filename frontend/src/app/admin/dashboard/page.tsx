"use client";

import { useEffect, useState } from "react";
import { rootApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { Users, GraduationCap, Briefcase, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  enabled?: boolean;
}

interface PageData {
  content: User[];
  totalElements: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Fetching a large set for client-side aggregation as per requirements
        const res = await rootApi.get<any>("/admin/users?page=0&size=1000");
        if (res.success && res.data) {
          setData(res.data.content || []);
          setTotal(res.data.totalElements || 0);
        } else {
          setData(res.content || []);
          setTotal(res.totalElements || 0);
        }
      } catch (err: any) {
        console.error(err);
        setError("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <LoadingState title="Loading dashboard..." />;
  if (error) return <ErrorState title="Error" message={error} />;

  const students = data.filter(u => u.role === "STUDENT").length;
  const recruiters = data.filter(u => u.role === "RECRUITER").length;
  const admins = data.filter(u => u.role === "ADMIN").length;

  return (
    <div className="space-y-6 pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-5 sm:pb-10 md:pb-15 lg:pb-20 ">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Overview of the Rozgar Saathi platform.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recruiters</CardTitle>
            <Briefcase className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recruiters}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 pt-4">
        <Link href="/admin/candidates">
          <Button variant="outline">Manage Candidates</Button>
        </Link>
        <Link href="/admin/recruiters">
          <Button variant="outline">Manage Recruiters</Button>
        </Link>
      </div>
    </div>
  );
}
