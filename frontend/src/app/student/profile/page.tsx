"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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

export default function StudentProfilePage() {
  const { user, accessToken, setAuth } = useAuthStore();
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [userName, setUserName] = useState(user?.name || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

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
        // Ignored, handled by interceptor
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
      }, 10000);
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
      // 1. Update User Details (Name) if changed
      if (userName && userName !== user?.name) {
        const userRes = await api.patch("/users/me", { name: userName });
        if (userRes.success && user && accessToken) {
          setAuth({ ...user, name: userName }, accessToken);
        }
      }

      // 2. Update Student Profile
      const res = await api.put("/students/me", profile);
      if (res.success) {
        setProfile(res.data);
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setIsEditing(false);
      }
    } catch (err: any) {
      setMessage({ text: err?.message || "Failed to save profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center">Loading profile...</div>;
  }

  // Generate initials for avatar
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "ST";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Student Profile</h1>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit Profile
          </Button>
        )}
      </div>

      <AnimatePresence>
        {message.text && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 flex items-center justify-between rounded-md p-4 text-sm font-medium ${
              message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage({ text: "", type: "" })}
              className={`rounded-full p-1 transition-colors ${
                message.type === "error" ? "hover:bg-red-100" : "hover:bg-green-100"
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Profile Header section with avatar */}
        <div className="bg-slate-50 p-6 sm:p-8 border-b border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-3xl font-bold text-white shadow-md">
            {initials}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 mb-4">{user?.email}</p>
            {!isEditing && (
              <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                Target Role: {profile.targetRole || "Not specified"}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {!isEditing ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Academic Details</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-slate-500">College / University</dt>
                    <dd className="mt-1 text-base text-slate-900 font-medium">{profile.collegeName || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Graduation Year</dt>
                    <dd className="mt-1 text-base text-slate-900 font-medium">{profile.graduationYear || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Degree</dt>
                    <dd className="mt-1 text-base text-slate-900 font-medium">{profile.degree || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Branch</dt>
                    <dd className="mt-1 text-base text-slate-900 font-medium">{profile.branch || "-"}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">About Me</h3>
                <div className="text-base text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {profile.bio || "No bio added yet."}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                  <Input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">College / University</label>
                  <Input
                    name="collegeName"
                    value={profile.collegeName || ""}
                    onChange={handleChange}
                    placeholder="e.g. Indian Institute of Technology"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Degree</label>
                  <Input
                    name="degree"
                    value={profile.degree || ""}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Branch</label>
                  <Input
                    name="branch"
                    value={profile.branch || ""}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Graduation Year</label>
                  <Input
                    type="number"
                    name="graduationYear"
                    min="2000"
                    max="2040"
                    value={profile.graduationYear || ""}
                    onChange={handleChange}
                    placeholder="e.g. 2027"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Target Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="targetRole"
                    required
                    value={profile.targetRole || ""}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  >
                    <option value="" disabled>Select a role</option>
                    {TARGET_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-500">Required for accurate skill-gap analysis.</p>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  value={profile.bio || ""}
                  onChange={handleChange}
                  className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  placeholder="Tell recruiters a bit about yourself..."
                />
              </div>

              <AnimatePresence>
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`flex items-center justify-between rounded-md p-4 text-sm font-medium ${
                        message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      <span>{message.text}</span>
                      <button
                        type="button"
                        onClick={() => setMessage({ text: "", type: "" })}
                        className={`rounded-full p-1 transition-colors ${
                          message.type === "success" ? "hover:bg-green-100" : "hover:bg-red-100"
                        }`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}
