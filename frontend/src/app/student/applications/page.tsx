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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-10 sm:pb-15">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Applications</h1>
        <p className="mt-2 text-slate-600 dark:text-white">Track the status of your opportunity applications.</p>
      </div>

      {loading ? (
        <CardSkeletonList count={3} />
      ) : (
        <div className="overflow-hidden">
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">No applications found</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-white">You haven't applied to any opportunities yet.</p>
              <Link href="/student/recommended">
                <Button variant="outline" className="mt-4 dark:text-white dark:border-white">Find Opportunities</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-white border-separate border-spacing-y-3">
                <thead className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-white">
                  <tr>
                    <th className="px-6 py-2">Opportunity</th>
                    <th className="px-6 py-2">Status</th>
                    <th className="px-6 py-2 text-center">Match Score</th>
                    <th className="px-6 py-2 whitespace-nowrap">Applied Date</th>
                    <th className="px-6 py-2 whitespace-nowrap">Last Updated</th>
                    <th className="px-6 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="dark:text-white">
                  {applications.map((app) => {
                    const tdClass = "px-6 py-4 border-y-2 border-slate-200 dark:border-slate-700 group-hover:border-green-400 dark:group-hover:border-green-400! bg-white dark:bg-slate-900 transition-colors";
                    const firstTdClass = `${tdClass} border-l-2 rounded-l-xl`;
                    const lastTdClass = `${tdClass} border-r-2 rounded-r-xl`;
                    return (
                    <tr key={app.id} className="group">
                      <td className={firstTdClass}>
                        <Link href={`/student/opportunities/${app.opportunityId}`} className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors dark:text-white">
                          {app.opportunityTitle}
                        </Link>
                        <div className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">{app.companyName}</div>
                      </td>
                      <td className={tdClass}>
                        <StatusBadge status={app.status} />
                      </td>
                      <td className={`${tdClass} text-center font-bold`}>
                        <span className={app.matchScore >= 60 ? "text-green-600" : "text-amber-500"}>
                          {app.matchScore}%
                        </span>
                      </td>
                      <td className={`${tdClass} text-xs text-slate-500 dark:text-slate-300 whitespace-nowrap`}>
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className={`${tdClass} text-xs text-slate-500 dark:text-slate-300 whitespace-nowrap`}>
                        {app.updatedAt ? new Date(app.updatedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className={`${lastTdClass} text-right`}>
                        <Link href={`/student/applications/${app.id}`}>
                          <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
                            View Details
                          </Button>
                        </Link>
                        {app.status !== "WITHDRAWN" && app.status !== "REJECTED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleWithdraw(app.id)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 ml-2"
                          >
                            Withdraw
                          </Button>
                        )}
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
