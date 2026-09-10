import { NextRequest, NextResponse } from 'next/server';
import { studentInputSchema } from '@/lib/schema';
import { analyzeStudent } from '@/lib/analysis';
import type { AnalyzeApiError, AnalyzeApiSuccess } from '@/lib/types';

export async function POST(
  req: NextRequest
): Promise<NextResponse<AnalyzeApiSuccess | AnalyzeApiError>> {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const parsed = studentInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = analyzeStudent(parsed.data);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to analyze student data.' }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'ok', message: 'Student Analyzer API is running.' });
}
