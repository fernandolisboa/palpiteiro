import type { CompetitionSlug, FixtureDetails, FixtureSummary } from "@palpiteiro/domain";

const API_FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";

export class ApiFootballSportsDataSource {
  constructor(private readonly apiKey: string) {}

  async listFixtures(_competition?: CompetitionSlug): Promise<FixtureSummary[]> {
    if (!this.apiKey) {
      throw new Error("API_FOOTBALL_KEY is required to use the real data source.");
    }

    throw new Error(
      `API-Football adapter not wired yet. Base URL reserved at ${API_FOOTBALL_BASE_URL}.`,
    );
  }

  async getFixtureDetails(_fixtureId: string): Promise<FixtureDetails | null> {
    if (!this.apiKey) {
      throw new Error("API_FOOTBALL_KEY is required to use the real data source.");
    }

    throw new Error(
      `API-Football fixture details adapter not wired yet. Base URL reserved at ${API_FOOTBALL_BASE_URL}.`,
    );
  }
}

