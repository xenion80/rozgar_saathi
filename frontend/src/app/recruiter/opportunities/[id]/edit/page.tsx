"use client";

import { useEffect, useState, use } from "react";
import OpportunityForm from "@/components/OpportunityForm";
import { api } from "@/lib/api";

export default function EditOpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/opportunities/${id}`)
      .then(res => setInitialData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex h-64 items-center justify-center">Loading opportunity...</div>;
  if (!initialData) return <div className="flex h-64 items-center justify-center">Opportunity not found.</div>;

  return (
    <div className="py-4">
      <div className="mb-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">Edit Opportunity</h1>
        <p className="mt-2 text-slate-600">Update details for {initialData.title}</p>
      </div>
      <OpportunityForm initialData={initialData} isEdit={true} />
    </div>
  );
}
