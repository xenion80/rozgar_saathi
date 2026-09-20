"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const [opp, setOpp] = useState<any>(null);
  const [matchData, setMatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Apply Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false); // Can also fetch from /applications/me to be sure
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oppRes, matchRes, appsRes, resumesRes] = await Promise.all([
          api.get(`/opportunities/${id}`),
          api.get(`/opportunities/${id}/match`),
          api.get("/applications/me"), // To check if already applied
          api.get("/students/me/resumes")
        ]);
        if (oppRes.success) setOpp(oppRes.data);
        if (matchRes.success) setMatchData(matchRes.data);
        if (resumesRes.success) setResumes(resumesRes.data);
        
        if (appsRes.success) {
          const hasApplied = appsRes.data.some((app: any) => 
            app.opportunityId === parseInt(id) && app.status !== "WITHDRAWN"
          );
          setApplied(hasApplied);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    setError("");

    try {
      const payload: any = { coverLetter };
      if (selectedResumeId) {
        payload.resumeId = parseInt(selectedResumeId);
      }
      
      await api.post(`/opportunities/${id}/apply`, payload);
      setIsApplyModalOpen(false);
      setApplied(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit application.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center">Loading details...</div>;
  if (!opp) return <div className="flex h-64 items-center justify-center">Opportunity not found.</div>;

  const isEligible = matchData?.eligible;
  const matchScore = matchData?.matchScore || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-10 sm:pb-15">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-slate-600 pl-0 hover:bg-transparent">
          <ArrowLeft size={16} /> Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{opp.title}</h1>
                <p className="mt-1 text-lg font-medium text-emerald-600">{opp.companyName}</p>
              </div>
              <span className="inline-flex rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                {opp.type}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md">
                <MapPin size={16} className="text-slate-400" /> {opp.location}
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md">
                <Briefcase size={16} className="text-slate-400" /> {opp.workMode}
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md">
                <Clock size={16} className="text-slate-400" /> Apply by {new Date(opp.applicationDeadline).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">About the Role</h3>
              <p className="whitespace-pre-wrap text-slate-600 dark:text-slate-300 leading-relaxed">
                {opp.description}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Minimum Qualification</h3>
              <p className="text-slate-600 dark:text-slate-300">{opp.minimumQualification}</p>
            </div>
          </div>
        </div>

        {/* Match Analysis Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Match Analysis</h3>
            
            <div className="mb-6 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              <div className="text-4xl font-extrabold" style={{ color: matchScore >= 60 ? '#10b981' : '#f59e0b' }}>
                {matchScore}%
              </div>
              <p className="mt-1 font-medium text-slate-600 dark:text-slate-300">
                {isEligible ? "Eligible to Apply" : "Not Eligible (Needs 60%)"}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Skill Breakdown</h4>
              {matchData?.skillDetails?.map((detail: any) => (
                <div key={detail.skill} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {detail.matched ? (
                      <CheckCircle2 size={16} className="text-green-500" />
                    ) : (
                      <XCircle size={16} className="text-red-500" />
                    )}
                    <span className={detail.matched ? "text-slate-900 dark:text-white font-medium" : "text-slate-500 dark:text-slate-400"}>
                      {detail.skill}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    {detail.currentProficiency}/{detail.requiredProficiency} req.
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 border-t border-slate-100 dark:border-slate-700 pt-6">
              {applied ? (
                <Button className="w-full" disabled variant="outline">Already Applied</Button>
              ) : opp.status === "CLOSED" ? (
                <Button className="w-full" disabled variant="outline">Opportunity Closed</Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => setIsApplyModalOpen(true)}
                  disabled={!isEligible}
                  title={!isEligible ? "You need a match score of at least 60% to apply." : ""}
                >
                  Apply Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsApplyModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Apply for {opp.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Write a short cover letter to stand out (optional).</p>

              <form onSubmit={handleApply} className="space-y-4">
                <textarea
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="I am very interested in this role because..."
                />
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Attach Resume (Optional)
                  </label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">No resume attached</option>
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>{r.fileName}</option>
                    ))}
                  </select>
                  {resumes.length === 0 && (
                    <p className="mt-2 text-xs text-slate-500">You haven't uploaded any resumes yet. Go to your <Link href="/student/profile" className="text-indigo-600 hover:underline">Profile</Link> to upload one.</p>
                  )}
                </div>
                
                {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsApplyModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={applying}>
                    {applying ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
