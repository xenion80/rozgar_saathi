"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingState } from "@/components/ui/states";

function AssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skill = searchParams.get("skill");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/student/assessments/1");
    }, 1500);

    return () => clearTimeout(timer);
  }, [router, skill]);

  return (
    <div className="pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-10 sm:pb-15">
      <LoadingState 
        title={skill ? `Preparing ${skill} Assessment...` : "Preparing Assessment..."}
        message="Generating questions tailored to your skill level." 
      />
    </div>
  );
}

export default function AssessmentLandingPage() {
  return (
    <Suspense fallback={<div className="pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-10 sm:pb-15"><LoadingState title="Loading..." /></div>}>
      <AssessmentContent />
    </Suspense>
  );
}
