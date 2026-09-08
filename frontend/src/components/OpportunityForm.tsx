"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function OpportunityForm({ initialData = null, isEdit = false }: { initialData?: any, isEdit?: boolean }) {
  const router = useRouter();
  const [catalogue, setCatalogue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    companyName: initialData?.companyName || "",
    description: initialData?.description || "",
    type: initialData?.type || "JOB",
    location: initialData?.location || "",
    workMode: initialData?.workMode || "ONSITE",
    minimumQualification: initialData?.minimumQualification || "",
    status: initialData?.status || "DRAFT",
    applicationDeadline: initialData?.applicationDeadline ? new Date(initialData.applicationDeadline).toISOString().split('T')[0] : "",
    skills: initialData?.requiredSkills?.map((rs: any) => ({
      skillId: rs.skill.id.toString(),
      requiredProficiency: rs.requiredProficiency,
      importance: rs.importance
    })) || []
  });

  useEffect(() => {
    api.get("/skills").then(res => setCatalogue(res.data)).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (formData.skills.length >= 30) {
      alert("Maximum 30 skills allowed.");
      return;
    }
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { skillId: "", requiredProficiency: 3, importance: 3 }]
    }));
  };

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSkillChange = (index: number, field: string, value: string | number) => {
    const newSkills = [...formData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setFormData(prev => ({ ...prev, skills: newSkills }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (new Date(formData.applicationDeadline) <= new Date()) {
      setError("Deadline must be in the future.");
      setLoading(false);
      return;
    }
    if (formData.skills.some((s: any) => !s.skillId)) {
      setError("Please select a skill for all required skill entries.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        skills: formData.skills.map((s: any) => ({
          skillId: parseInt(s.skillId),
          requiredProficiency: parseInt(s.requiredProficiency),
          importance: parseInt(s.importance)
        }))
      };

      if (isEdit && initialData?.id) {
        await api.put(`/opportunities/${initialData.id}`, payload);
      } else {
        await api.post("/opportunities", payload);
      }
      
      router.push("/recruiter/dashboard");
    } catch (err: any) {
      setError(err?.message || "Failed to save opportunity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Job Title *</label>
              <Input name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Company Name *</label>
              <Input name="companyName" required value={formData.companyName} onChange={handleChange} />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
              <Input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Bangalore" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Opportunity Type *</label>
              <select name="type" required value={formData.type} onChange={handleChange} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                <option value="JOB">Job</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="APPRENTICESHIP">Apprenticeship</option>
                <option value="PROJECT">Project</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Work Mode *</label>
              <select name="workMode" required value={formData.workMode} onChange={handleChange} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                <option value="ONSITE">On-site</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Description *</label>
              <textarea name="description" required rows={5} value={formData.description} onChange={handleChange} className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Minimum Qualification</label>
              <Input name="minimumQualification" value={formData.minimumQualification} onChange={handleChange} placeholder="e.g. B.Tech Computer Science" />
            </div>
            
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Application Deadline *</label>
              <Input type="date" name="applicationDeadline" required value={formData.applicationDeadline} onChange={handleChange} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status *</label>
              <select name="status" required value={formData.status} onChange={handleChange} className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                <option value="DRAFT">Draft</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Required Skills */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-slate-900">Required Skills</h2>
            <Button type="button" variant="outline" size="sm" onClick={handleAddSkill} className="gap-2">
              <Plus size={14} /> Add Skill
            </Button>
          </div>
          
          <div className="space-y-4">
            {formData.skills.length === 0 ? (
              <div className="text-sm text-slate-500 italic">No skills required. Add skills to improve candidate matching.</div>
            ) : (
              formData.skills.map((skill: any, index: number) => (
                <div key={index} className="flex items-end gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-medium text-slate-700">Skill</label>
                    <select
                      required
                      value={skill.skillId}
                      onChange={(e) => handleSkillChange(index, "skillId", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm"
                    >
                      <option value="" disabled>Select skill...</option>
                      {catalogue.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="mb-1 block text-xs font-medium text-slate-700">Proficiency (1-5)</label>
                    <Input type="number" min="1" max="5" required value={skill.requiredProficiency} onChange={(e) => handleSkillChange(index, "requiredProficiency", e.target.value)} className="h-9" />
                  </div>
                  <div className="w-32">
                    <label className="mb-1 block text-xs font-medium text-slate-700">Importance (1-5)</label>
                    <Input type="number" min="1" max="5" required value={skill.importance} onChange={(e) => handleSkillChange(index, "importance", e.target.value)} className="h-9" />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveSkill(index)} className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {error && <div className="text-sm font-medium text-red-500">{error}</div>}

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : isEdit ? "Update Opportunity" : "Create Opportunity"}</Button>
        </div>

      </form>
    </motion.div>
  );
}
