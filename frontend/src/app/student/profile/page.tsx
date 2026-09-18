"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, GraduationCap, Briefcase, FileText, UploadCloud, CheckCircle2, Trash2, Plus } from "lucide-react";

interface Profile {
  id: number;
  collegeName: string | null;
  degree: string | null;
  branch: string | null;
  graduationYear: number | null;
  bio: string | null;
  targetRole: string | null;
}

const TARGET_ROLES = [
  "Backend Developer",
  "Frontend Developer",
  "Full-Stack Developer",
  "Data Analyst",
];

const PREDEFINED_SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C++", 
  "HTML/CSS", "SQL", "MongoDB", "AWS", "Docker", "Git", "Figma", "UI/UX"
];

export default function StudentProfilePage() {
  const { user, accessToken, setAuth } = useAuthStore();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [userName, setUserName] = useState(user?.name || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [activeTab, setActiveTab] = useState("about");
  
  // Extra state for education
  const [tenthDetails, setTenthDetails] = useState({ school: "", marks: "" });
  const [twelfthDetails, setTwelfthDetails] = useState({ school: "", marks: "" });

  // Skills state
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("");

  // Resume state
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeSuccess, setResumeSuccess] = useState(false);

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
    setProfile((prev) => ({ ...prev, [name]: name === "graduationYear" ? parseInt(value) || "" : value }));
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
      const res = await api.put("/students/me", profile);
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

  const handleAddSkill = () => {
    if (selectedSkill && !skills.includes(selectedSkill)) {
      setSkills([...skills, selectedSkill]);
    }
    setSelectedSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeUploading(true);
      setResumeSuccess(false);
      setTimeout(() => {
        setResumeUploading(false);
        setResumeSuccess(true);
      }, 2000);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-slate-500">Loading profile...</div>;
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-6xl space-y-6">
      
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
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Technical Skills</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Add skills to help us match you with the right opportunities.</p>
                </div>
                
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Select a Skill</label>
                    <select
                      value={selectedSkill}
                      onChange={(e) => setSelectedSkill(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none dark:text-slate-200"
                    >
                      <option value="">-- Choose a predefined skill --</option>
                      {PREDEFINED_SKILLS.filter(s => !skills.includes(s)).map((skill) => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={handleAddSkill} disabled={!selectedSkill} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus size={16} className="mr-1" /> Add
                  </Button>
                </div>

                <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Your Skills</h4>
                  {skills.length === 0 ? (
                    <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                      <p className="text-slate-500 dark:text-slate-400 text-sm">No skills added yet.</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <div key={skill} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300">
                          {skill}
                          <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EDUCATION TAB */}
            {activeTab === "education" && (
              <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Education History</h3>
                </div>

                {/* Graduation */}
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 border-b border-indigo-100 dark:border-indigo-900/50 pb-2">Graduation / College</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">College / University</label>
                      <Input name="collegeName" value={profile.collegeName || ""} onChange={handleChange} placeholder="e.g. Indian Institute of Technology" className="bg-slate-50 dark:bg-slate-800" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Degree</label>
                      <Input name="degree" value={profile.degree || ""} onChange={handleChange} placeholder="e.g. B.Tech" className="bg-slate-50 dark:bg-slate-800" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Branch</label>
                      <Input name="branch" value={profile.branch || ""} onChange={handleChange} placeholder="e.g. Computer Science" className="bg-slate-50 dark:bg-slate-800" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Graduation Year</label>
                      <Input type="number" name="graduationYear" value={profile.graduationYear || ""} onChange={handleChange} placeholder="e.g. 2024" className="bg-slate-50 dark:bg-slate-800" />
                    </div>
                  </div>
                </div>

                {/* 12th Standard */}
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">12th Standard (Higher Secondary)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-1">
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">School / Board</label>
                      <Input value={twelfthDetails.school} onChange={(e) => setTwelfthDetails({...twelfthDetails, school: e.target.value})} placeholder="School Name or CBSE/State Board" className="bg-slate-50 dark:bg-slate-800" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Percentage / CGPA</label>
                      <Input value={twelfthDetails.marks} onChange={(e) => setTwelfthDetails({...twelfthDetails, marks: e.target.value})} placeholder="e.g. 92% or 9.5 CGPA" className="bg-slate-50 dark:bg-slate-800" />
                    </div>
                  </div>
                </div>

                {/* 10th Standard */}
                <div className="space-y-4">
                  <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">10th Standard (Secondary)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-1">
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">School / Board</label>
                      <Input value={tenthDetails.school} onChange={(e) => setTenthDetails({...tenthDetails, school: e.target.value})} placeholder="School Name or CBSE/State Board" className="bg-slate-50 dark:bg-slate-800" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Percentage / CGPA</label>
                      <Input value={tenthDetails.marks} onChange={(e) => setTenthDetails({...tenthDetails, marks: e.target.value})} placeholder="e.g. 95% or 10 CGPA" className="bg-slate-50 dark:bg-slate-800" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {saving ? "Saving..." : "Save Education"}
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
                  ) : resumeSuccess ? (
                    <div className="flex flex-col items-center gap-3 text-emerald-600 dark:text-emerald-500">
                      <CheckCircle2 size={48} className="mb-2" />
                      <p className="text-sm font-medium">Resume uploaded successfully!</p>
                      <p className="text-xs text-slate-500">Click anywhere to replace.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-2">
                        <UploadCloud size={32} />
                      </div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">Click or drag file to upload</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Supported formats: PDF, DOCX (Max 5MB)</p>
                      <Button variant="outline" className="mt-4 pointer-events-none">Select File</Button>
                    </div>
                  )}
                </div>

                {resumeSuccess && (
                  <div className="mt-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 text-red-600 p-2 rounded">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name ? `${user.name.split(" ").join("_")}_Resume.pdf` : "Resume.pdf"}</p>
                        <p className="text-xs text-slate-500">Updated just now</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 z-20" onClick={() => setResumeSuccess(false)}>
                      <Trash2 size={16} />
                    </Button>
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
