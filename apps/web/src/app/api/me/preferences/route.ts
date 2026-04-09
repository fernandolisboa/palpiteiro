import { NextResponse } from "next/server";

import { getPreferences, getQuota } from "@/lib/data";
import { userPreferencesSchema } from "@palpiteiro/domain";

export async function GET() {
  const [preferences, quota] = await Promise.all([getPreferences(), getQuota()]);

  return NextResponse.json({ preferences, quota });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as unknown;
  const parsed = userPreferencesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Preferences payload is invalid." },
      { status: 400 },
    );
  }

  const quota = await getQuota();

  return NextResponse.json({
    preferences: parsed.data,
    quota,
  });
}
