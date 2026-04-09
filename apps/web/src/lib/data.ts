import { createAnalysisRun } from "@palpiteiro/ai-orchestrator";
import { createSportsDataSource } from "@palpiteiro/data-sources";
import {
  analysisRequestSchema,
  competitionSlugSchema,
  providerSelection,
  type AnalysisRequest,
  type CompetitionSlug,
} from "@palpiteiro/domain";

export async function listFixtures(competition?: string) {
  const source = createSportsDataSource();
  const parsed = competitionSlugSchema.safeParse(competition);

  return source.listFixtures(parsed.success ? parsed.data : undefined);
}

export async function getFixtureDetails(fixtureId: string) {
  const source = createSportsDataSource();
  return source.getFixtureDetails(fixtureId);
}

export async function getRanking() {
  const source = createSportsDataSource();
  return source.listProviderScores();
}

export async function getHistory() {
  const source = createSportsDataSource();
  return source.listHistory();
}

export async function getPreferences() {
  const source = createSportsDataSource();
  return source.getPreferences();
}

export async function getQuota() {
  const source = createSportsDataSource();
  return source.getQuota();
}

export async function generateAnalysis(input: AnalysisRequest) {
  const payload = analysisRequestSchema.parse(input);
  const fixture = await getFixtureDetails(payload.fixtureId);

  if (!fixture) {
    throw new Error("Fixture not found.");
  }

  return createAnalysisRun(fixture, payload.providers);
}

export async function regenerateAnalysisFromId(analysisId: string) {
  const [fixtureId, providerList] = analysisId.split("~");

  if (!fixtureId || !providerList) {
    return null;
  }

  const providers = providerList
    .split(",")
    .filter((provider): provider is (typeof providerSelection)[number] =>
      providerSelection.includes(provider as (typeof providerSelection)[number]),
    );

  if (!providers.length) {
    return null;
  }

  return generateAnalysis({ fixtureId, providers });
}

export function isDemoMode() {
  return !process.env.API_FOOTBALL_KEY;
}

export function normalizeCompetition(
  value: string | string[] | undefined,
  fallback: CompetitionSlug,
) {
  const candidate = Array.isArray(value) ? value[0] : value;
  const parsed = competitionSlugSchema.safeParse(candidate);

  return parsed.success ? parsed.data : fallback;
}

