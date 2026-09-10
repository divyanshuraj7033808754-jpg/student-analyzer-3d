'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, Plus, Trash2 } from 'lucide-react';
import type { StudentInput, SubjectScore } from '@/lib/types';

interface StudentFormProps {
  onSubmit: (input: StudentInput) => void;
  loading: boolean;
}

const DEFAULT_SUBJECTS: SubjectScore[] = [
  { subject: 'Mathematics', score: 75 },
  { subject: 'Science', score: 75 },
  { subject: 'English', score: 75 },
];

export default function StudentForm({ onSubmit, loading }: StudentFormProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [subjects, setSubjects] = useState<SubjectScore[]>(DEFAULT_SUBJECTS);
  const [attendance, setAttendance] = useState(85);
  const [studyHours, setStudyHours] = useState(3);
  const [extracurricular, setExtracurricular] = useState(5);
  const [error, setError] = useState<string | null>(null);

  const updateSubject = (index: number, field: keyof SubjectScore, value: string | number) => {
    setSubjects((prev) => prev.map((s, i) => (i === index ? ({ ...s, [field]: value } as SubjectScore) : s)));
  };

  const addSubject = () => {
    if (subjects.length >= 8) return;
    setSubjects((prev) => [...prev, { subject: '', score: 70 }]);
  };

  const removeSubject = (index: number) => {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep1 = (): boolean => {
    if (!name.trim()) {
      setError('Please enter a student name.');
      return false;
    }
    if (subjects.some((s) => !s.subject.trim())) {
      setError('Every subject needs a name.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    setStep((s) => Math.min(1, s + 1));
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = () => {
    if (!validateStep1()) {
      setStep(0);
      return;
    }
    onSubmit({ name: name.trim(), subjects, attendance, studyHours, extracurricular });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
      <div className="mb-6 flex items-center gap-2">
        {['Student & Subjects', 'Habits & Activity'].map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                i <= step ? 'bg-cyan-500 text-slate-900' : 'bg-white/10 text-slate-400'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-sm ${i <= step ? 'text-white' : 'text-slate-500'}`}>{label}</span>
            {i === 0 && <div className="mx-2 h-px flex-1 bg-white/10" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <label className="mb-1 block text-sm text-slate-300">Student Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="mb-5 w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />

            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-slate-300">Core Subjects (score out of 100)</label>
              <button
                type="button"
                onClick={addSubject}
                className="flex items-center gap-1 rounded-lg bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300 hover:bg-cyan-500/20"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            <div className="space-y-2">
              {subjects.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={s.subject}
                    onChange={(e) => updateSubject(i, 'subject', e.target.value)}
                    placeholder="Subject"
                    className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={s.score}
                    onChange={(e) => updateSubject(i, 'score', Number(e.target.value))}
                    className="w-20 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubject(i)}
                    className="rounded-lg p-2 text-slate-500 hover:text-red-400"
                    aria-label="Remove subject"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div>
              <div className="mb-1 flex justify-between text-sm text-slate-300">
                <span>Attendance</span>
                <span>{attendance}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={attendance}
                onChange={(e) => setAttendance(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm text-slate-300">
                <span>Daily Study Hours</span>
                <span>{studyHours}h</span>
              </div>
              <input
                type="range"
                min={0}
                max={12}
                step={0.5}
                value={studyHours}
                onChange={(e) => setStudyHours(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm text-slate-300">
                <span>Extracurricular Rating</span>
                <span>{extracurricular}/10</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={extracurricular}
                onChange={(e) => setExtracurricular(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm text-slate-300 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        {step === 0 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 rounded-lg bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-400"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Analyze
          </button>
        )}
      </div>
    </div>
  );
}
