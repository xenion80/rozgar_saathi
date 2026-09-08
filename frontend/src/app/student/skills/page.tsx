"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton, CardSkeletonList } from "@/components/ui/skeleton";
import { Star, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Skill {
  id: number;
  name: string;
  category: string;
  description: string;
}

interface StudentSkill {
  id: number;
  skill: Skill;
  proficiency: number;
  source: string;
}

export default function StudentSkillsPage() {
  const [mySkills, setMySkills] = useState<StudentSkill[]>([]);
  const [catalogue, setCatalogue] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [proficiency, setProficiency] = useState(3);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchSkills = async () => {
    try {
      const [mySkillsRes, catalogueRes] = await Promise.all([
        api.get("/students/me/skills"),
        api.get("/skills"),
      ]);
      if (mySkillsRes.success) setMySkills(mySkillsRes.data);
      if (catalogueRes.success) setCatalogue(catalogueRes.data);
    } catch (err) {
      console.error("Failed to fetch skills", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) {
      setError("Please select a skill");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.post("/students/me/skills", {
        skillId: parseInt(selectedSkillId),
        proficiency,
      });
      setIsModalOpen(false);
      setSelectedSkillId("");
      setProficiency(3);
      fetchSkills();
    } catch (err: any) {
      setError(err?.message || "Failed to add skill.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProficiency = async (skillId: number, newProficiency: number) => {
    try {
      await api.put(`/students/me/skills/${skillId}`, { proficiency: newProficiency });
      setMySkills((prev) =>
        prev.map((s) => (s.skill.id === skillId ? { ...s, proficiency: newProficiency } : s))
      );
    } catch (err) {
      console.error("Failed to update proficiency", err);
    }
  };

  const availableSkills = catalogue.filter(
    (c) => !mySkills.some((m) => m.skill.id === c.id)
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Skills</h1>
          <p className="mt-2 text-slate-600">
            Add and manage your skills to improve your match score with opportunities.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus size={18} /> Add Skill
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-4" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-4/5 mb-4" />
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <Skeleton key={s} className="h-5 w-5 rounded-full" />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mySkills.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <h3 className="text-lg font-medium text-slate-900">No skills added yet</h3>
              <p className="mt-1 text-sm text-slate-500">
                Get started by adding technical or soft skills from the catalogue.
              </p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline" className="mt-4">
                Add your first skill
              </Button>
            </div>
          ) : (
            mySkills.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.skill.name}</h3>
                    <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {item.skill.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400" title="Source">
                    {item.source}
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-500 line-clamp-2" title={item.skill.description}>
                  {item.skill.description}
                </p>
                <div className="mt-4 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleUpdateProficiency(item.skill.id, star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={20}
                        className={`transition-colors ${
                          star <= item.proficiency
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-slate-100 text-slate-200 hover:fill-yellow-200 hover:text-yellow-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Skill Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Add Skill</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddSkill} className="space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Select Skill</label>
                  <select
                    required
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                  >
                    <option value="" disabled>Choose a skill...</option>
                    {availableSkills.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name} ({skill.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Proficiency (1–5)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setProficiency(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          size={32}
                          className={`transition-colors ${
                            star <= proficiency
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-slate-100 text-slate-200 hover:fill-yellow-200 hover:text-yellow-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {error && <div className="text-sm text-red-500 font-medium">{error}</div>}

                <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving || !selectedSkillId}>
                    {saving ? "Adding..." : "Add Skill"}
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
