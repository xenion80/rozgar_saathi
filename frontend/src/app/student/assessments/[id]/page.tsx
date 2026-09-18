"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Clock, Award } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: number;
  text: string;
  options: { id: string; text: string }[];
}

interface Assessment {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  skillName: string;
  questions: Question[];
}

interface AssessmentResult {
  score: number;
  totalQuestions: number;
  passed: boolean;
  newProficiency: string;
  feedback: string;
}

export default function AssessmentFlowPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [status, setStatus] = useState<"INTRO" | "IN_PROGRESS" | "COMPLETED">("INTRO");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await api.get<any>(`/assessments/${id}`);
        setAssessment(res.success ? res.data : res);
      } catch (err) {
        console.error(err);
        setError("Failed to load assessment. It may not exist or you might not have access.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  const handleStart = async () => {
    try {
      setLoading(true);
      await api.post(`/assessments/${id}/start`);
      setStatus("IN_PROGRESS");
    } catch (err) {
      console.error(err);
      alert("Failed to start assessment.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId: number, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!assessment) return;
    
    const unansweredCount = assessment.questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      if (!window.confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    try {
      setSubmitting(true);
      const res = await api.post<any>(`/assessments/${id}/submit`, { answers });
      setResult(res.success ? res.data : res);
      setStatus("COMPLETED");
    } catch (err) {
      console.error(err);
      alert("Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && status === "INTRO") return <LoadingState title="Loading assessment..." />;
  if (error || !assessment) return <ErrorState title="Assessment Error" message={error || "Not found"} />;

  if (status === "INTRO") {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Link href="/student/skills">
          <Button variant="ghost" size="sm" className="mb-4 -ml-3 text-slate-500">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Skills
          </Button>
        </Link>
        <Card>
          <CardHeader className="text-center pb-8 border-b">
            <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">{assessment.title}</CardTitle>
            <CardDescription className="text-base mt-2">
              Skill validation for: <span className="font-semibold text-slate-900">{assessment.skillName}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <p className="text-slate-600">{assessment.description}</p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-8 py-6 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 flex items-center justify-center gap-1.5">
                  <Clock className="h-4 w-4" /> Duration
                </p>
                <p className="text-xl font-semibold text-slate-900 mt-1">{assessment.durationMinutes} mins</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-200"></div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Questions
                </p>
                <p className="text-xl font-semibold text-slate-900 mt-1">{assessment.questions?.length || 0}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-8 pt-4">
            <Button size="lg" className="w-full sm:w-auto px-12" onClick={handleStart}>
              Start Assessment
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (status === "COMPLETED" && result) {
    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Card className="text-center border-t-8 border-t-blue-600 overflow-hidden">
          <CardHeader className="bg-slate-50/50 pb-8 pt-8">
            <CardTitle className="text-3xl">Assessment Complete</CardTitle>
            <CardDescription className="text-base mt-2">Here's how you performed</CardDescription>
          </CardHeader>
          <CardContent className="py-12 space-y-8">
            <div>
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-blue-50 bg-blue-100 mb-4">
                <span className="text-4xl font-bold text-blue-700">{percentage}%</span>
              </div>
              <p className="text-lg font-medium text-slate-900">
                You scored {result.score} out of {result.totalQuestions}
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" /> Skill Proficiency Updated
              </h4>
              <p className="text-slate-600 mb-3">Your validated proficiency level is now:</p>
              <Badge variant="secondary" className="text-lg px-4 py-1.5 bg-blue-100 text-blue-800 hover:bg-blue-100">
                {result.newProficiency}
              </Badge>
            </div>
            
            {result.feedback && (
              <p className="text-slate-600 italic">"{result.feedback}"</p>
            )}
          </CardContent>
          <CardFooter className="bg-slate-50 border-t justify-center py-6">
            <Link href="/student/skills">
              <Button>Return to Skills Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // IN_PROGRESS state
  const question = assessment.questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === assessment.questions.length - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{assessment.title}</h1>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          Question {currentQuestionIdx + 1} of {assessment.questions.length}
        </div>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-300" 
          style={{ width: `${((currentQuestionIdx) / assessment.questions.length) * 100}%` }}
        ></div>
      </div>

      <Card className="min-h-100 flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">{question.text}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3 mt-4">
            {question.options.map((opt) => (
              <label 
                key={opt.id} 
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                  answers[question.id] === opt.id 
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-sm" 
                    : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={opt.id}
                  checked={answers[question.id] === opt.id}
                  onChange={() => handleSelectAnswer(question.id, opt.id)}
                  className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-600"
                />
                <span className={`ml-3 ${answers[question.id] === opt.id ? "font-medium text-blue-900" : "text-slate-700"}`}>
                  {opt.text}
                </span>
              </label>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-slate-50/50 pt-6">
          <Button 
            variant="outline" 
            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIdx === 0 || submitting}
          >
            Previous
          </Button>
          
          {!isLastQuestion ? (
            <Button 
              onClick={() => setCurrentQuestionIdx(prev => Math.min(assessment.questions.length - 1, prev + 1))}
              disabled={submitting}
            >
              Next Question
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {submitting ? "Submitting..." : "Submit Assessment"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
