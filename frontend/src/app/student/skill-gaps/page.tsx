"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Target, ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";

interface SkillGap {
  skill: string;
  currentProficiency: string;
  requiredProficiency: string;
  importance: string;
}

interface SkillGapResponse {
  hasTargetRole: boolean;
  targetRole: string | null;
  gaps: SkillGap[];
  recommendations: string[];
}

export default function SkillGapsPage() {
  const [data, setData] = useState<SkillGapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkillGaps = async () => {
      try {
        const res = await api.get<any>("/students/me/skill-gaps");
        if (res.success) {
          setData(res.data);
        } else {
          // If the backend doesn't wrap in success envelope yet
          setData(res);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load skill gaps analysis. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSkillGaps();
  }, []);

  if (loading) return <LoadingState title="Analyzing your profile..." message="Comparing your skills against industry requirements." />;
  if (error) return <ErrorState title="Analysis Failed" message={error} />;

  if (data && !data.hasTargetRole) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card className="border-emerald-200">
          <CardHeader className="bg-emerald-50/50 pb-8">
            <div className="flex justify-center mb-6 mt-4">
              <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <Target className="h-10 w-10" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Set Your Career Goal</CardTitle>
            <CardDescription className="text-center text-lg mt-2">
              We need to know your target role to analyze your skill gaps.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 flex flex-col items-center">
            <p className="text-slate-600 dark:text-slate-300 text-center mb-8 max-w-md">
              Update your profile with your target role to get personalized recommendations on what skills you need to improve to become job-ready.
            </p>
            <Link href="/student/profile">
              <Button size="lg" className="px-8">
                Update Profile <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Skill Gap Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
          Target Role: <Badge variant="secondary" className="text-emerald-700 bg-emerald-50">{data?.targetRole}</Badge>
        </p>
      </div>

      {!data?.gaps || data.gaps.length === 0 ? (
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Lightbulb className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-2">You're on track!</h3>
            <p className="text-emerald-700 max-w-md">
              We didn't find any major skill gaps for {data?.targetRole}. Keep practicing and consider taking assessments to prove your proficiency.
            </p>
            <Link href="/student/opportunities" className="mt-6">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Browse Opportunities</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Identified Gaps</CardTitle>
                <CardDescription>Skills you need to learn or improve for this role.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.gaps.map((gap, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          {gap.skill}
                          {gap.importance === "HIGH" && (
                            <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200 text-[10px] px-1.5 py-0">Critical</Badge>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                          <span>Current: <span className="font-medium text-slate-700 dark:text-slate-200">{gap.currentProficiency || "None"}</span></span>
                          <span>→</span>
                          <span>Required: <span className="font-medium text-emerald-700">{gap.requiredProficiency}</span></span>
                        </div>
                      </div>
                      <Link href={`/student/assessments?skill=${encodeURIComponent(gap.skill)}`} className="mt-4 sm:mt-0">
                        <Button variant="outline" size="sm">Take Assessment</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="bg-slate-50/80 border-b">
                <CardTitle className="text-lg">Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {data.recommendations?.map((rec, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="mt-0.5 text-emerald-600">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <span>{rec}</span>
                    </li>
                  ))}
                  {(!data.recommendations || data.recommendations.length === 0) && (
                    <li className="text-sm text-slate-500 dark:text-slate-400 italic text-center py-4">No specific recommendations at this time.</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
