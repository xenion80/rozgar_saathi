"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
  Search,
  MapPin,
  Briefcase,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const trustItems = [
  { icon: ShieldCheck, label: "Verified opportunities" },
  { icon: Zap, label: "Personalized matches" },
  { icon: CheckCircle2, label: "Simple applications" },
  { icon: Users, label: "Built for growing teams" },
];

const steps = [
  {
    title: "Create your profile",
    body: "Add your skills, experience, and goals. We use this to understand your strengths.",
  },
  {
    title: "Discover the right match",
    body: "See roles tailored to your exact skills, with transparent matching scores.",
  },
  {
    title: "Apply with confidence",
    body: "Apply instantly and track every application from your dashboard.",
  },
];

const previewJobs = [
  {
    title: "Frontend Developer",
    meta: "TechNova Solutions • Remote",
    match: "92% Match",
    strong: true,
    iconWrap: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Product Designer",
    meta: "CreativeMinds • Mumbai",
    match: "85% Match",
    strong: true,
    iconWrap: "bg-violet-100 text-violet-600",
  },
  {
    title: "Data Analyst",
    meta: "DataCorp • Bengaluru",
    match: "60% Match",
    strong: false,
    iconWrap: "bg-amber-100 text-amber-600",
  },
];

const featuredJobs = [
  {
    title: "Senior React Developer",
    company: "TechNova Solutions",
    location: "Remote",
    salary: "₹15L – ₹20L",
  },
  {
    title: "Product Marketing Manager",
    company: "GrowthGen",
    location: "Bengaluru",
    salary: "₹12L – ₹18L",
  },
  {
    title: "Backend Engineer",
    company: "DataCorp",
    location: "Hybrid",
    salary: "₹18L – ₹24L",
  },
];

const pipeline = [
  {
    initials: "AK",
    name: "Arjun Kumar",
    meta: "92% Match • Applied 2d ago",
    status: "Shortlist",
    statusClass: "bg-emerald-500/15 text-emerald-300",
    avatarClass: "bg-indigo-500/20 text-indigo-300",
  },
  {
    initials: "SP",
    name: "Sneha Patel",
    meta: "85% Match • Applied 1d ago",
    status: "In review",
    statusClass: "bg-slate-700/70 text-slate-300",
    avatarClass: "bg-violet-500/20 text-violet-300",
  },
  {
    initials: "RJ",
    name: "Rahul Joshi",
    meta: "65% Match • Applied 5d ago",
    status: "In review",
    statusClass: "bg-slate-700/70 text-slate-300",
    avatarClass: "bg-slate-700 text-slate-300",
  },
];

const chip =
  "flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600";

const focusRing =
  "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export default function Home() {
  const reduceMotion = useReducedMotion();

  const fade = (axis: "x" | "y", delay = 0) =>
    reduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
        initial: { opacity: 0, [axis]: 20 },
        animate: { opacity: 1, [axis]: 0 },
        transition: { duration: 0.5, delay },
      };

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Left Column (Text) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0"
            >
              <div className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-6">
                A better way to move forward
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
                Find the work that <span className="text-indigo-600 dark:text-indigo-400">moves you forward.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                Rozgar Saathi connects job seekers with meaningful opportunities and helps employers build stronger teams.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                    Find your next role
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700">
                    Explore opportunities
                  </Button>
                </Link>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center lg:justify-start gap-2">
                <ShieldCheck size={16} className="text-emerald-500" />
                Helping job seekers and employers connect across India
              </p>
            </motion.div>

            {/* Right Column (Product Preview) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-4xl blur-3xl -z-10 transform rotate-6 scale-105"></div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl overflow-hidden flex flex-col">
                <div className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search roles..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none" readOnly />
                    </div>
                    <Button size="sm" variant="outline" className="hidden sm:flex rounded-lg">Filters</Button>
                  </div>
                  <div className="flex gap-2 mt-3 overflow-hidden">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-medium whitespace-nowrap">Full-time</span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium whitespace-nowrap">Remote</span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium whitespace-nowrap">Software</span>
                  </div>
                </div>

                <div className="p-4 space-y-3 bg-slate-50/30 dark:bg-slate-900/30">
                  {/* Fake Job Card 1 */}
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                      <Briefcase size={20} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Frontend Developer</h4>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">92% Match</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">TechNova Solutions • Remote</p>
                    </div>
                  </div>
                  {/* Fake Job Card 2 */}
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
                      <Briefcase size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Product Designer</h4>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">85% Match</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">CreativeMinds • Mumbai</p>
                    </div>
                  </div>
                  {/* Fake Job Card 3 */}
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex gap-4 opacity-75">
                    <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                      <Briefcase size={20} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Data Analyst</h4>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">60% Match</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">DataCorp • Bangalore</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-y-8 text-center md:grid-cols-4 md:gap-y-0 md:divide-x md:divide-slate-200">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center justify-center px-4">
                <Icon className="mb-2 h-6 w-6 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-16 text-3xl font-bold text-slate-900">How it works</h2>
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-bold text-indigo-600 ring-1 ring-indigo-100">
                  {i + 1}
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="max-w-xs text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured opportunities */}
      <section className="border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Featured opportunities
              </h2>
              <p className="mt-2 text-slate-600">
                Roles companies are actively hiring for.
              </p>
            </div>
            <Link href="/explore" className="hidden sm:block">
              <Button
                variant="ghost"
                className="text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
              >
                View all <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <div
                key={job.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                    <Briefcase className="text-slate-500" />
                  </div>
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Active
                  </span>
                </div>

                <h3 className="mb-1 text-xl font-bold text-slate-900">{job.title}</h3>
                <p className="mb-4 text-sm text-slate-600">{job.company}</p>

                <div className="mb-6 flex flex-wrap gap-2">
                  <span className={chip}>
                    <MapPin size={12} />
                    {job.location}
                  </span>
                  <span className={chip}>{job.salary}</span>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                >
                  View role
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employer section */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Build your next great team
              </h2>
              <p className="mb-8 max-w-lg text-lg text-slate-300">
                Post opportunities with exact skill requirements and receive a ranked
                pipeline of the most qualified candidates, saving days of manual
                screening.
              </p>

              <ul className="mb-10 space-y-4">
                {[
                  "Skills-based candidate matching",
                  "Clear hiring pipelines",
                  "Detailed applicant insights",
                ].map((item) => (
                  <li key={item} className="flex items-center text-slate-300">
                    <CheckCircle2 size={20} className="mr-3 shrink-0 text-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-xl bg-indigo-500 px-8 text-white hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Post a job
                </Button>
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-6 shadow-2xl shadow-black/30">
              <h3 className="mb-4 font-semibold text-white">
                Candidate pipeline — Frontend Developer
              </h3>

              <div className="space-y-3">
                {pipeline.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-900/80 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${c.avatarClass}`}
                      >
                        {c.initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{c.name}</div>
                        <div className="text-xs text-slate-400">{c.meta}</div>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded px-2 py-1 text-xs font-semibold ${c.statusClass}`}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-4xl font-extrabold text-slate-900">
            Your next opportunity starts here
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-600">
            Join thousands of job seekers and employers making better connections every
            day.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className={`h-14 rounded-full bg-indigo-600 px-10 text-lg text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 ${focusRing}`}
            >
              Get started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-4 text-center">
        <div className="mx-auto flex max-w-7xl justify-between items-center px-4">
          <div className="text-xl font-bold text-slate-900">Rozgar Saathi</div>
          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}