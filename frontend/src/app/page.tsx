"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl px-4"
      >
        <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-sm ring-1 ring-inset ring-emerald-700/10">
          SIH 2026 Prototype
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Academia–Industry <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-600">
            Collaboration Portal
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Bridging the gap between students and recruiters through transparent skill mapping, explainable matching, and seamless opportunities.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto text-base gap-2 px-8 h-14 rounded-full">
              Get Started <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 h-14 rounded-full bg-white">
              Log In
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24 max-w-4xl px-4"
      >
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">For Students</h2>
          <p className="text-slate-600 mb-6 flex-1">
            Build your profile, identify your skill gaps, and get automatically matched with internships and jobs that fit your abilities.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
            <Briefcase size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">For Recruiters</h2>
          <p className="text-slate-600 mb-6 flex-1">
            Post opportunities with specific skill requirements and instantly see a ranked list of the most qualified candidates.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
