import type { AnalysisResult, ColorTheme, RiskLevel, StudentInput } from './types';

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function standardDeviation(nums: number[]): number {
  if (nums.length === 0) return 0;
  const avg = average(nums);
  const variance = average(nums.map((n) => (n - avg) ** 2));
  return Math.sqrt(variance);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Approximation of the standard normal CDF (Abramowitz & Stegun 7.1.26).
 * Used to translate a performance index into a mock population percentile
 * (assumed population mean = 65, std = 15) without needing a real database
 * of historical student records.
 */
function normalCdf(x: number, mean: number, std: number): number {
  const z = (x - mean) / (std * Math.sqrt(2));
  const t = 1 / (1 + 0.3275911 * Math.abs(z));
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-z * z);
  const erf = z >= 0 ? y : -y;
  return 0.5 * (1 + erf);
}

function gradeFromScore(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

export function analyzeStudent(input: StudentInput): AnalysisResult {
  const scores = input.subjects.map((s) => s.score);
  const subjectAvg = average(scores);

  // Study hours are normalized against an 8h/day ceiling; beyond that
  // returns diminish for this model, so we cap it at 100.
  const studyHoursNormalized = clamp((input.studyHours / 8) * 100, 0, 100);
  const extracurricularNormalized = (input.extracurricular / 10) * 100;

  const performanceIndex = round(
    clamp(
      subjectAvg * 0.5 +
        input.attendance * 0.2 +
        studyHoursNormalized * 0.15 +
        extracurricularNormalized * 0.15,
      0,
      100
    )
  );

  const stdDev = standardDeviation(scores);
  const consistencyIndex = round(clamp(100 - stdDev * 2, 0, 100));

  const riskFactor = round(
    clamp(
      (100 - performanceIndex) * 0.6 +
        (100 - input.attendance) * 0.25 +
        (100 - consistencyIndex) * 0.15,
      0,
      100
    )
  );

  const riskLevel: RiskLevel = riskFactor >= 60 ? 'high' : riskFactor >= 30 ? 'medium' : 'low';

  const percentile = Math.round(clamp(normalCdf(performanceIndex, 65, 15) * 100, 1, 99));

  const subjectBreakdown = input.subjects.map((s) => ({
    subject: s.subject,
    score: s.score,
    strength: s.score >= subjectAvg,
  }));

  const weaknesses = input.subjects
    .filter((s) => s.score < 60 || s.score < subjectAvg - 10)
    .map((s) => s.subject);

  const insights: string[] = [];
  const tips: string[] = [];

  if (performanceIndex >= 80) {
    insights.push(
      `${input.name} is performing strongly overall with a performance index of ${performanceIndex}.`
    );
  } else if (performanceIndex >= 55) {
    insights.push(
      `${input.name} is showing average performance — there is clear room to move into the top bracket.`
    );
  } else {
    insights.push(
      `${input.name}'s overall performance is below target and needs focused intervention.`
    );
  }

  if (input.attendance < 75) {
    insights.push(
      'Attendance is below the recommended threshold and is likely dragging down overall performance.'
    );
    tips.push('Aim for at least 85% attendance — consistent presence strongly correlates with better grades.');
  }

  if (input.studyHours < 2) {
    tips.push('Increase daily focused study time to at least 2-3 hours.');
  }

  if (consistencyIndex < 60) {
    insights.push('Scores vary significantly across subjects, which increases overall risk.');
    tips.push('Spend extra time balancing weaker subjects rather than over-focusing on strong ones.');
  }

  if (weaknesses.length > 0) {
    insights.push(`Weakest area(s) detected: ${weaknesses.join(', ')}.`);
    tips.push(`Dedicate focused revision blocks to ${weaknesses[0]} this week.`);
  } else {
    insights.push('No major weak subjects detected — performance is fairly balanced.');
  }

  if (input.extracurricular <= 2 && performanceIndex >= 70) {
    tips.push(
      'Consider light extracurricular involvement — it supports well-rounded development without hurting grades.'
    );
  }

  tips.push('Review mistakes weekly to reinforce weak concepts before they compound.');

  const overallGrade = gradeFromScore(performanceIndex);
  const colorTheme: ColorTheme = performanceIndex >= 80 ? 'green' : performanceIndex >= 55 ? 'yellow' : 'red';

  return {
    performanceIndex,
    overallGrade,
    riskLevel,
    riskFactor,
    consistencyIndex,
    percentile,
    subjectBreakdown,
    weaknesses,
    insights,
    tips: tips.slice(0, 5),
    colorTheme,
  };
}
