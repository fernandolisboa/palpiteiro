import { NextResponse } from "next/server";

import { generateAnalysis } from "@/lib/data";

export async function POST(request: Request) {
  const body = (await request.json()) as unknown;

  try {
    const analysis = await generateAnalysis(body as never);
    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Nao foi possivel gerar analise.",
      },
      { status: 400 },
    );
  }
}

