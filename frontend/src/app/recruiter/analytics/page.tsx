"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Calendar as CalendarIcon, Eye, Users, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>({
    jobViews: 0, jobViewsGrowth: 0,
    totalApplications: 0, applicationsGrowth: 0,
    qualifiedCandidates: 0, qualifiedGrowth: 0,
    avgTimeToReview: 0, timeToReviewGrowth: 0,
    applicationsOverTime: [],
    funnel: { viewed: 0, applied: 0, shortlisted: 0, interviewed: 0, offered: 0, offerRate: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/recruiter/analytics");
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your hiring performance and candidate metrics.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <CalendarIcon size={16} /> Last 30 Days
          </Button>
          <Button variant="outline" className="gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Download size={16} /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Job Views</div>
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                <Eye size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{data.jobViews.toLocaleString()}</div>
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              {data.jobViewsGrowth > 0 ? "+" : ""}{data.jobViewsGrowth}% <span className="text-slate-400 dark:text-slate-500 font-normal">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Applications</div>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Users size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{data.totalApplications.toLocaleString()}</div>
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              {data.applicationsGrowth > 0 ? "+" : ""}{data.applicationsGrowth}% <span className="text-slate-400 dark:text-slate-500 font-normal">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Qualified Candidates</div>
              <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                <CheckCircle size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{data.qualifiedCandidates.toLocaleString()}</div>
            <div className="text-xs font-medium text-amber-600 dark:text-amber-500 flex items-center gap-1">
              {data.qualifiedGrowth > 0 ? "+" : ""}{data.qualifiedGrowth}% <span className="text-slate-400 dark:text-slate-500 font-normal">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg Time to Review</div>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Clock size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{data.avgTimeToReview} <span className="text-xl">days</span></div>
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              {data.timeToReviewGrowth > 0 ? "+" : ""}{data.timeToReviewGrowth}d <span className="text-slate-400 dark:text-slate-500 font-normal">faster</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Applications Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            {/* CSS Mock Chart */}
            <div className="h-64 flex items-end gap-2 mt-4 relative">
              <div className="absolute left-0 top-0 bottom-0 w-full flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-slate-300 dark:border-slate-600 w-full h-0"></div>
                <div className="border-b border-slate-300 dark:border-slate-600 w-full h-0"></div>
                <div className="border-b border-slate-300 dark:border-slate-600 w-full h-0"></div>
                <div className="border-b border-slate-300 dark:border-slate-600 w-full h-0"></div>
              </div>
              
              {(data.applicationsOverTime || []).map((val: number, i: number) => (
                <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                  <div 
                    className="w-full bg-indigo-500 dark:bg-indigo-400 rounded-t-sm hover:bg-indigo-600 dark:hover:bg-indigo-300 transition-colors" 
                    style={{ height: `${val}%` }}
                  ></div>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 transition-opacity">
                    {val * 5} apps
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-medium text-slate-400">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Candidate Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Viewed Job</span>
                  <span className="font-bold text-slate-900 dark:text-white">{data.funnel?.viewed?.toLocaleString() || 0}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Applied</span>
                  <span className="font-bold text-slate-900 dark:text-white">{data.funnel?.applied?.toLocaleString() || 0}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${(data.funnel?.applied / (data.funnel?.viewed || 1)) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Shortlisted</span>
                  <span className="font-bold text-slate-900 dark:text-white">{data.funnel?.shortlisted?.toLocaleString() || 0}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${(data.funnel?.shortlisted / (data.funnel?.viewed || 1)) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Interviewed</span>
                  <span className="font-bold text-slate-900 dark:text-white">{data.funnel?.interviewed?.toLocaleString() || 0}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${(data.funnel?.interviewed / (data.funnel?.viewed || 1)) * 100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Offered</span>
                  <span className="font-bold text-slate-900 dark:text-white">{data.funnel?.offered?.toLocaleString() || 0}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(data.funnel?.offered / (data.funnel?.viewed || 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 text-center">
              Your application-to-offer rate is <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.funnel?.offerRate || 0}%</span> (above industry average).
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
