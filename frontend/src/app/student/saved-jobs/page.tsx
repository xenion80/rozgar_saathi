"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, Bookmark, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SavedJobsPage() {
  // Mock data for saved jobs
  const [savedJobs, setSavedJobs] = useState([
    {
      id: 1,
      title: "Product Designer",
      company: "CreativeMinds",
      location: "Mumbai",
      type: "Full-time",
      salary: "₹12L - ₹18L",
      savedAt: "2026-09-18T10:00:00Z",
      closingDate: "2026-10-15T00:00:00Z",
      matchScore: 85
    },
    {
      id: 2,
      title: "Data Analyst",
      company: "DataCorp",
      location: "Bangalore",
      type: "Full-time",
      salary: "₹10L - ₹14L",
      savedAt: "2026-09-15T14:30:00Z",
      closingDate: "2026-09-30T00:00:00Z",
      matchScore: 72
    }
  ]);

  const [viewMode, setViewMode] = useState<"list" | "card">("card");

  const removeJob = (id: number) => {
    setSavedJobs(savedJobs.filter(job => job.id !== id));
  };

  if (savedJobs.length === 0) {
    return (
      <div className="mx-auto max-w-4xl pt-12">
        <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-500 mb-6">
            <Bookmark size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No saved jobs yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
            Save roles you want to revisit later. They will appear here for easy access.
          </p>
          <Link href="/student/opportunities">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Search size={16} /> Find jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Jobs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            You have {savedJobs.length} saved {savedJobs.length === 1 ? "opportunity" : "opportunities"}.
          </p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode("card")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === "card" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            Cards
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === "list" ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            List
          </button>
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map(job => (
            <Card key={job.id} className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    <Briefcase className="text-slate-500" size={24} />
                  </div>
                  <button onClick={() => removeJob(job.id)} className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2 rounded-full transition-colors" title="Remove from saved">
                    <Bookmark size={20} className="fill-current" />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{job.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{job.company}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="flex items-center text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    <MapPin size={12} className="mr-1" /> {job.location}
                  </span>
                  <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    {job.salary}
                  </span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Saved: {new Date(job.savedAt).toLocaleDateString()}</span>
                    <span className="text-amber-600 dark:text-amber-500 flex items-center gap-1"><Clock size={12} /> Closes {new Date(job.closingDate).toLocaleDateString()}</span>
                  </div>
                  <Link href={`/student/opportunities/${job.id}`}>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Apply Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Saved Date</th>
                <th className="px-6 py-4 font-medium">Closing Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {savedJobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 dark:text-white text-base">{job.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{job.company} • {job.location}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {new Date(job.savedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Clock size={14} className="text-amber-500"/> {new Date(job.closingDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => removeJob(job.id)} className="text-slate-400 hover:text-red-500 p-2 transition-colors">
                      <Bookmark size={18} className="fill-current" />
                    </button>
                    <Link href={`/student/opportunities/${job.id}`}>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">Apply</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
