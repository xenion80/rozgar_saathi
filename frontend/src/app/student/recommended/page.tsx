"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CardSkeletonList } from "@/components/ui/skeleton";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RecommendedOpportunitiesPage() {
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await api.get("/opportunities/recommended");
        if (res.success) setRecommended(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommended();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            Recommended for You
          </h1>
          <p className="mt-2 text-slate-600">Opportunities matched based on your skills and target role.</p>
        </div>
        <Link href="/student/opportunities">
          <Button variant="ghost" className="gap-2 text-slate-600">
            <ArrowLeft size={16} /> All Opportunities
          </Button>
        </Link>
      </div>

      {loading ? (
        <CardSkeletonList count={3} />
      ) : recommended.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Sparkles size={32} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No strong matches found</h3>
          <p className="mt-2 text-sm text-slate-500">
            Try adding more skills to your profile to see better recommendations.
          </p>
          <Link href="/student/skills">
            <Button variant="outline" className="mt-4">Update Skills</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {recommended.map((opp) => (
            <Link key={opp.opportunityId} href={`/student/opportunities/${opp.opportunityId}`}>
              <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-150 hover:border-blue-300 hover:shadow-md">

                {/* Match Score Badge */}
                <div className={`absolute right-0 top-0 rounded-bl-xl px-4 py-2 font-bold text-white text-sm ${
                  opp.matchScore >= 60 ? "bg-green-500" : "bg-amber-500"
                }`}>
                  {opp.matchScore}% Match
                </div>

                <div className="pr-28">
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {opp.opportunityTitle}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {opp.matchedSkills.map((skill: string) => (
                      <span key={skill} className="inline-flex rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        ✓ {skill}
                      </span>
                    ))}
                    {opp.missingSkills.map((skill: string) => (
                      <span key={skill} className="inline-flex rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        ✕ {skill}
                      </span>
                    ))}
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
