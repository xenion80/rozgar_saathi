"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardSkeletonList } from "@/components/ui/skeleton";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OpportunitiesPage() {
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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">All Opportunities</h1>
          <p className="mt-2 text-slate-600">Browse all available jobs, internships, and projects.</p>
        </div>
        <Link href="/student/recommended">
          <Button variant="outline" className="gap-2">
            View Recommended <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      {loading ? (
        <CardSkeletonList count={4} />
      ) : opportunities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Briefcase size={32} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No opportunities available</h3>
          <p className="mt-1 text-sm text-slate-500">Check back later or explore recommended matches.</p>
          <Link href="/student/recommended">
            <Button variant="outline" className="mt-4">View Recommended</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {opportunities.map((opp) => (
            <Link key={opp.id} href={`/student/opportunities/${opp.id}`}>
              <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-150 hover:border-blue-300 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {opp.title}
                    </h2>
                    <p className="mt-1 font-medium text-slate-700">{opp.companyName}</p>
                  </div>
                  <Badge variant={(opp.type?.toLowerCase()) as any}>{opp.type}</Badge>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-slate-400" /> {opp.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={15} className="text-slate-400" /> {opp.workMode}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={15} className="text-slate-400" /> Apply by {new Date(opp.applicationDeadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
