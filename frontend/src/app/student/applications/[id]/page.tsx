"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get("/applications/me");
        if (res.success) {
          const app = res.data.find((a: any) => a.id.toString() === id);
          setApplication(app);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-slate-500">Loading application details...</div>;
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-xl font-bold text-slate-900">Application not found</h3>
        <Link href="/student/applications">
          <Button variant="outline" className="mt-4">Back to Applications</Button>
        </Link>
      </div>
    );
  }

  // Timeline logic
  const stages = ["APPLIED", "SHORTLISTED", "INTERVIEW", "DECISION"];
  
  let currentStageIndex = 0;
  if (application.status === "SHORTLISTED") currentStageIndex = 1;
  else if (application.status === "INTERVIEW") currentStageIndex = 2;
  else if (["SELECTED", "REJECTED", "WITHDRAWN"].includes(application.status)) currentStageIndex = 3;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl space-y-6 pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-10 sm:pb-15">
      <Link href="/student/applications">
        <Button variant="ghost" className="gap-2 -ml-3 text-slate-600">
          <ArrowLeft size={16} /> Back to Applications
        </Button>
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{application.opportunityTitle}</h1>
            <p className="text-lg text-slate-600 mt-1">{application.companyName}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                <Clock size={14} /> Applied on {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : "—"}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                Last updated {application.updatedAt ? new Date(application.updatedAt).toLocaleDateString() : "—"}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            <StatusBadge status={application.status} />
            <div className="text-right">
              <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Match Score</span>
              <span className={`text-3xl font-extrabold leading-none ${application.matchScore >= 60 ? "text-green-500" : "text-amber-500"}`}>
                {application.matchScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Application Status Timeline</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
          <div className="space-y-8 relative z-10">
            
            <div className="flex gap-4">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white ${currentStageIndex >= 0 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                <CheckCircle2 size={16} />
              </div>
              <div className="pt-1">
                <h3 className={`font-semibold ${currentStageIndex >= 0 ? "text-slate-900" : "text-slate-500"}`}>Application Submitted</h3>
                <p className="text-sm text-slate-500 mt-1">Your application and cover letter were received by the recruiter.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white ${currentStageIndex >= 1 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                {currentStageIndex >= 1 ? <CheckCircle2 size={16} /> : <div className="h-2 w-2 rounded-full bg-slate-400"></div>}
              </div>
              <div className="pt-1">
                <h3 className={`font-semibold ${currentStageIndex >= 1 ? "text-slate-900" : "text-slate-500"}`}>Application Reviewed</h3>
                <p className="text-sm text-slate-500 mt-1">The recruiter has reviewed your profile and shortlisted you.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white ${currentStageIndex >= 2 ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                {currentStageIndex >= 2 ? <CheckCircle2 size={16} /> : <div className="h-2 w-2 rounded-full bg-slate-400"></div>}
              </div>
              <div className="pt-1">
                <h3 className={`font-semibold ${currentStageIndex >= 2 ? "text-slate-900" : "text-slate-500"}`}>Interview Phase</h3>
                <p className="text-sm text-slate-500 mt-1">You have been selected for an interview.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-4 border-white ${
                  application.status === "SELECTED" ? "bg-green-500 text-white" :
                  ["REJECTED", "WITHDRAWN"].includes(application.status) ? "bg-red-500 text-white" :
                  "bg-slate-200 text-slate-400"
                }`}>
                {application.status === "SELECTED" ? <CheckCircle2 size={16} /> :
                 ["REJECTED", "WITHDRAWN"].includes(application.status) ? <XCircle size={16} /> :
                 <div className="h-2 w-2 rounded-full bg-slate-400"></div>}
              </div>
              <div className="pt-1">
                <h3 className={`font-semibold ${currentStageIndex >= 3 ? "text-slate-900" : "text-slate-500"}`}>
                  {application.status === "SELECTED" ? "Offer Extended" :
                   application.status === "REJECTED" ? "Application Rejected" :
                   application.status === "WITHDRAWN" ? "Application Withdrawn" :
                   "Final Decision"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {application.status === "SELECTED" ? "Congratulations! You have been selected for this role." :
                   application.status === "REJECTED" ? "Unfortunately, the recruiter has chosen to move forward with other candidates." :
                   application.status === "WITHDRAWN" ? "You withdrew this application." :
                   "Awaiting the final decision from the recruiter."}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Your Cover Letter</h2>
        <div className="rounded-lg bg-slate-50 p-4 border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">
          {application.coverLetter || <span className="italic text-slate-400">No cover letter provided with this application.</span>}
        </div>
      </div>
    </motion.div>
  );
}
