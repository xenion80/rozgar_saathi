"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CardSkeletonList } from "@/components/ui/skeleton";
import { ArrowLeft, Sparkles, Building2, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

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

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight text-black dark:text-white">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/25">
              <Sparkles size={24} />
            </span>
            Recommended For You
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Opportunities hand-picked by our matching algorithm based on your verified skills and target role.
          </p>
        </div>
        <Link href="/student/opportunities">
          <Button variant="outline" className="gap-2 rounded-full glass-panel dark:hover:bg-slate-800">
            <ArrowLeft size={16} /> All Opportunities
          </Button>
        </Link>
      </div>

      {loading ? (
        <CardSkeletonList count={3} />
      ) : recommended.length === 0 ? (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-3xl glass-panel p-16 text-center"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Sparkles size={40} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-black dark:text-white">No strong matches yet</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md">
            We need more data to find your perfect match. Try adding more skills or completing assessments.
          </p>
          <Link href="/student/skills">
            <Button className="mt-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25">
              Update My Skills
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6">
          {recommended.map((opp) => (
            <motion.div key={opp.opportunityId} variants={item}>
              <Link href={`/student/opportunities/${opp.opportunityId}`}>
                <div className="group relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 dark:hover:border-emerald-400/30">
                  
                  {/* Decorative Glow */}
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl transition-all duration-500 group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-400/10"></div>

                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-black dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {opp.title || opp.opportunityTitle}
                        </h2>
                        
                        {/* Fallback rendering for Company/Location if API provides it in the future, else styled generic badges */}
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                          {opp.companyName ? (
                            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
                              <Building2 size={14} className="text-slate-400" /> {opp.companyName}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
                              <Building2 size={14} className="text-slate-400" /> Hiring Partner
                            </span>
                          )}
                          
                          {opp.location && (
                            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
                              <MapPin size={14} className="text-slate-400" /> {opp.location}
                            </span>
                          )}

                          {opp.type && (
                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-1">
                              <Briefcase size={14} /> {opp.type}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {opp.matchedSkills?.length > 0 && (
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Matched Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {opp.matchedSkills.map((skill: string) => (
                                <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20">
                                  ✓ {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {opp.missingSkills?.length > 0 && (
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Missing Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {opp.missingSkills.map((skill: string) => (
                                <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-400 ring-1 ring-inset ring-rose-600/20">
                                  ✕ {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Match Score Indicator */}
                    <div className="shrink-0">
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full glass-panel shadow-sm">
                        <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-slate-100 dark:text-slate-800"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${opp.matchScore}, 100`}
                            className={opp.matchScore >= 60 ? "text-emerald-500" : "text-amber-500"}
                          />
                        </svg>
                        <div className="text-center">
                          <span className="block text-2xl font-black text-black dark:text-white leading-none">{opp.matchScore}%</span>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Match</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
