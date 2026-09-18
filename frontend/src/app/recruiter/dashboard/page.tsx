"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { CardSkeletonList, StatCardSkeleton } from "@/components/ui/skeleton";
import { Plus, Users, Edit, Briefcase, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RecruiterDashboardPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const res = await api.get("/opportunities");
        if (res.success) setOpportunities(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, []);

  // Compute stats from loaded data
  const activeCount = opportunities.filter((o) => o.status === "OPEN").length;
  const totalApplicants = opportunities.reduce((sum, o) => sum + (o.applicantCount ?? 0), 0);
  const totalShortlisted = opportunities.reduce((sum, o) => sum + (o.shortlistedCount ?? 0), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Recruiter Dashboard</h1>
          <p className="mt-2 text-slate-600">Manage your posted opportunities and review candidates.</p>
        </div>
        <Link href="/recruiter/opportunities/new">
          <Button className="gap-2">
            <Plus size={18} /> Post Opportunity
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
              <Briefcase size={16} className="text-emerald-500" /> Active Opportunities
            </div>
            <p className="text-3xl font-bold text-slate-900">{activeCount}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
              <TrendingUp size={16} className="text-green-500" /> Total Posted
            </div>
            <p className="text-3xl font-bold text-slate-900">{opportunities.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
              <Users size={16} className="text-purple-500" /> Total Applicants
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalApplicants > 0 ? totalApplicants : "—"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
              <Users size={16} className="text-amber-500" /> Shortlisted
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalShortlisted > 0 ? totalShortlisted : "—"}</p>
          </div>
        </div>
      )}

      {/* Opportunities List */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Opportunities</h2>

      {loading ? (
        <CardSkeletonList count={3} />
      ) : opportunities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Briefcase size={32} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No opportunities posted yet</h3>
          <p className="mt-1 text-sm text-slate-500">Create your first opportunity to start receiving applications.</p>
          <Link href="/recruiter/opportunities/new">
            <Button variant="outline" className="mt-4">Create Opportunity</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {opportunities.map((opp) => (
            <div key={opp.id} className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-lg font-bold text-slate-900">{opp.title}</h2>
                  <StatusBadge status={opp.status} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} /> {opp.type}
                  </span>
                  <span>•</span>
                  <span>{opp.workMode}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> Deadline: {new Date(opp.applicationDeadline).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <Users size={14} /> {opp.applicantCount || 0} Applications
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link href={`/recruiter/opportunities/${opp.id}/edit`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit size={14} /> Edit
                  </Button>
                </Link>
                <Link href={`/recruiter/opportunities/${opp.id}/candidates`}>
                  <Button size="sm" className="gap-2">
                    <Users size={14} /> View Candidates
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
