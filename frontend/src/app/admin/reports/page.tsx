"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Calendar as CalendarIcon, Users, Briefcase, Activity, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminReportsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Platform-wide analytics and health metrics.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <CalendarIcon size={16} /> Last 30 Days
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Download size={16} /> Export Master Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Users</div>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Users size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">24,592</div>
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              +12% <span className="text-slate-400 dark:text-slate-500 font-normal">vs last period</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Jobs</div>
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                <Briefcase size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">3,405</div>
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              +5% <span className="text-slate-400 dark:text-slate-500 font-normal">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Matches Made</div>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Activity size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">18,240</div>
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              +24% <span className="text-slate-400 dark:text-slate-500 font-normal">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Moderation</div>
              <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-lg">
                <AlertCircle size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">42</div>
            <div className="text-xs font-medium text-amber-600 dark:text-amber-500 flex items-center gap-1">
              Needs review <span className="text-slate-400 dark:text-slate-500 font-normal">ASAP</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">User Growth</CardTitle>
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
              
              {[30, 45, 55, 60, 75, 80, 85, 100].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                  <div 
                    className="w-full bg-indigo-500 dark:bg-indigo-400 rounded-t-sm" 
                    style={{ height: `${val}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-medium text-slate-400">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">API Uptime</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Trailing 30 days</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">99.98%</span>
                </div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Avg Response Time</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Global median</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">124ms</span>
                </div>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Database Load</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Current primary cluster</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">34%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Error Rate</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Last 24 hours</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">0.02%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
