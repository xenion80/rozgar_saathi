import OpportunityForm from "@/components/OpportunityForm";

export default function NewOpportunityPage() {
  return (
    <div className="pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-5 sm:pb-10 md:pb-15 lg:pb-20 ">
      <div className="mb-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Post New Opportunity</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Create a new job, internship, or project to find the best candidates.</p>
      </div>
      <OpportunityForm />
    </div>
  );
}
