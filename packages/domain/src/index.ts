import { z } from "zod";

export const providerSchema = z.enum(["claude", "gpt", "gemini", "grok"]);
export type ProviderKey = z.infer<typeof providerSchema>;

export const competitionSlugSchema = z.enum([
  "brasileirao",
  "copa-do-brasil",
  "libertadores",
]);
export type CompetitionSlug = z.infer<typeof competitionSlugSchema>;

export const providerLabels: Record<ProviderKey, string> = {
  claude: "Claude",
  gpt: "GPT",
  gemini: "Gemini",
  grok: "Grok",
};

export const providerNames: Record<ProviderKey, string> = {
  claude: "Claude 3.7 Sonnet",
  gpt: "GPT-5",
  gemini: "Gemini 2.5 Pro",
  grok: "Grok 3",
};

export const competitionLabels: Record<CompetitionSlug, string> = {
  brasileirao: "Brasileirao",
  "copa-do-brasil": "Copa do Brasil",
  libertadores: "Libertadores",
};

export const teamProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  city: z.string(),
  rating: z.number(),
  attackIndex: z.number(),
  defenseIndex: z.number(),
  formIndex: z.number(),
  goalsForPerMatch: z.number(),
  goalsAgainstPerMatch: z.number(),
  cornersForPerMatch: z.number(),
  cornersAgainstPerMatch: z.number(),
  cardsForPerMatch: z.number(),
  cardsAgainstPerMatch: z.number(),
  cleanSheetRate: z.number(),
  bttsRate: z.number(),
  injuriesImpact: z.number(),
});
export type TeamProfile = z.infer<typeof teamProfileSchema>;

export const competitionSchema = z.object({
  slug: competitionSlugSchema,
  name: z.string(),
  seasonLabel: z.string(),
  country: z.string(),
});
export type Competition = z.infer<typeof competitionSchema>;

export const fixtureSummarySchema = z.object({
  id: z.string(),
  competition: competitionSchema,
  kickoffAt: z.string(),
  roundLabel: z.string(),
  venue: z.string(),
  headline: z.string(),
  signalTag: z.string(),
  status: z.enum(["scheduled", "finished"]),
  homeTeam: z.object({
    id: z.string(),
    name: z.string(),
    shortName: z.string(),
  }),
  awayTeam: z.object({
    id: z.string(),
    name: z.string(),
    shortName: z.string(),
  }),
});
export type FixtureSummary = z.infer<typeof fixtureSummarySchema>;

export const recentFormEntrySchema = z.object({
  label: z.string(),
  result: z.enum(["W", "D", "L"]),
  scoreline: z.string(),
});
export type RecentFormEntry = z.infer<typeof recentFormEntrySchema>;

export const headToHeadEntrySchema = z.object({
  date: z.string(),
  competition: z.string(),
  scoreline: z.string(),
  winner: z.string(),
});
export type HeadToHeadEntry = z.infer<typeof headToHeadEntrySchema>;

export const statComparisonSchema = z.object({
  label: z.string(),
  homeValue: z.number(),
  awayValue: z.number(),
  emphasis: z.enum(["higher-better", "lower-better", "neutral"]).default(
    "neutral",
  ),
});
export type StatComparison = z.infer<typeof statComparisonSchema>;

export const injuryNoteSchema = z.object({
  teamSide: z.enum(["home", "away"]),
  player: z.string(),
  status: z.string(),
  impact: z.enum(["low", "medium", "high"]),
});
export type InjuryNote = z.infer<typeof injuryNoteSchema>;

export const fixtureDetailsSchema = fixtureSummarySchema.extend({
  headlineDeck: z.string(),
  stakes: z.string(),
  homeProfile: teamProfileSchema,
  awayProfile: teamProfileSchema,
  homeForm: z.array(recentFormEntrySchema),
  awayForm: z.array(recentFormEntrySchema),
  headToHead: z.array(headToHeadEntrySchema),
  statSnapshot: z.array(statComparisonSchema),
  injuryNotes: z.array(injuryNoteSchema),
  newsSignals: z.array(z.string()),
});
export type FixtureDetails = z.infer<typeof fixtureDetailsSchema>;

export const evidenceBundleSchema = z.object({
  fixtureId: z.string(),
  competition: competitionSlugSchema,
  generatedAt: z.string(),
  homeTeam: teamProfileSchema,
  awayTeam: teamProfileSchema,
  homeFormScore: z.number(),
  awayFormScore: z.number(),
  newsSignals: z.array(z.string()),
  injuriesSummary: z.array(z.string()),
  dataCompleteness: z.number(),
});
export type EvidenceBundle = z.infer<typeof evidenceBundleSchema>;

export const marketPickSchema = z.object({
  key: z.enum(["winner", "btts", "goals", "cards", "corners", "scoreline"]),
  label: z.string(),
  pick: z.string(),
  probability: z.number(),
  risk: z.enum(["low", "medium", "high"]),
  rationale: z.string(),
});
export type MarketPick = z.infer<typeof marketPickSchema>;

export const winnerProbabilitiesSchema = z.object({
  home: z.number(),
  draw: z.number(),
  away: z.number(),
});
export type WinnerProbabilities = z.infer<typeof winnerProbabilitiesSchema>;

export const engineForecastSchema = z.object({
  homeExpectedGoals: z.number(),
  awayExpectedGoals: z.number(),
  totalGoalsMean: z.number(),
  totalCardsMean: z.number(),
  totalCornersMean: z.number(),
  winnerProbabilities: winnerProbabilitiesSchema,
  bothTeamsToScore: z.number(),
  over25Goals: z.number(),
  exactScore: z.string(),
  confidence: z.number(),
  markets: z.array(marketPickSchema),
  reasons: z.array(z.string()),
});
export type EngineForecast = z.infer<typeof engineForecastSchema>;

export const modelForecastSchema = z.object({
  provider: providerSchema,
  providerLabel: z.string(),
  providerName: z.string(),
  style: z.string(),
  confidence: z.number(),
  latencyMs: z.number(),
  winnerProbabilities: winnerProbabilitiesSchema,
  exactScore: z.string(),
  totalGoalsLine: z.string(),
  cardsLine: z.string(),
  cornersLine: z.string(),
  rationale: z.array(z.string()),
  recommendedMarkets: z.array(marketPickSchema),
  executionMode: z.enum(["demo", "live"]),
});
export type ModelForecast = z.infer<typeof modelForecastSchema>;

export const consensusForecastSchema = z.object({
  recommendedProvider: providerSchema,
  confidence: z.number(),
  agreement: z.number(),
  winnerProbabilities: winnerProbabilitiesSchema,
  exactScore: z.string(),
  topMarkets: z.array(marketPickSchema),
  rationale: z.array(z.string()),
});
export type ConsensusForecast = z.infer<typeof consensusForecastSchema>;

export const analysisRunSchema = z.object({
  analysisId: z.string(),
  fixtureId: z.string(),
  generatedAt: z.string(),
  evidence: evidenceBundleSchema,
  engine: engineForecastSchema,
  consensus: consensusForecastSchema,
  providerForecasts: z.array(modelForecastSchema),
});
export type AnalysisRun = z.infer<typeof analysisRunSchema>;

export const providerScoreSchema = z.object({
  provider: providerSchema,
  providerName: z.string(),
  accuracy: z.number(),
  calibration: z.number(),
  trend: z.enum(["up", "steady", "down"]),
  resolvedSamples: z.number(),
  greens: z.number(),
  reds: z.number(),
});
export type ProviderScore = z.infer<typeof providerScoreSchema>;

export const historyEntrySchema = z.object({
  analysisId: z.string(),
  fixtureId: z.string(),
  summary: z.string(),
  topPick: z.string(),
  verdict: z.enum(["green", "red"]),
  actualScore: z.string(),
  settledAt: z.string(),
  provider: providerSchema,
});
export type HistoryEntry = z.infer<typeof historyEntrySchema>;

export const userQuotaSchema = z.object({
  managedCredits: z.number(),
  dailyCap: z.number(),
  usedToday: z.number(),
  byokEnabled: z.boolean(),
});
export type UserQuota = z.infer<typeof userQuotaSchema>;

export const userPreferencesSchema = z.object({
  defaultCompetition: competitionSlugSchema,
  selectedProviders: z.array(providerSchema).min(1),
  notificationsEnabled: z.boolean(),
  analysisMode: z.enum(["managed", "byok", "hybrid"]),
});
export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export const inviteSchema = z.object({
  code: z.string(),
  email: z.string().email(),
  status: z.enum(["pending", "accepted", "revoked"]),
  invitedAt: z.string(),
});
export type Invite = z.infer<typeof inviteSchema>;

export const analysisRequestSchema = z.object({
  fixtureId: z.string().min(1),
  providers: z.array(providerSchema).min(1).max(4),
});
export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;

export const providerSelection = providerSchema.options;

export function sumProbabilities(
  probabilities: WinnerProbabilities,
): WinnerProbabilities {
  const total = probabilities.home + probabilities.draw + probabilities.away;
  if (!total) {
    return { home: 0.34, draw: 0.32, away: 0.34 };
  }

  return {
    home: Number((probabilities.home / total).toFixed(3)),
    draw: Number((probabilities.draw / total).toFixed(3)),
    away: Number((probabilities.away / total).toFixed(3)),
  };
}

