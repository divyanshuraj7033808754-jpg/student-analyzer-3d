'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Lightbulb, TrendingUp } from 'lucide-react';
import CircularProgress from './ui/CircularProgress';
import RadarChart from './ui/RadarChart';
import RiskGauge from './ui/RiskGauge';
import type { AnalysisResult, ColorTheme } from '@/lib/types';

interface DashboardProps {
  result: AnalysisResult;
}

const THEME_COLOR: Record<ColorTheme, string> = {
  green: '#22c55e',
  yellow: '#eab308',
  red: '#ef4444',
};

export default function Dashboard({ result }: DashboardProps) {
  const color = THEME_COLOR[result.colorTheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid gap-6 lg:grid-cols-3"
    >
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Performance Index</h3>
        <div className="flex justify-center">
          <CircularProgress value={result.performanceIndex} colorClass={color} label={result.overallGrade} />
        </div>
        <div className="mt-4 flex justify-around text-center text-sm">
          <div>
            <div className="text-lg font-bold text-white">
              {result.percentile}
              <span className="text-xs">th</span>
            </div>
            <div className="text-xs text-slate-400">Percentile</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{result.consistencyIndex}</div>
            <div className="text-xs text-slate-400">Consistency</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Subject Breakdown</h3>
        <div className="flex justify-center">
          <RadarChart data={result.subjectBreakdown.map((s) => ({ label: s.subject, value: s.score }))} color={color} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">Risk Assessment</h3>
        <div className="flex justify-center">
          <RiskGauge value={result.riskFactor} />
        </div>
        <div
          className={`mt-3 flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ${
            result.riskLevel === 'low'
              ? 'bg-emerald-500/10 text-emerald-300'
              : result.riskLevel === 'medium'
              ? 'bg-yellow-500/10 text-yellow-300'
              : 'bg-red-500/10 text-red-300'
          }`}
        >
          {result.riskLevel === 'low' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {result.riskLevel.toUpperCase()} RISK
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl lg:col-span-2">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          <TrendingUp className="h-4 w-4" /> AI Insights
        </h3>
        <ul className="space-y-2">
          {result.insights.map((insight, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-lg border border-white/5 bg-slate-900/40 px-4 py-2.5 text-sm text-slate-200"
            >
              {insight}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          <Lightbulb className="h-4 w-4" /> Tips to Improve
        </h3>
        <ul className="space-y-2">
          {result.tips.map((tip, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="text-sm text-slate-300"
            >
              • {tip}
            </motion.li>
          ))}
        </ul>
        {result.weaknesses.length > 0 && (
          <div className="mt-4 border-t border-white/10 pt-3 text-xs text-slate-400">
            Weak areas: <span className="text-red-300">{result.weaknesses.join(', ')}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
