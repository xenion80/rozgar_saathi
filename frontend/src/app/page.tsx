"use client";

import Link from "next/link";
import { ArrowUpRight, Check, CircleDot, GraduationCap, Search, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  ["10k+", "students ready to grow"],
  ["500+", "opportunities shared"],
  ["92%", "matching accuracy"],
];

export default function Home() {
  return (
    <div className="-mx-4 -mt-28 min-h-screen overflow-hidden bg-[#f7f7f5] text-[#11110f] md:-mx-8 md:-mt-32">
      <div className="landing-grid relative">
        <header className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 lg:px-12">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#11110f] text-xs font-bold text-white">RS</span>
            Rozgar Saathi<span className="ml-0.5 text-[10px] align-top">TM</span>
          </Link>
          <nav className="hidden items-center gap-9 text-sm text-black/60 md:flex">
            <a href="#why">Why us</a><a href="#how">How it works</a><a href="#roles">For everyone</a>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/login" className="hidden px-3 py-2 text-black/70 sm:block">Sign in</Link>
            <Link href="/register" className="rounded-full bg-[#11110f] px-5 py-2.5 font-medium text-white transition-transform hover:-translate-y-0.5">Get started</Link>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-6 pb-24 pt-20 lg:px-12 lg:pt-28">
          <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_.85fr]">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
              <p className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[.18em] text-black/55"><span className="h-px w-8 bg-black/40" />India&apos;s career launchpad</p>
              <h1 className="max-w-4xl text-[clamp(4.5rem,10vw,9.5rem)] font-medium leading-[.82] tracking-[-.085em]">Find your<br /><span className="ml-[10%] text-black/35">next move.</span></h1>
              <p className="mt-12 max-w-xl text-lg leading-relaxed text-black/60">A smarter way for students to discover their strengths and for recruiters to find the people who will make a difference.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/register" className="group flex items-center gap-3 rounded-full bg-[#11110f] px-6 py-3.5 text-sm font-medium text-white">Build your profile <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
                <Link href="/student/opportunities" className="rounded-full border border-black/15 px-6 py-3.5 text-sm font-medium transition-colors hover:bg-white">Explore opportunities</Link>
              </div>
            </motion.section>
            <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .2, duration: .8 }} className="relative hidden min-h-[390px] overflow-hidden rounded-[2rem] bg-[#deded9] p-6 lg:block">
              <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(0,0,0,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.12)_1px,transparent_1px)] [background-size:32px_32px]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono text-black/50"><span>ROZGAR / MATCH ENGINE</span><CircleDot size={14} /></div>
                <div className="space-y-3"><div className="h-32 w-32 rounded-full border border-black/20 p-3"><div className="flex h-full items-center justify-center rounded-full bg-[#11110f] text-3xl text-white">92%</div></div><p className="max-w-[190px] text-sm text-black/60">Your skills are closer to the right opportunity than you think.</p></div>
                <div className="flex justify-between border-t border-black/15 pt-4 text-xs text-black/50"><span>SKILL MATCH</span><span>LIVE</span></div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <section id="why" className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-28">
        <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="font-mono text-xs uppercase tracking-[.18em] text-black/45">01 / Why Rozgar Saathi</p><h2 className="mt-5 max-w-2xl text-4xl font-medium tracking-[-.05em] md:text-6xl">Less guessing.<br />More growing.</h2></div><p className="max-w-xs text-sm leading-relaxed text-black/55">Everything you need to turn potential into a clear, confident career path.</p></div>
        <div className="grid border-t border-black/15 md:grid-cols-3">
          {[{icon: Search, title: "Know your edge", text: "Map your skills, measure your strengths, and see exactly what to learn next."}, {icon: Sparkles, title: "Meet your match", text: "Get opportunities ranked by fit, not by guesswork or a pile of keywords."}, {icon: Users, title: "Grow together", text: "Build better connections between ambitious students and forward-thinking teams."}].map(({icon: Icon, title, text}, i) => <div key={title} className="border-b border-black/15 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"><span className="font-mono text-xs text-black/40">0{i + 1}</span><Icon className="my-12 h-7 w-7 stroke-[1.5]" /><h3 className="text-xl font-medium">{title}</h3><p className="mt-3 max-w-xs text-sm leading-relaxed text-black/55">{text}</p></div>)}
        </div>
      </section>

      <section id="how" className="bg-[#11110f] px-6 py-20 text-white lg:px-12 lg:py-28"><div className="mx-auto max-w-[1400px]"><p className="font-mono text-xs uppercase tracking-[.18em] text-white/45">02 / The simple path</p><div className="mt-10 grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><h2 className="text-4xl font-medium tracking-[-.05em] md:text-6xl">Your next<br />chapter starts<br /><span className="text-white/35">with one step.</span></h2><div className="grid gap-8 sm:grid-cols-3">{[["01", "Create", "Tell us what you know and where you want to go."], ["02", "Discover", "See roles and skill gaps that fit your ambitions."], ["03", "Launch", "Apply with confidence and keep moving forward."]].map(([number, title, text]) => <div key={number} className="border-t border-white/20 pt-5"><span className="font-mono text-xs text-white/40">{number}</span><h3 className="mt-12 text-xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/55">{text}</p></div>)}</div></div></div></section>

      <section id="roles" className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-28"><div className="grid gap-5 md:grid-cols-2"><Link href="/register" className="group rounded-[1.5rem] border border-black/15 p-8 transition-colors hover:bg-white md:p-12"><GraduationCap className="h-8 w-8" /><h2 className="mt-20 text-3xl font-medium tracking-[-.04em]">For students</h2><p className="mt-3 max-w-sm text-sm leading-relaxed text-black/55">Build a profile that tells your story, find your fit, and take the next step.</p><span className="mt-10 inline-flex items-center gap-2 text-sm font-medium">Start building <ArrowUpRight size={15} /></span></Link><Link href="/register" className="group rounded-[1.5rem] bg-[#dfe6df] p-8 transition-transform hover:-translate-y-1 md:p-12"><Check className="h-8 w-8" /><h2 className="mt-20 text-3xl font-medium tracking-[-.04em]">For recruiters</h2><p className="mt-3 max-w-sm text-sm leading-relaxed text-black/60">Reach capable people faster with transparent, skill-first matching.</p><span className="mt-10 inline-flex items-center gap-2 text-sm font-medium">Find your people <ArrowUpRight size={15} /></span></Link></div></section>
      <footer className="mx-auto flex max-w-[1400px] flex-col gap-4 border-t border-black/15 px-6 py-8 text-xs text-black/45 sm:flex-row sm:items-center sm:justify-between lg:px-12"><span>© 2026 Rozgar Saathi</span><span>Built for the next generation of work.</span></footer>
    </div>
  );
}
