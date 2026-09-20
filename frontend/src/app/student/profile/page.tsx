"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, GraduationCap, Briefcase, FileText, UploadCloud, CheckCircle2, Trash2, Plus, Star } from "lucide-react";

interface CatalogueSkill {
  id: number;
  name: string;
  category: string;
  description: string;
}

interface StudentSkill {
  id: number;
  skill: CatalogueSkill;
  proficiency: number;
  source: string;
}

interface Profile {
  id: number;
  bio: string | null;
  targetRole: string | null;
}

interface Education {
  collegeName: string;
  degree: string;
  branch: string;
  graduationYear: string;
  cgpa: string;
  twelfthSchoolName: string;
  twelfthBoard: string;
  twelfthMarks: string;
  tenthSchoolName: string;
  tenthBoard: string;
  tenthMarks: string;
}

const EMPTY_EDUCATION: Education = {
  collegeName: "",
  degree: "",
  branch: "",
  graduationYear: "",
  cgpa: "",
  twelfthSchoolName: "",
  twelfthBoard: "",
  twelfthMarks: "",
  tenthSchoolName: "",
  tenthBoard: "",
  tenthMarks: "",
};

const TARGET_ROLES = [
  "Backend Developer",
  "Frontend Developer",
  "Full-Stack Developer",
  "Data Analyst",
];

export default function StudentProfilePage() {
  const { user, accessToken, setAuth } = useAuthStore();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [userName, setUserName] = useState(user?.name || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [activeTab, setActiveTab] = useState("about");
  
  // Education state — API-driven
  const [education, setEducation] = useState<Education>(EMPTY_EDUCATION);
  const [educationLoading, setEducationLoading] = useState(false);
  const [educationSaving, setEducationSaving] = useState(false);
  const [educationMessage, setEducationMessage] = useState({ text: "", type: "" });

  // Skills state (API-driven, same as /student/skills page)
  const [mySkills, setMySkills] = useState<StudentSkill[]>([]);
  const [catalogue, setCatalogue] = useState<CatalogueSkill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [skillProficiency, setSkillProficiency] = useState(3);
  const [skillError, setSkillError] = useState("");
  const [skillSaving, setSkillSaving] = useState(false);

  // Resume state
  const [resumes, setResumes] = useState<any[]>([]);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  useEffect(() => {
    if (user?.name && !userName) {
      setUserName(user.name);
    }
  }, [user?.name]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/students/me");
        if (res.success && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        // Ignored
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const fetchMySkills = async () => {
    setSkillsLoading(true);
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
      setSkillsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "skills") fetchMySkills();
    if (activeTab === "education") fetchEducation();
    if (activeTab === "resume") fetchResumes();
  }, [activeTab]);

  const fetchResumes = async () => {
    setResumesLoading(true);
    try {
      const res = await api.get("/students/me/resumes");
      if (res.success && res.data) {
        setResumes(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setResumesLoading(false);
    }
  };

  const fetchEducation = async () => {
    setEducationLoading(true);
    try {
      const res = await api.get("/students/me/education");
      if (res.success && res.data) {
        const d = res.data;
        setEducation({
          collegeName: d.collegeName ?? "",
          degree: d.degree ?? "",
          branch: d.branch ?? "",
          graduationYear: d.graduationYear ? String(d.graduationYear) : "",
          cgpa: d.cgpa != null ? String(d.cgpa) : "",
          twelfthSchoolName: d.twelfthSchoolName ?? "",
          twelfthBoard: d.twelfthBoard ?? "",
          twelfthMarks: d.twelfthMarks ?? "",
          tenthSchoolName: d.tenthSchoolName ?? "",
          tenthBoard: d.tenthBoard ?? "",
          tenthMarks: d.tenthMarks ?? "",
        });
      }
    } catch {
      // silent — empty form is fine for first-time users
    } finally {
      setEducationLoading(false);
    }
  };

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEducation((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEducationSaving(true);
    setEducationMessage({ text: "", type: "" });
    try {
      const payload = {
        collegeName: education.collegeName || null,
        degree: education.degree || null,
        branch: education.branch || null,
        graduationYear: education.graduationYear ? parseInt(education.graduationYear) : null,
        cgpa: education.cgpa ? parseFloat(education.cgpa) : null,
        twelfthSchoolName: education.twelfthSchoolName || null,
        twelfthBoard: education.twelfthBoard || null,
        twelfthMarks: education.twelfthMarks || null,
        tenthSchoolName: education.tenthSchoolName || null,
        tenthBoard: education.tenthBoard || null,
        tenthMarks: education.tenthMarks || null,
      };
      const res = await api.put("/students/me/education", payload);
      if (res.success) {
        setEducationMessage({ text: "Education saved successfully!", type: "success" });
        setTimeout(() => setEducationMessage({ text: "", type: "" }), 5000);
      }
    } catch (err: any) {
      setEducationMessage({ text: err?.message || "Failed to save education.", type: "error" });
    } finally {
      setEducationSaving(false);
    }
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      if (userName && userName !== user?.name) {
        const userRes = await api.patch("/users/me", { name: userName });
        if (userRes.success && user && accessToken) {
          setAuth({ ...user, name: userName }, accessToken);
        }
      }
      // Only send fields the backend StudentProfileRequest expects
      const profilePayload = {
        bio: profile.bio ?? null,
        targetRole: profile.targetRole ?? null,
      };
      const res = await api.put("/students/me", profilePayload);
      if (res.success) {
        setProfile(res.data);
        setMessage({ text: "Profile updated successfully!", type: "success" });
      }
    } catch (err: any) {
      setMessage({ text: err?.message || "Failed to save profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) {
      setSkillError("Please select a skill");
      return;
    }
    setSkillSaving(true);
    setSkillError("");
    try {
      await api.post("/students/me/skills", {
        skillId: parseInt(selectedSkillId),
        proficiency: skillProficiency,
      });
      setIsSkillModalOpen(false);
      setSelectedSkillId("");
      setSkillProficiency(3);
      fetchMySkills();
    } catch (err: any) {
      setSkillError(err?.message || "Failed to add skill.");
    } finally {
      setSkillSaving(false);
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

  const handleDeleteSkill = async (skillId: number) => {
    try {
      await api.delete(`/students/me/skills/${skillId}`);
      setMySkills((prev) => prev.filter((s) => s.skill.id !== skillId));
    } catch (err) {
      console.error("Failed to delete skill", err);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeUploading(true);
      
      const formData = new FormData();
      formData.append("file", file);
      
      try {
        const res = await api.post("/students/me/resumes", formData);
        if (res.success) {
          setMessage({ text: "Resume uploaded successfully!", type: "success" });
          fetchResumes();
        }
      } catch (err: any) {
        setMessage({ text: err.message || "Failed to upload resume", type: "error" });
      } finally {
        setResumeUploading(false);
      }
    }
  };

  const handleDeleteResume = async (id: number) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await api.delete(`/students/me/resumes/${id}`);
      setResumes(prev => prev.filter(r => r.id !== id));
      setMessage({ text: "Resume deleted successfully.", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to delete resume", type: "error" });
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-slate-500 dark:text-slate-400">Loading profile...</div>;
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "ST";

  const tabs = [
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "resume", label: "Resume", icon: FileText },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl space-y-6 pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-10 sm:pb-15">
      
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile Dashboard</h1>
      </div>

      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center justify-between rounded-md p-4 text-sm font-medium ${
              message.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage({ text: "", type: "" })} className="rounded-full p-1 hover:bg-black/5">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {/* Profile snippet */}
          <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white shadow-md mb-4">
              {initials}
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{user?.email}</p>
            <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
              {profile.targetRole || "Student"}
            </span>
          </div>

          <nav className="flex flex-col space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
            
            {/* ABOUT TAB */}
            {activeTab === "about" && (
              <form onSubmit={handleSave} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">About Me</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                    <Input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your full name"
                      className="bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Target Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="targetRole"
                      required
                      value={profile.targetRole || ""}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:text-slate-200"
                    >
                      <option value="" disabled>Select a role</option>
                      {TARGET_ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                    <textarea
                      name="bio"
                      rows={5}
                      value={profile.bio || ""}
                      onChange={handleChange}
                      className="flex w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:text-slate-200"
                      placeholder="Tell recruiters a bit about yourself..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {saving ? "Saving..." : "Save About Details"}
                  </Button>
                </div>
              </form>
            )}

            {/* SKILLS TAB */}
            {activeTab === "skills" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">My Skills</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Add and manage your skills to improve your match score.</p>
                  </div>
                  <Button onClick={() => setIsSkillModalOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus size={16} /> Add Skill
                  </Button>
                </div>

                {skillsLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    {mySkills.length === 0 ? (
                      <div className="col-span-full rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-12 text-center">
                        <h4 className="text-base font-medium text-slate-900 dark:text-white">No skills added yet</h4>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Get started by adding technical or soft skills from the catalogue.
                        </p>
                        <Button onClick={() => setIsSkillModalOpen(true)} variant="outline" className="mt-4">
                          Add your first skill
                        </Button>
                      </div>
                    ) : (
                      mySkills.map((item) => (
                        <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-shadow hover:shadow-md">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-white">{item.skill.name}</h4>
                              <span className="mt-1 inline-flex rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                                {item.skill.category}
                              </span>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <button 
                                onClick={() => handleDeleteSkill(item.skill.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                                title="Remove skill"
                              >
                                <X size={16} />
                              </button>
                              <span className="text-xs text-slate-400" title="Source">{item.source}</span>
                            </div>
                          </div>
                          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2" title={item.skill.description}>
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
                  {isSkillModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setIsSkillModalOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl"
                      >
                        <div className="mb-5 flex items-center justify-between">
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Skill</h2>
                          <button
                            onClick={() => setIsSkillModalOpen(false)}
                            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        <form onSubmit={handleAddSkill} className="space-y-5">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Select Skill</label>
                            <select
                              required
                              value={selectedSkillId}
                              onChange={(e) => setSelectedSkillId(e.target.value)}
                              className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:text-slate-200"
                            >
                              <option value="" disabled>Choose a skill...</option>
                              {catalogue
                                .filter((c) => !mySkills.some((m) => m.skill.id === c.id))
                                .map((skill) => (
                                  <option key={skill.id} value={skill.id}>
                                    {skill.name} ({skill.category})
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                              Proficiency (1–5)
                            </label>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setSkillProficiency(star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    size={32}
                                    className={`transition-colors ${
                                      star <= skillProficiency
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-slate-100 text-slate-200 hover:fill-yellow-200 hover:text-yellow-200"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          {skillError && <div className="text-sm text-red-500 font-medium">{skillError}</div>}

                          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
                            <Button type="button" variant="ghost" onClick={() => setIsSkillModalOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={skillSaving || !selectedSkillId}>
                              {skillSaving ? "Adding..." : "Add Skill"}
                            </Button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* EDUCATION TAB */}
            {activeTab === "education" && (
              <form onSubmit={handleEducationSave} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Education History</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">All education details are saved to your profile.</p>
                  </div>
                </div>

                {/* Education message banner */}
                <AnimatePresence>
                  {educationMessage.text && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`flex items-center justify-between rounded-md p-3 text-sm font-medium ${
                        educationMessage.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      <span>{educationMessage.text}</span>
                      <button type="button" onClick={() => setEducationMessage({ text: "", type: "" })} className="rounded-full p-1 hover:bg-black/5">
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {educationLoading ? (
                  <div className="space-y-4">
                    {[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full rounded-md" />)}
                  </div>
                ) : (
                  <>
                    {/* ── Graduation / College ─────────────────────────────────── */}
                    <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-900/10 p-5 space-y-4">
                      <h4 className="text-base font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                        <GraduationCap size={18} /> Graduation / College
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">College / University</label>
                          <Input
                            name="collegeName"
                            value={education.collegeName}
                            onChange={handleEducationChange}
                            placeholder="e.g. Indian Institute of Technology"
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Degree</label>
                          <Input
                            name="degree"
                            value={education.degree}
                            onChange={handleEducationChange}
                            placeholder="e.g. B.Tech"
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Branch / Specialisation</label>
                          <Input
                            name="branch"
                            value={education.branch}
                            onChange={handleEducationChange}
                            placeholder="e.g. Computer Science"
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Graduation Year</label>
                          <Input
                            type="number"
                            name="graduationYear"
                            value={education.graduationYear}
                            onChange={handleEducationChange}
                            placeholder="e.g. 2025"
                            min={2000}
                            max={2040}
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">CGPA <span className="text-slate-400 font-normal">(out of 10)</span></label>
                          <Input
                            type="number"
                            name="cgpa"
                            value={education.cgpa}
                            onChange={handleEducationChange}
                            placeholder="e.g. 8.5"
                            min={0}
                            max={10}
                            step={0.01}
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── Class 12 ─────────────────────────────────────────────── */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 p-5 space-y-4">
                      <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">12th Standard — Higher Secondary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">School Name</label>
                          <Input
                            name="twelfthSchoolName"
                            value={education.twelfthSchoolName}
                            onChange={handleEducationChange}
                            placeholder="e.g. Delhi Public School"
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Board</label>
                          <Input
                            name="twelfthBoard"
                            value={education.twelfthBoard}
                            onChange={handleEducationChange}
                            placeholder="e.g. CBSE / ICSE / State"
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Marks / Percentage</label>
                          <Input
                            name="twelfthMarks"
                            value={education.twelfthMarks}
                            onChange={handleEducationChange}
                            placeholder="e.g. 92%"
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── Class 10 ─────────────────────────────────────────────── */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 p-5 space-y-4">
                      <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">10th Standard — Secondary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">School Name</label>
                          <Input
                            name="tenthSchoolName"
                            value={education.tenthSchoolName}
                            onChange={handleEducationChange}
                            placeholder="e.g. Kendriya Vidyalaya"
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Board</label>
                          <Input
                            name="tenthBoard"
                            value={education.tenthBoard}
                            onChange={handleEducationChange}
                            placeholder="e.g. CBSE / ICSE / State"
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Marks / Percentage</label>
                          <Input
                            name="tenthMarks"
                            value={education.tenthMarks}
                            onChange={handleEducationChange}
                            placeholder="e.g. 95%"
                            className="bg-white dark:bg-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button type="submit" disabled={educationSaving || educationLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {educationSaving ? "Saving..." : "Save Education"}
                  </Button>
                </div>
              </form>
            )}

            {/* RESUME TAB */}
            {activeTab === "resume" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Resume Upload</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Upload your latest resume to help employers understand your full experience.</p>
                </div>

                <div className="mt-6 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleResumeUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    disabled={resumeUploading}
                  />
                  
                  {resumeUploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Uploading your resume...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-2">
                        <UploadCloud size={32} />
                      </div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">Click or drag file to upload</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Supported formats: PDF (Max 5MB)</p>
                      <Button variant="outline" className="mt-4 pointer-events-none">Select File</Button>
                    </div>
                  )}
                </div>

                {resumesLoading ? (
                  <div className="mt-6 flex justify-center"><div className="animate-spin h-6 w-6 border-2 border-indigo-600 rounded-full border-t-transparent"></div></div>
                ) : resumes.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Your Uploaded Resumes</h4>
                    {resumes.map(resume => (
                      <div key={resume.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 text-red-600 p-2 rounded">
                            <FileText size={20} />
                          </div>
                          <div>
                            <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">{resume.fileName}</a>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Uploaded {new Date(resume.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 z-20" onClick={() => handleDeleteResume(resume.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
