import { NextResponse } from "next/server";

import { listFixtures } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const competition = searchParams.get("competition") ?? undefined;
  const fixtures = await listFixtures(competition);

  return NextResponse.json(fixtures);
}

