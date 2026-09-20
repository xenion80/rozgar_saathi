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
import { Input } from "@/components/ui/input";

interface Question {
  id: number;
  questionText: string;
  questionType: string;
  targetSkill: string;
  options: string[];
  weight: number;
}

interface Assessment {
  id: number;
  title: string;
  status: string;
  questions: Question[];
}

interface AssessmentResult {
  assessmentId: number;
  status: string;
  totalQuestions: number;
  correctAnswers: number;
  skillScores?: { skill: string; proficiency: number }[];
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
      const res = await api.post<any>(`/assessments/${id}/start`);
      const data = res.success ? res.data : res;
      if (data.status === "COMPLETED") {
        setError("You have already completed this assessment.");
        return;
      }
      setStatus("IN_PROGRESS");
    } catch (err: any) {
      alert(err?.message || "Failed to start assessment.");
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
      const payload = {
        answers: Object.entries(answers).map(([qId, ans]) => ({
          questionId: parseInt(qId),
          answer: ans
        }))
      };
      const res = await api.post<any>(`/assessments/${id}/submit`, payload);
      setResult(res.success ? res.data : res);
      setStatus("COMPLETED");
    } catch (err: any) {
      alert(err?.message || "Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && status === "INTRO") return <LoadingState title="Loading assessment..." />;
  if (error || !assessment) return <ErrorState title="Assessment Error" message={error || "Not found"} />;

  if (status === "INTRO") {
    return (
      <div className="max-w-2xl mx-auto mt-8 pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-10 sm:pb-15">
        <Link href="/student/profile">
          <Button variant="ghost" size="sm" className="mb-4 -ml-3 text-slate-500">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Skills
          </Button>
        </Link>
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="text-center pb-8 border-b dark:border-slate-800">
            <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-2xl dark:text-white">{assessment.title}</CardTitle>
            <CardDescription className="text-base mt-2 dark:text-slate-400">
              Skill validation for: <span className="font-semibold text-slate-900 dark:text-white">{assessment.title || "this skill"}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <p className="text-slate-600 dark:text-slate-300">Complete this assessment to validate your proficiency and improve your profile.</p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-8 py-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                  <Clock className="h-4 w-4" /> Duration
                </p>
                <p className="text-xl font-semibold text-slate-900 dark:text-white mt-1">15 mins</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Questions
                </p>
                <p className="text-xl font-semibold text-slate-900 dark:text-white mt-1">{assessment.questions?.length || 0}</p>
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
    const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100) || 0;
    const newProficiency = result.skillScores && result.skillScores.length > 0 
      ? `Level ${result.skillScores[0].proficiency}` 
      : (percentage >= 70 ? "Intermediate" : "Beginner");

    return (
      <div className="max-w-2xl mx-auto mt-8 pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-10 sm:pb-15">
        <Card className="text-center border-t-8 border-t-emerald-600 overflow-hidden dark:bg-slate-900 dark:border-x-slate-800 dark:border-b-slate-800">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-950/50 pb-8 pt-8">
            <CardTitle className="text-3xl dark:text-white">Assessment Complete</CardTitle>
            <CardDescription className="text-base mt-2 dark:text-slate-400">Here's how you performed</CardDescription>
          </CardHeader>
          <CardContent className="py-12 space-y-8">
            <div>
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-emerald-50 dark:border-emerald-900/30 bg-emerald-100 dark:bg-emerald-900/50 mb-4">
                <span className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">{percentage}%</span>
              </div>
              <p className="text-lg font-medium text-slate-900 dark:text-white">
                You scored {result.correctAnswers} out of {result.totalQuestions}
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" /> Skill Proficiency Updated
              </h4>
              <p className="text-slate-600 dark:text-slate-400 mb-3">Your validated proficiency level is now:</p>
              <Badge variant="secondary" className="text-lg px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/70">
                {newProficiency}
              </Badge>
            </div>
            
            {result.status && (
              <p className="text-slate-600 dark:text-slate-400 italic">Status: {result.status}</p>
            )}
          </CardContent>
          <CardFooter className="bg-slate-50 dark:bg-slate-950/50 border-t dark:border-slate-800 justify-center py-6">
            <Link href="/student/profile">
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
    <div className="max-w-3xl mx-auto space-y-6 pt-5 sm:pt-10 md:pt-20 lg:pt-35 pb-10 sm:pb-15">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{assessment.title}</h1>
        <div className="text-sm font-medium text-slate-500 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
          Question {currentQuestionIdx + 1} of {assessment.questions.length}
        </div>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-emerald-600 h-full transition-all duration-300" 
          style={{ width: `${((currentQuestionIdx) / assessment.questions.length) * 100}%` }}
        ></div>
      </div>

      <Card className="min-h-100 flex flex-col dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed dark:text-white">{question.questionText}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3 mt-4">
            {question.questionType === "SHORT_ANSWER" ? (
              <Input
                placeholder="Type your answer here..."
                value={answers[question.id] || ""}
                onChange={(e) => handleSelectAnswer(question.id, e.target.value)}
                className="w-full mt-2"
              />
            ) : (
              question.options && question.options.map((opt, idx) => (
                <label 
                  key={idx} 
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    answers[question.id] === opt 
                      ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-600 dark:ring-emerald-500 shadow-sm" 
                      : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={opt}
                    checked={answers[question.id] === opt}
                    onChange={() => handleSelectAnswer(question.id, opt)}
                    className="w-4 h-4 text-emerald-600 border-slate-300 dark:border-slate-600 dark:bg-slate-800 focus:ring-emerald-600 focus:ring-offset-slate-900"
                  />
                  <span className={`ml-3 ${answers[question.id] === opt ? "font-medium text-emerald-900 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}>
                    {opt}
                  </span>
                </label>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pt-6">
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
