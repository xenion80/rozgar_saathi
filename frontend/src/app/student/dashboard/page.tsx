"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Star, Send, CheckCircle2, Search, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    recommendedJobs: 12,
    savedJobs: 3,
    applications: 5,
    profileCompletion: 75
  });

  const [loading, setLoading] = useState(true);

  // Mock data for now, ideally fetch from backend
  useEffect(() => {
    // In a real app, fetch dashboard stats here
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Good morning, {user?.name || "Student"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Here is what is happening with your job search.
          </p>
        </div>
        <Link href="/student/opportunities">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Search size={16} /> Find jobs
          </Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              <Briefcase size={16} className="text-indigo-500" /> Recommended jobs
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.recommendedJobs}</p>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              <Star size={16} className="text-amber-500" /> Saved jobs
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.savedJobs}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              <Send size={16} className="text-emerald-500" /> Applications sent
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.applications}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              <CheckCircle2 size={16} className="text-purple-500" /> Profile completion
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.profileCompletion}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Recommendations & Activity */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Profile Completion Nudge */}
          {stats.profileCompletion < 100 && (
            <Card className="border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-500/5">
              <CardContent className="p-5 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Profile completion</h3>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{stats.profileCompletion}%</span>
                  </div>
                  <Progress value={stats.profileCompletion} className="h-2 bg-indigo-100 dark:bg-slate-700" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Add your educational history to improve your match score.
                  </p>
                </div>
                <Link href="/student/profile">
                  <Button variant="outline" size="sm" className="shrink-0 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                    Update Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Recommended Jobs Preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recommended for you</h2>
              <Link href="/student/recommended">
                <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400">View all</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {/* Mock Recommended Job */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <Briefcase className="text-slate-500" size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Junior Frontend Engineer</h3>
                    <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded">95% Match</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">TechNova Solutions • Remote</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  <Briefcase className="text-slate-500" size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">React Developer</h3>
                    <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded">88% Match</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">CreativeMinds • Mumbai</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Timeline */}
        <div>
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute top-2 bottom-2 left-2.75 w-0.5 bg-slate-100 dark:bg-slate-700"></div>
                <div className="space-y-6">
                  <div className="relative flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 z-10 ring-4 ring-white dark:ring-slate-800">
                      <Send size={12} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Application Submitted</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Frontend Developer at TechNova</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1"><Clock size={12}/> 2 hours ago</p>
                    </div>
                  </div>
                  <div className="relative flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 z-10 ring-4 ring-white dark:ring-slate-800">
                      <CheckCircle2 size={12} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Application Shortlisted</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">UI Designer at CreativeMinds</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1"><Clock size={12}/> 1 day ago</p>
                    </div>
                  </div>
                  <div className="relative flex gap-4 opacity-75">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 flex items-center justify-center shrink-0 z-10 ring-4 ring-white dark:ring-slate-800">
                      <Send size={12} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Application Submitted</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Data Analyst at DataCorp</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1"><Clock size={12}/> 3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <Link href="/student/applications">
                  <Button variant="ghost" className="w-full text-sm text-indigo-600 dark:text-indigo-400">
                    View all activity <ArrowRight size={14} className="ml-1"/>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
