"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Filter, Search, MoreHorizontal, User } from "lucide-react";
import { motion } from "framer-motion";

type Candidate = {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  stage: "NEW" | "SCREENING" | "INTERVIEW" | "OFFER";
  appliedAt: string;
};

export default function HiringPipelinePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: "1", name: "Arjun Kumar", role: "Frontend Developer", matchScore: 92, stage: "NEW", appliedAt: "2d ago" },
    { id: "2", name: "Priya Singh", role: "Frontend Developer", matchScore: 88, stage: "NEW", appliedAt: "3d ago" },
    { id: "3", name: "Sneha Patel", role: "Product Designer", matchScore: 85, stage: "SCREENING", appliedAt: "1w ago" },
    { id: "4", name: "Rahul Joshi", role: "Frontend Developer", matchScore: 78, stage: "SCREENING", appliedAt: "2w ago" },
    { id: "5", name: "Ananya Desai", role: "Product Designer", matchScore: 95, stage: "INTERVIEW", appliedAt: "3w ago" },
    { id: "6", name: "Vikram Sharma", role: "Data Analyst", matchScore: 82, stage: "OFFER", appliedAt: "1mo ago" }
  ]);

  const [activeRoleFilter, setActiveRoleFilter] = useState("All");
  
  const roles = ["All", "Frontend Developer", "Product Designer", "Data Analyst"];
  
  const stages = [
    { id: "NEW", name: "New Applicants", color: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-900/50" },
    { id: "SCREENING", name: "Screening", color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50" },
    { id: "INTERVIEW", name: "Interview", color: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-900/50" },
    { id: "OFFER", name: "Offer Extended", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50" }
  ];

  const filteredCandidates = activeRoleFilter === "All" 
    ? candidates 
    : candidates.filter(c => c.role === activeRoleFilter);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hiring Pipeline</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track candidates across all active roles.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm w-64 outline-none focus:border-indigo-500"
            />
          </div>
          <Button variant="outline" className="gap-2 bg-white dark:bg-slate-800">
            <Filter size={16} /> Filters
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 shrink-0">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setActiveRoleFilter(role)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
              activeRoleFilter === role 
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Pipeline Board */}
      <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
        {stages.map(stage => {
          const stageCandidates = filteredCandidates.filter(c => c.stage === stage.id);
          
          return (
            <div key={stage.id} className="flex flex-col w-80 shrink-0">
              <div className={`px-4 py-3 rounded-t-xl border-x border-t font-semibold text-sm flex justify-between items-center ${stage.color}`}>
                <span>{stage.name}</span>
                <span className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full text-xs">{stageCandidates.length}</span>
              </div>
              
              <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/30 border-x border-b border-slate-200 dark:border-slate-800 rounded-b-xl p-3 flex flex-col gap-3 overflow-y-auto">
                {stageCandidates.map(candidate => (
                  <Card key={candidate.id} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm cursor-grab hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500 text-xs">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{candidate.name}</h4>
                            <p className="text-xs text-slate-500">{candidate.appliedAt}</p>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                      
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                        <Briefcase size={12} /> {candidate.role}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          candidate.matchScore >= 90 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                          candidate.matchScore >= 75 ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" :
                          "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        }`}>
                          {candidate.matchScore}% Match
                        </span>
                        
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {stageCandidates.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    <User size={24} className="text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-sm text-slate-400 dark:text-slate-500">No candidates in this stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
