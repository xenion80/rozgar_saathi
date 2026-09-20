"use client";

import { useEffect, useState } from "react";
import { rootApi } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserX, UserCheck, Mail, Shield, User as UserIcon, Clock } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/context/AuthContext";

interface UserDetail {
  id: number;
  name: string;
  email: string;
  role: string;
  enabled?: boolean;
  createdAt?: string;
}

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await rootApi.get<any>(`/admin/users/${id}`);
      if (res.success) {
        setUser(res.data);
      } else {
        setUser(res);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load user details.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;
    
    const action = user.enabled !== false ? "disable" : "enable";
    const confirmMessage = action === "disable" 
      ? "Are you sure you want to disable this account? The user will no longer be able to log in and their sessions will be revoked." 
      : "Are you sure you want to enable this account?";
      
    if (!window.confirm(confirmMessage)) return;

    try {
      setActionLoading(true);
      await rootApi.patch(`/admin/users/${id}/${action}`, {});
      await fetchUser(); // Refresh user state
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} user.`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingState title="Loading user details..." />;
  if (error || !user) return <ErrorState title="User Not Found" message={error || "The requested user could not be found."} />;

  const isSelf = currentUser?.email === user.email;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/admin/users">
          <Button variant="ghost" size="sm" className="mb-4 -ml-3 text-slate-500 dark:text-slate-300">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Users
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">User Details</h1>
            {user.enabled !== false ? (
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 py-1 px-3 text-sm">Active</Badge>
            ) : (
              <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200 py-1 px-3 text-sm">Disabled</Badge>
            )}
          </div>
          
          <Button 
            variant={user.enabled !== false ? "outline" : "default"} 
            className={user.enabled !== false ? "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" : ""}
            onClick={handleToggleStatus}
            disabled={actionLoading || isSelf}
          >
            {user.enabled !== false ? (
              <><UserX className="h-4 w-4 mr-2" /> Disable User</>
            ) : (
              <><UserCheck className="h-4 w-4 mr-2" /> Enable User</>
            )}
          </Button>
        </div>
      </div>

      <Card className="dark:bg-slate-900 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Basic account details for #{user.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <div className="h-16 w-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-300">
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100">{user.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                <Mail className="h-4 w-4" /> {user.email}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <Shield className="h-4 w-4" /> Role
              </p>
              <Badge variant="secondary" className="font-medium text-sm dark:text-slate-100 px-3">
                {user.role}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Member Since
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available"}
              </p>
            </div>
            {/* Add more fields here as backend expands */}
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-100 dark:border-red-900 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-red-900 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>Administrative actions for this account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-red-50/50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
            <div>
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                {user.enabled !== false ? "Disable Account" : "Enable Account"}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                {user.enabled !== false 
                  ? "Disabling this account will prevent the user from logging in and revoke their active sessions." 
                  : "Enabling this account will restore the user's access to the platform."}
              </p>
            </div>
            <Button 
              variant={user.enabled !== false ? "destructive" : "default"} 
              onClick={handleToggleStatus}
              disabled={actionLoading || isSelf}
            >
              {user.enabled !== false ? (
                <><UserX className="h-4 w-4 mr-2" /> Disable User</>
              ) : (
                <><UserCheck className="h-4 w-4 mr-2" /> Enable User</>
              )}
            </Button>
          </div>
          {isSelf && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-3 font-medium">
              You cannot modify the status of your own account.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
