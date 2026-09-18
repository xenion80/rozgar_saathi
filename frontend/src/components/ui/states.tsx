import { Loader2, AlertCircle, FileX2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StateProps {
  title?: string;
  message?: string;
  className?: string;
}

export function LoadingState({ title = "Loading...", message, className }: StateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center min-h-50", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      {message && <p className="text-sm text-slate-500 mt-2 max-w-sm">{message}</p>}
    </div>
  );
}

export function EmptyState({ title = "No data found", message, className }: StateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center min-h-50 border-2 border-dashed border-slate-200 rounded-xl", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
        <FileX2 className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      {message && <p className="text-sm text-slate-500 mt-2 max-w-sm">{message}</p>}
    </div>
  );
}

export function ErrorState({ title = "An error occurred", message = "Something went wrong. Please try again.", className }: StateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center min-h-50 bg-red-50 rounded-xl border border-red-100", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-red-900">{title}</h3>
      {message && <p className="text-sm text-red-600 mt-2 max-w-sm">{message}</p>}
    </div>
  );
}
