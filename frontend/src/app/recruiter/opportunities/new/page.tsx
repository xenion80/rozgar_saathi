import OpportunityForm from "@/components/OpportunityForm";

export default function NewOpportunityPage() {
  return (
    <div className="py-4">
      <div className="mb-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">Post New Opportunity</h1>
        <p className="mt-2 text-slate-600">Create a new job, internship, or project to find the best candidates.</p>
      </div>
      <OpportunityForm />
    </div>
  );
}
