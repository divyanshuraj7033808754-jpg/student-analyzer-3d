export interface SubjectScore {
  subject: string;
  score: number; // 0-100
}

export interface StudentInput {
  name: string;
  subjects: SubjectScore[];
  attendance: number; // 0-100 (%)
  studyHours: number; // daily hours, 0-24
  extracurricular: number; // 0-10 rating
}

export type RiskLevel = 'low' | 'medium' | 'high';
export type ColorTheme = 'green' | 'yellow' | 'red';

export interface SubjectBreakdown {
  subject: string;
  score: number;
  strength: boolean;
}

export interface AnalysisResult {
  performanceIndex: number; // 0-100
  overallGrade: string; // A+, A, B, C, D, F
  riskLevel: RiskLevel;
  riskFactor: number; // 0-100 (higher = more risk)
  consistencyIndex: number; // 0-100 (higher = more consistent)
  percentile: number; // 1-99
  subjectBreakdown: SubjectBreakdown[];
  weaknesses: string[];
  insights: string[];
  tips: string[];
  colorTheme: ColorTheme;
}

export interface AnalyzeApiSuccess {
  success: true;
  data: AnalysisResult;
}

export interface AnalyzeApiError {
  success?: false;
  error: string;
  details?: unknown;
}
