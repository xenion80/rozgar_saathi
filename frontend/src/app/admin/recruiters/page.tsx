"use client";

import { UsersTable } from "@/components/admin/UsersTable";

export default function RecruitersPage() {
  return (
    <UsersTable 
      roleFilter="RECRUITER" 
      title="Recruiters" 
      description="Manage recruiter and employer accounts." 
    />
  );
}
