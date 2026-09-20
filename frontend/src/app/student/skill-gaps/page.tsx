"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CardSkeletonList } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronRight,
  Loader2,
  SendHorizonal,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

interface Opportunity {
  opportunityId: string;
  title: string;
  opportunityTitle?: string;
  companyName?: string;
  matchScore: number;
  matchedSkills?: string[];
  missingSkills?: string[];
}

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  loading?: boolean;
}

/* ------------------------------------------------------------------ */
/* Match Score Ring                                                      */
/* ------------------------------------------------------------------ */

function MatchRing({ score, size = "sm" }: { score: number; size?: "sm" | "md" }) {
  const dim = size === "md" ? { outer: "h-20 w-20", text: "text-2xl", sub: "text-[10px]" } : { outer: "h-14 w-14", text: "text-base", sub: "text-[9px]" };
  const color = score >= 75 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-red-400";
  return (
    <div className={`relative flex shrink-0 items-center justify-center rounded-full ${dim.outer}`}>
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-100 dark:text-slate-800" />
        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${score}, 100`} className={color} />
      </svg>
      <div className="text-center">
        <span className={`block font-black text-slate-900 dark:text-white leading-none ${dim.text}`}>{score}%</span>
        <span className={`block font-bold uppercase tracking-wider text-slate-400 mt-0.5 ${dim.sub}`}>Match</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page                                                             */
/* ------------------------------------------------------------------ */

export default function SkillGapOpportunityPage() {
  const searchParams = useSearchParams();
  const activeId = searchParams.get("opp");

  const [recommended, setRecommended] = useState<Opportunity[]>([]);
  const [listLoading, setListLoading] = useState(true);

  const [active, setActive] = useState<Opportunity | null>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* ---- Fetch recommended opportunities ---- */
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/opportunities/recommended");
        if (res.success) {
          const filtered = (res.data as Opportunity[]).filter((o) => o.matchScore >= 75);
          setRecommended(filtered);
          /* Set active to the param id, or first in list */
          const initial = filtered.find((o) => o.opportunityId === activeId) ?? filtered[0] ?? null;
          if (initial) setActive(initial);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setListLoading(false);
      }
    };
    fetch();
  }, [activeId]);

  /* ---- Seed chat when active opportunity changes ---- */
  useEffect(() => {
    if (!active) return;
    const title = active.title || active.opportunityTitle || "this role";
    setMessages([
      {
        id: "seed",
        role: "ai",
        content: `Hi! I'm your AI Coach. Let's discuss your skills for **${title}** and how you can bridge any gaps!`,
      },
    ]);
    setInput("");
  }, [active?.opportunityId]);

  /* ---- Auto-scroll chat ---- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---- Send chat message ---- */
  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || chatLoading || !active) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: input.trim() };
    const thinkingMsg: ChatMessage = { id: "thinking", role: "ai", content: "", loading: true };
    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setInput("");
    setChatLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== "seed" && m.id !== "thinking")
        .map(m => ({ role: m.role, content: m.content }));
      
      const res = await api.post("/student/coach/chat", {
        message: userMsg.content,
        history: history
      });
      
      if (res.success && res.data && (res.data as any).response) {
        setMessages((prev) => prev.filter((m) => m.id !== "thinking").concat({ id: Date.now().toString(), role: "ai", content: (res.data as any).response }));
      } else {
         setMessages((prev) => prev.filter((m) => m.id !== "thinking").concat({ id: Date.now().toString(), role: "ai", content: "Sorry, I couldn't process your request." }));
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m.id !== "thinking").concat({ id: Date.now().toString(), role: "ai", content: "Error connecting to AI Coach." }));
    } finally {
      setChatLoading(false);
    }
  };

  /* ---- Handle active selection ---- */
  const selectOpportunity = (opp: Opportunity) => {
    setActive(opp);
  };

  /* ---------------------------------------------------------------- */
  return (
    <div className="mx-auto max-w-7xl pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-10 sm:pb-15">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25">
            <BrainCircuit size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">Skill Gap Analyser</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      {!listLoading && recommended.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-12 text-center shadow-sm">
          <Target size={64} className="mb-6 text-slate-300 dark:text-slate-600" />
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">No openings right now</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
            We couldn't find any opportunities matching your skills with a ≥75% score. Try updating your profile with more skills or exploring other roles.
          </p>
          <Link href="/student/profile">
            <Button size="lg" className="rounded-full">Update Skills</Button>
          </Link>
        </div>
      ) : (
        <div className="flex gap-5 min-h-[calc(100vh-12rem)]">
          {/* ── Left Panel ── */}
          <aside className="hidden w-80 shrink-0 flex-col gap-3 lg:flex">
            <p className="px-1 text-xs font-bold uppercase tracking-widest text-slate-400">Strong matches</p>
            {listLoading ? (
              <CardSkeletonList count={3} />
            ) : (
              <div className="flex flex-col gap-2 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 14rem)" }}>
                {recommended.map((opp) => {
                  const isActive = active?.opportunityId === opp.opportunityId;
                  return (
                    <button
                      key={opp.opportunityId}
                      onClick={() => selectOpportunity(opp)}
                      className={`group w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                        isActive
                          ? "border-indigo-400/50 bg-indigo-50 dark:border-indigo-500/40 dark:bg-indigo-500/10 shadow-md shadow-indigo-500/10"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className={`truncate text-sm font-bold ${isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-900 dark:text-white"}`}>
                            {opp.title || opp.opportunityTitle}
                          </p>
                          {opp.companyName && (
                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500 dark:text-slate-400">
                              <Building2 size={11} /> {opp.companyName}
                            </p>
                          )}
                          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                            {opp.missingSkills?.length ?? 0} skill{(opp.missingSkills?.length ?? 0) !== 1 ? "s" : ""} to bridge
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <MatchRing score={opp.matchScore} size="sm" />
                          <ChevronRight size={14} className={`shrink-0 transition-transform ${isActive ? "text-indigo-500 translate-x-0.5" : "text-slate-300 dark:text-slate-700"}`} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>
  
          {/* ── Right Panel ── */}
          <div className="flex flex-1 flex-col gap-4 min-w-0">
            <AnimatePresence mode="wait">
              {!active ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 items-center justify-center rounded-3xl glass-panel p-12 text-center">
                  <div>
                    <BrainCircuit size={48} className="mx-auto mb-4 text-slate-200 dark:text-slate-700" />
                    <p className="text-slate-400 dark:text-slate-500">Select an opportunity on the left to see your gap analysis.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key={active.opportunityId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="flex flex-1 flex-col gap-4">
                  {/* Opportunity header card */}
                  <div className="rounded-3xl glass-panel p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 space-y-2 min-w-0">
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                          {active.title || active.opportunityTitle}
                        </h2>
                        {active.companyName && (
                          <p className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <Building2 size={14} /> {active.companyName}
                          </p>
                        )}
                        {/* Matched Skills */}
                        {(active.matchedSkills?.length ?? 0) > 0 && (
                          <div className="pt-2">
                            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Matched Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {active.matchedSkills!.map((s) => (
                                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20">
                                  <CheckCircle2 size={11} /> {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Missing Skills */}
                        {(active.missingSkills?.length ?? 0) > 0 && (
                          <div className="pt-1">
                            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Missing Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {active.missingSkills!.map((s) => (
                                <span key={s} className="inline-flex items-center gap-1 rounded-full bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-400 ring-1 ring-inset ring-rose-600/20">
                                  <XCircle size={11} /> {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <MatchRing score={active.matchScore} size="md" />
                    </div>
                  </div>
  
                  {/* Skill gap detail */}
                  {(active.missingSkills?.length ?? 0) > 0 && (
                    <div className="rounded-3xl glass-panel p-6">
                      <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                        <Target size={16} className="text-indigo-500" /> Skills to Bridge
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {active.missingSkills!.map((skill) => (
                          <div key={skill} className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{skill}</p>
                              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Not yet on profile</p>
                            </div>
                            <Link href={`/student/assessments?skill=${encodeURIComponent(skill)}`}>
                              <Button size="sm" variant="outline" className="rounded-lg text-xs">Assess</Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
  
                  {/* AI Chat */}
                  <div className="flex flex-1 flex-col overflow-hidden rounded-3xl glass-panel min-h-100">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-4">
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                            <Sparkles size={14} />
                          </span>
                          AI Skill Coach
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 pl-9">Ask for resources or advice to learn {active.missingSkills?.[0] ?? "these skills"}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs flex items-center gap-2"
                        onClick={async () => {
                          const element = document.getElementById('chat-container');
                          if (!element) return;
                          const html2pdf = (await import('html2pdf.js')).default;
                          const opt = {
                            margin: 10,
                            filename: 'full-ai-coach-chat.pdf',
                            image: { type: 'jpeg' as const, quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
                          };
                          html2pdf().set(opt).from(element).save();
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        Save Chat as PDF
                      </Button>
                    </div>
                    
                    <div id="chat-container" className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.role === "ai" ? "justify-start" : "justify-end"}`}>
                          <div className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === "ai" ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm" : "bg-indigo-600 text-white rounded-tr-sm"}`}>
                             {m.loading ? (
                               <div className="flex items-center gap-1.5 h-5">
                                 <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                                 <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                 <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                               </div>
                             ) : m.role === "ai" ? (
                               <div className="relative">
                                 <div id={`msg-${m.id}`} className="markdown-body prose prose-sm dark:prose-invert max-w-none pb-2">
                                   <ReactMarkdown>{m.content}</ReactMarkdown>
                                 </div>
                                 <button
                                   onClick={async () => {
                                     const element = document.getElementById(`msg-${m.id}`);
                                     if (!element) return;
                                     
                                     const html2pdf = (await import('html2pdf.js')).default;
                                     const opt = {
                                       margin: 10,
                                       filename: 'ai-coach-response.pdf',
                                       image: { type: 'jpeg' as const, quality: 0.98 },
                                       html2canvas: { scale: 2 },
                                       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
                                     };
                                     html2pdf().set(opt).from(element).save();
                                   }}
                                   title="Download as PDF"
                                   className="absolute -right-2 -bottom-2 flex h-6 w-6 items-center justify-center rounded-md bg-white dark:bg-slate-700 text-slate-500 shadow-sm hover:text-indigo-600 dark:hover:text-indigo-400"
                                 >
                                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                 </button>
                               </div>
                             ) : (
                               m.content
                             )}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    
                    <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800">
                      <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
                          disabled={chatLoading}
                        />
                        <Button
                          type="submit"
                          size="icon"
                          disabled={!input.trim() || chatLoading}
                          className="h-10 w-10 shrink-0 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
                        >
                          {chatLoading ? <Loader2 size={16} className="animate-spin" /> : <SendHorizonal size={16} />}
                        </Button>
                      </form>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
