import { NextResponse } from "next/server";

import { getFixtureDetails } from "@/lib/data";

export async function GET(
  _request: Request,
  context: { params: Promise<{ fixtureId: string }> },
) {
  const { fixtureId } = await context.params;
  const fixture = await getFixtureDetails(fixtureId);

  if (!fixture) {
    return NextResponse.json({ message: "Fixture not found" }, { status: 404 });
  }

  return NextResponse.json(fixture);
}

