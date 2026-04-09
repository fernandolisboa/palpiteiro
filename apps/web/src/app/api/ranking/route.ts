import { NextResponse } from "next/server";

import { getRanking } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getRanking());
}

