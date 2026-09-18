"use client";

import { useState, useEffect } from "react";
import { rootApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  enabled?: boolean;
}

interface PageData {
  content: User[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

interface UsersTableProps {
  roleFilter?: "STUDENT" | "RECRUITER" | "ADMIN" | "ALL";
  title: string;
  description: string;
}

export function UsersTable({ roleFilter = "ALL", title, description }: UsersTableProps) {
  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const fetchUsers = async (pageIndex: number) => {
    try {
      setLoading(true);
      // We fetch more elements if we need to filter client-side due to backend limitations
      const size = roleFilter === "ALL" && !search ? 10 : 1000;
      const res = await rootApi.get<any>(`/admin/users?page=${roleFilter === "ALL" && !search ? pageIndex : 0}&size=${size}&sort=id,asc`);
      
      let pageData: PageData = res.success ? res.data : res;
      
      if (roleFilter !== "ALL" || search) {
        let filtered = pageData.content || [];
        if (roleFilter !== "ALL") filtered = filtered.filter((u: User) => u.role === roleFilter);
        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter((u: User) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
        }
        
        // Manual pagination for client-side filtered data
        const pageSize = 10;
        const totalElements = filtered.length;
        const totalPages = Math.ceil(totalElements / pageSize);
        const start = pageIndex * pageSize;
        const pagedContent = filtered.slice(start, start + pageSize);

        pageData = {
          content: pagedContent,
          totalPages,
          totalElements,
          number: pageIndex,
          size: pageSize
        };
      }
      
      setData(pageData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page, roleFilter, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
  };

  if (loading && !data) return <LoadingState title="Loading users..." />;
  if (error) return <ErrorState title="Error" message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="text-slate-500 mt-2">{description}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input 
            placeholder="Search by name or email..." 
            value={search}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        {data?.content.length === 0 ? (
          <EmptyState title="No users found" message="Try adjusting your search criteria." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.content.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">#{user.id}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={
                        user.role === "STUDENT" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
                        user.role === "RECRUITER" ? "text-orange-700 bg-orange-50 border-orange-200" :
                        "text-slate-700 bg-slate-100 border-slate-200"
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {user.enabled !== false ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md text-xs font-medium border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 px-2 py-1 rounded-md text-xs font-medium border border-red-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/users/${user.id}`}>
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{data.number * data.size + 1}</span> to <span className="font-medium text-slate-900">{Math.min((data.number + 1) * data.size, data.totalElements)}</span> of <span className="font-medium text-slate-900">{data.totalElements}</span> results
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={data.number === 0 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
                disabled={data.number >= data.totalPages - 1 || loading}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
