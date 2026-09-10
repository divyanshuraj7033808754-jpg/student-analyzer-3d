'use client';

import { motion } from 'framer-motion';

interface RiskGaugeProps {
  value: number; // 0-100, higher = more risk
  size?: number;
}

export default function RiskGauge({ value, size = 220 }: RiskGaugeProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = size / 2 - 16;
  const circumference = Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = clamped >= 60 ? '#ef4444' : clamped >= 30 ? '#eab308' : '#22c55e';
  const arcPath = `M 16 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 16} ${size / 2}`;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20}>
        <path d={arcPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} strokeLinecap="round" />
        <motion.path
          d={arcPath}
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="-mt-8 text-center">
        <div className="text-2xl font-bold text-white">{Math.round(clamped)}%</div>
        <div className="text-xs text-slate-400">Risk Factor</div>
      </div>
    </div>
  );
}
