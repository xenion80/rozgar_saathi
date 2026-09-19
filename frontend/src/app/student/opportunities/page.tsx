"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Briefcase, BrainCircuit, MapPin, Clock, ArrowRight, Building2, Search, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardSkeletonList } from "@/components/ui/skeleton";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedOpps, setSavedOpps] = useState<string[]>([]);

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedOpps(prev => 
      prev.includes(id) ? prev.filter(oppId => oppId !== id) : [...prev, id]
    );
  };

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

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-10 sm:pb-15">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">All Opportunities</h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            Browse all available jobs, internships, and projects across our network.
          </p>
        </div>
        <Link href="/student/recommended">
          <Button className="group gap-2 rounded-full bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 border-0">
            <SparklesIcon className="h-4 w-4" /> View Recommended 
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {loading ? (
        <CardSkeletonList count={4} />
      ) : opportunities.length === 0 ? (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-3xl glass-panel p-16 text-center"
        >
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Search size={40} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No opportunities available</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md">
            Check back later as recruiters are constantly posting new roles, or explore your recommended matches.
          </p>
          <Link href="/student/recommended">
            <Button variant="outline" className="mt-8 rounded-full">View Recommended</Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 sm:grid-cols-2">
          {opportunities.map((opp) => (
            <motion.div key={opp.id} variants={item} className="h-full">
              <div className="relative h-full">
              <Link href={`/student/opportunities/${opp.id}`} className="block h-full">
                <div className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 dark:hover:border-emerald-400/30">
                  
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {opp.title}
                        </h2>
                        <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                          <Building2 size={16} /> {opp.companyName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={(opp.type?.toLowerCase()) as any}>{opp.type}</Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full z-20 hover:bg-slate-100 dark:hover:bg-slate-800"
                          onClick={(e) => toggleSave(e, opp.id)}
                        >
                          <Bookmark size={18} className={savedOpps.includes(opp.id) ? "fill-indigo-500 text-indigo-500" : "text-slate-400"} />
                        </Button>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {opp.description || "No description provided."}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
                      <MapPin size={14} className="text-slate-400" /> {opp.location}
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
                      <Briefcase size={14} className="text-slate-400" /> {opp.workMode}
                    </div>
                    <div className="flex w-full items-center gap-1.5 mt-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                      <Clock size={14} className="text-emerald-400" /> 
                      <span>Apply by {new Date(opp.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Analyze Gap — only shown when matchScore field exists and ≥75 */}
              {opp.matchScore >= 75 && (
                <Link
                  href={`/student/skill-gaps?opp=${opp.id}`}
                  className="absolute bottom-5 right-5 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="sm"
                    className="gap-1.5 rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700 text-xs"
                  >
                    <BrainCircuit size={13} /> Analyze Gap
                  </Button>
                </Link>
              )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
