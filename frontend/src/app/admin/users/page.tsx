"use client";

import { UsersTable } from "@/components/admin/UsersTable";

export default function UsersPage() {
  return (
    <UsersTable 
      roleFilter="ALL" 
      title="All Users" 
      description="Manage all users across the platform." 
    />
  );
}
