'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Scene from '@/components/3d/Scene';
import StudentForm from '@/components/StudentForm';
import Dashboard from '@/components/Dashboard';
import type { AnalysisResult, AnalyzeApiError, AnalyzeApiSuccess, StudentInput } from '@/lib/types';

export default function HomePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (input: StudentInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const json = (await res.json()) as AnalyzeApiSuccess | AnalyzeApiError;
      if (!res.ok || !('success' in json) || !json.success) {
        const message = 'error' in json ? json.error : 'Analysis failed.';
        throw new Error(message);
      }
      setResult(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const heroScore = result?.performanceIndex ?? 70;

  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="relative h-[70vh] w-full overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Scene score={heroScore} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#05070d]" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="mb-4 flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered 3D Analytics
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Student Analyzer{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">3D</span>
          </h1>
          <p className="mt-4 max-w-xl text-slate-400">
            Turn attendance, scores, and study habits into a living 3D performance crystal — with AI-driven insights
            and risk detection.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold">Enter Student Data</h2>
          <p className="mt-1 text-sm text-slate-400">Fill in the details below to generate a full analytics report.</p>
        </div>

        <div className="mx-auto max-w-xl">
          <StudentForm onSubmit={handleAnalyze} loading={loading} />
        </div>

        {error && (
          <div className="mx-auto mt-6 max-w-xl rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-14">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold">Analytics Dashboard — {result.overallGrade} Grade</h2>
              <p className="mt-1 text-sm text-slate-400">Report generated for the submitted profile.</p>
            </div>
            <Dashboard result={result} />
          </div>
        )}
      </section>
    </main>
  );
}
