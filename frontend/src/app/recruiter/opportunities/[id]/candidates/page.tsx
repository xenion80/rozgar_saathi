"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, GraduationCap, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CandidatesReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [candidates, setCandidates] = useState<any[]>([]);
  const [opp, setOpp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [oppRes, candidatesRes] = await Promise.all([
        api.get(`/opportunities/${id}`),
        api.get(`/recruiter/opportunities/${id}/candidates`),
      ]);
      if (oppRes.success) setOpp(oppRes.data);
      if (candidatesRes.success) setCandidates(candidatesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusChange = async (appId: number, status: string) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      // Refresh to get updated list
      fetchData();
      if (selectedCandidate && selectedCandidate.applicationId === appId) {
        setSelectedCandidate({ ...selectedCandidate, status });
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update candidate status.");
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center">Loading candidates...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl">
      <div className="mb-6">
        <Link href="/recruiter/dashboard">
          <Button variant="ghost" className="gap-2 text-slate-600 pl-0 hover:bg-transparent">
            <ArrowLeft size={16} /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Candidate Review</h1>
        <p className="mt-2 text-slate-600">Reviewing candidates for <span className="font-semibold text-slate-900">{opp?.title}</span></p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {candidates.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-slate-900">No candidates yet</h3>
            <p className="mt-1 text-sm text-slate-500">Wait for students to apply to your opportunity.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-700">
                <tr>
                  <th className="px-6 py-4">Rank / Score</th>
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((candidate, idx) => (
                  <tr key={candidate.applicationId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                          {idx + 1}
                        </span>
                        <span className={`font-bold ${candidate.matchScore >= 60 ? "text-green-600" : "text-amber-500"}`}>
                          {candidate.matchScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => setSelectedCandidate(candidate)} className="text-left focus:outline-none group">
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-600">{candidate.studentName}</div>
                        <div className="text-xs text-slate-500">{candidate.studentEmail}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {candidate.matchedSkills.slice(0, 3).map((skill: string) => (
                            <span key={skill} className="inline-block rounded-sm bg-slate-100 px-1 py-0.5 text-[10px] text-slate-600">
                              {skill}
                            </span>
                          ))}
                          {candidate.matchedSkills.length > 3 && (
                            <span className="inline-block rounded-sm bg-slate-100 px-1 py-0.5 text-[10px] text-slate-600">+{candidate.matchedSkills.length - 3}</span>
                          )}
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        candidate.status === "APPLIED" ? "bg-emerald-50 text-emerald-700" :
                        candidate.status === "SHORTLISTED" ? "bg-amber-50 text-amber-700" :
                        candidate.status === "INTERVIEW" ? "bg-purple-50 text-purple-700" :
                        candidate.status === "SELECTED" ? "bg-green-50 text-green-700" :
                        candidate.status === "REJECTED" ? "bg-red-50 text-red-700" :
                        "bg-slate-100 text-slate-700" // WITHDRAWN
                      }`}>
                        {candidate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {candidate.status !== "WITHDRAWN" && (
                        <select
                          className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs focus:border-emerald-500 focus:outline-none"
                          value={candidate.status}
                          onChange={(e) => handleStatusChange(candidate.applicationId, e.target.value)}
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="SHORTLISTED">Shortlist</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="SELECTED">Select</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Detail Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSelectedCandidate(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md">
                <h2 className="text-xl font-bold text-slate-900">Candidate Profile</h2>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-8">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <User size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{selectedCandidate.studentName}</h3>
                      <p className="text-slate-500">{selectedCandidate.studentEmail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500 mb-1">Match Score</div>
                    <div className={`text-3xl font-extrabold ${selectedCandidate.matchScore >= 60 ? "text-green-500" : "text-amber-500"}`}>
                      {selectedCandidate.matchScore}%
                    </div>
                  </div>
                </div>

                {selectedCandidate.coverLetter && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Cover Letter</h4>
                    <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap border border-slate-100">
                      {selectedCandidate.coverLetter}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Skill Matching Analysis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-green-800 mb-2">Matched Skills</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.matchedSkills.length > 0 ? (
                          selectedCandidate.matchedSkills.map((skill: string) => (
                            <span key={skill} className="inline-flex rounded-md bg-white px-2 py-1 text-xs font-medium text-green-700 border border-green-200 shadow-sm">
                              ✓ {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-green-700 italic">None</span>
                        )}
                      </div>
                    </div>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-red-800 mb-2">Missing Skills</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.missingSkills.length > 0 ? (
                          selectedCandidate.missingSkills.map((skill: string) => (
                            <span key={skill} className="inline-flex rounded-md bg-white px-2 py-1 text-xs font-medium text-red-700 border border-red-200 shadow-sm">
                              ✕ {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-red-700 italic">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-700">Update Status</div>
                    {selectedCandidate.status !== "WITHDRAWN" ? (
                      <select
                        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-emerald-500 focus:outline-none"
                        value={selectedCandidate.status}
                        onChange={(e) => handleStatusChange(selectedCandidate.applicationId, e.target.value)}
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW">Interview Scheduled</option>
                        <option value="SELECTED">Selected</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    ) : (
                      <span className="text-sm italic text-slate-500">Candidate withdrew application</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
