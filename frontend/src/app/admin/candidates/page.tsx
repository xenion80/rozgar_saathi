"use client";

import { UsersTable } from "@/components/admin/UsersTable";

export default function CandidatesPage() {
  return (
    <UsersTable 
      roleFilter="STUDENT" 
      title="Candidates" 
      description="Manage student and candidate accounts." 
    />
  );
}
