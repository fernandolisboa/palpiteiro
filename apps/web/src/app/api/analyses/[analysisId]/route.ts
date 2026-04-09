import { NextResponse } from "next/server";

import { regenerateAnalysisFromId } from "@/lib/data";

export async function GET(
  _request: Request,
  context: { params: Promise<{ analysisId: string }> },
) {
  const { analysisId } = await context.params;
  const analysis = await regenerateAnalysisFromId(analysisId);

  if (!analysis) {
    return NextResponse.json({ message: "Analysis not found" }, { status: 404 });
  }

  return NextResponse.json(analysis);
}

