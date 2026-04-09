import type {
  CompetitionSlug,
  FixtureDetails,
  FixtureSummary,
  HistoryEntry,
  ProviderScore,
  UserPreferences,
  UserQuota,
} from "@palpiteiro/domain";
import { ApiFootballSportsDataSource } from "./api-football";
import {
  demoPreferences,
  demoQuota,
  getMockFixtureDetails,
  listMockFixtures,
  mockHistory,
  mockProviderScores,
} from "./mock";

export interface SportsDataSource {
  listFixtures(competition?: CompetitionSlug): Promise<FixtureSummary[]>;
  getFixtureDetails(fixtureId: string): Promise<FixtureDetails | null>;
  listProviderScores(): Promise<ProviderScore[]>;
  listHistory(): Promise<HistoryEntry[]>;
  getPreferences(): Promise<UserPreferences>;
  getQuota(): Promise<UserQuota>;
}

export class MockSportsDataSource implements SportsDataSource {
  async listFixtures(competition?: CompetitionSlug): Promise<FixtureSummary[]> {
    return listMockFixtures(competition);
  }

  async getFixtureDetails(fixtureId: string): Promise<FixtureDetails | null> {
    return getMockFixtureDetails(fixtureId);
  }

  async listProviderScores(): Promise<ProviderScore[]> {
    return mockProviderScores;
  }

  async listHistory(): Promise<HistoryEntry[]> {
    return mockHistory;
  }

  async getPreferences(): Promise<UserPreferences> {
    return demoPreferences;
  }

  async getQuota(): Promise<UserQuota> {
    return demoQuota;
  }
}

export function createSportsDataSource(): SportsDataSource {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (apiKey) {
    return new ApiFootballSportsDataSource(apiKey) as unknown as SportsDataSource;
  }

  return new MockSportsDataSource();
}

export { demoPreferences, demoQuota, getMockFixtureDetails, listMockFixtures, mockHistory, mockProviderScores } from "./mock";
