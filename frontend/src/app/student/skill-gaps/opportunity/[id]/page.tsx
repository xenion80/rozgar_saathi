"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
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

interface SkillGap {
  skill: string;
  currentProficiency?: string;
  requiredProficiency?: string;
  importance?: "HIGH" | "MEDIUM" | "LOW";
}

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  loading?: boolean;
}

/* ------------------------------------------------------------------ */
/* Mock AI response — replace with real endpoint when available         */
/* ------------------------------------------------------------------ */

function mockAIResponse(question: string, opportunity: Opportunity): string {
  const missing = opportunity.missingSkills ?? [];
  const matched = opportunity.matchedSkills ?? [];
  const title = opportunity.title || opportunity.opportunityTitle || "this role";

  const lower = question.toLowerCase();

  if (lower.includes("how") && (lower.includes("learn") || lower.includes("improve") || lower.includes("get"))) {
    if (missing.length === 0) return `Great news — you already have all the skills listed for ${title}! Focus on polishing your portfolio and practising system-design questions to stand out.`;
    return `To get ready for **${title}**, I'd suggest starting with **${missing[0]}** since it appears most frequently in similar job listings. Free resources: official docs, freeCodeCamp, and Coursera's beginner tracks. Aim for a small project that demonstrates ${missing[0]} within two weeks.`;
  }

  if (lower.includes("time") || lower.includes("long") || lower.includes("week")) {
    if (missing.length === 0) return `You're already a strong match! With your existing skills you could apply right now.`;
    return `Given you already know ${matched.slice(0, 2).join(" and ") || "some of the required skills"}, bridging the gap for ${missing.slice(0, 2).join(" and ")} typically takes **4–8 weeks** of consistent study (1–2 hours per day).`;
  }

  if (lower.includes("project") || lower.includes("portfolio")) {
    if (missing.length === 0) return `With your current skills you could build a full-stack CRUD app, a REST API, or a data dashboard — all solid portfolio pieces for ${title}.`;
    return `A great portfolio project combining your existing skills (${matched.slice(0, 2).join(", ") || "your current stack"}) with ${missing[0] || "the missing skill"} would be a real-world clone — e.g., a job-board or e-commerce site. It shows initiative and covers the skill gap visibly.`;
  }

  if (lower.includes("salary") || lower.includes("pay") || lower.includes("compensation")) {
    return `Compensation for ${title} roles in India typically ranges from ₹8L to ₹20L depending on the company and experience level. Bridging your skill gaps can significantly push you toward the upper end.`;
  }

  if (lower.includes("interview") || lower.includes("prepare")) {
    return `For ${title} interviews, expect: (1) a technical screen covering ${(matched[0] || "core concepts")}, (2) a take-home or live coding round, and (3) a system design or case discussion. Practice on LeetCode (medium difficulty) and mock interviews on Pramp or interviewing.io.`;
  }

  if (missing.length === 0) {
    return `You're a great fit for **${title}**! Your matched skills cover everything listed. I'd recommend applying soon and preparing a strong cover letter that highlights your experience with ${matched.slice(0, 2).join(" and ") || "relevant technologies"}.`;
  }

  return `For **${title}**, your biggest opportunity is closing the gap on **${missing.join(", ")}**. I recommend: 1) Completing one focused course per skill, 2) Building a demo project that uses all of them together, 3) Applying once you have at least a working prototype to show. Would you like a detailed roadmap for any specific skill?`;
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
  const params = useParams();
  const activeId = params.id as string;

  const [recommended, setRecommended] = useState<Opportunity[]>([]);
  const [listLoading, setListLoading] = useState(true);

  const [active, setActive] = useState<Opportunity | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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
        content: `Hi! I can help you bridge the skill gap for **${title}**. Ask me anything — how to learn a missing skill, how long it'll take, what projects to build, or how to prepare for the interview.`,
      },
    ]);
    setInput("");
  }, [active?.opportunityId]);

  /* ---- Auto-scroll chat ---- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---- Send chat message ---- */
  const sendMessage = async () => {
    if (!input.trim() || chatLoading || !active) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: input.trim() };
    const thinkingMsg: ChatMessage = { id: "thinking", role: "ai", content: "", loading: true };
    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setInput("");
    setChatLoading(true);

    /* Simulate ~800ms AI "thinking" then reply with mock */
    await new Promise((r) => setTimeout(r, 800));
    const reply = mockAIResponse(userMsg.content, active);
    setMessages((prev) => prev.filter((m) => m.id !== "thinking").concat({ id: Date.now().toString(), role: "ai", content: reply }));
    setChatLoading(false);
  };

  /* ---- Handle active selection ---- */
  const selectOpportunity = (opp: Opportunity) => {
    setActive(opp);
  };

  /* ---------------------------------------------------------------- */
  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/student/recommended">
          <Button variant="ghost" size="sm" className="gap-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft size={16} /> Back
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25">
            <BrainCircuit size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">Skill Gap Analyser</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Opportunities where you match ≥75% — explore gaps &amp; get coaching</p>
          </div>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex gap-5 min-h-[calc(100vh-12rem)]">
        {/* ── Left Panel ── */}
        <aside className="hidden w-80 shrink-0 flex-col gap-3 lg:flex">
          <p className="px-1 text-xs font-bold uppercase tracking-widest text-slate-400">Strong matches</p>
          {listLoading ? (
            <CardSkeletonList count={3} />
          ) : recommended.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl glass-panel p-8 text-center">
              <Target size={32} className="mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No opportunities with ≥75% match found yet.</p>
              <Link href="/student/skills" className="mt-4">
                <Button size="sm" variant="outline" className="rounded-full text-xs">Update Skills</Button>
              </Link>
            </div>
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

                {/* AI Chat section */}
                <div className="flex flex-1 flex-col rounded-3xl glass-panel overflow-hidden" style={{ minHeight: "360px" }}>
                  {/* Chat header */}
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                      <Sparkles size={14} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">AI Skill Coach</p>
                      <p className="text-xs text-slate-400">Ask anything about closing your skill gap</p>
                    </div>
                    <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  </div>

                  {/* Message thread */}
                  <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5" style={{ maxHeight: "320px" }}>
                    <AnimatePresence initial={false}>
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {msg.role === "ai" && (
                            <span className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                              <Sparkles size={12} />
                            </span>
                          )}
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                              msg.role === "user"
                                ? "rounded-tr-sm bg-indigo-600 text-white shadow-sm"
                                : "rounded-tl-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                            }`}
                          >
                            {msg.loading ? (
                              <span className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                <Loader2 size={14} className="animate-spin" /> Thinking…
                              </span>
                            ) : (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: msg.content
                                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                    .replace(/\n/g, "<br/>"),
                                }}
                              />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat input */}
                  <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3">
                    <form
                      onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                      className="flex items-center gap-3"
                    >
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Ask about ${active.missingSkills?.[0] ?? "your skill gaps"}…`}
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
    </div>
  );
}
