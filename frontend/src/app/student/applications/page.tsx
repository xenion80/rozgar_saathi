"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { CardSkeletonList } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import Link from "next/link";

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/me");
      if (res.success) setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id: number) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    try {
      await api.patch(`/applications/${id}/withdraw`);
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert("Failed to withdraw application.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
        <p className="mt-2 text-slate-600">Track the status of your opportunity applications.</p>
      </div>

      {loading ? (
        <CardSkeletonList count={3} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium text-slate-900">No applications found</h3>
              <p className="mt-1 text-sm text-slate-500">You haven't applied to any opportunities yet.</p>
              <Link href="/student/recommended">
                <Button variant="outline" className="mt-4">Find Opportunities</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-700">
                  <tr>
                    <th className="px-6 py-4">Opportunity</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Match Score</th>
                    <th className="px-6 py-4">Cover Letter</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/student/opportunities/${app.opportunityId}`} className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                          {app.opportunityTitle}
                        </Link>
                        <div className="text-xs text-slate-500 mt-0.5">{app.companyName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-center font-bold">
                        <span className={app.matchScore >= 60 ? "text-green-600" : "text-amber-500"}>
                          {app.matchScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="line-clamp-2 max-w-50 text-xs text-slate-500" title={app.coverLetter}>
                          {app.coverLetter || <span className="italic text-slate-400">None provided</span>}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {app.status !== "WITHDRAWN" && app.status !== "REJECTED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleWithdraw(app.id)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Withdraw
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
