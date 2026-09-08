import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "open"
  | "closed"
  | "draft"
  | "shortlisted"
  | "interview"
  | "selected"
  | "rejected"
  | "withdrawn"
  | "applied"
  | "internship"
  | "job"
  | "project"
  | "default";

const variantStyles: Record<BadgeVariant, string> = {
  open:        "bg-green-50  text-green-700  ring-green-600/20",
  selected:    "bg-green-50  text-green-700  ring-green-600/20",
  shortlisted: "bg-blue-50   text-blue-700   ring-blue-600/20",
  applied:     "bg-blue-50   text-blue-700   ring-blue-600/20",
  interview:   "bg-purple-50 text-purple-700 ring-purple-600/20",
  rejected:    "bg-red-50    text-red-700    ring-red-600/20",
  closed:      "bg-slate-100 text-slate-600  ring-slate-500/20",
  draft:       "bg-slate-100 text-slate-600  ring-slate-500/20",
  withdrawn:   "bg-slate-100 text-slate-600  ring-slate-500/20",
  internship:  "bg-blue-50   text-blue-700   ring-blue-600/20",
  job:         "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  project:     "bg-amber-50  text-amber-700  ring-amber-600/20",
  default:     "bg-slate-100 text-slate-700  ring-slate-500/20",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  label?: string;
}

export function Badge({ variant = "default", label, children, className, ...props }: BadgeProps) {
  const resolvedVariant = (variant?.toLowerCase() as BadgeVariant) ?? "default";
  const styles = variantStyles[resolvedVariant] ?? variantStyles.default;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles,
        className
      )}
      {...props}
    >
      {label ?? children}
    </span>
  );
}

/** Convenience: derive variant from a raw status string returned by the API */
export function StatusBadge({ status }: { status: string }) {
  const variant = (status?.toLowerCase() as BadgeVariant) ?? "default";
  return <Badge variant={variant}>{status}</Badge>;
}
