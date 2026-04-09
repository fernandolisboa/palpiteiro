import { describe, expect, it } from "vitest";

import { getMockFixtureDetails } from "@palpiteiro/data-sources";
import { buildEvidenceBundle, generateEngineForecast } from "../src/index";

describe("probability engine", () => {
  it("creates an evidence bundle with usable completeness", () => {
    const fixture = getMockFixtureDetails("fix-fla-pal");
    expect(fixture).not.toBeNull();

    const evidence = buildEvidenceBundle(fixture!);

    expect(evidence.fixtureId).toBe("fix-fla-pal");
    expect(evidence.dataCompleteness).toBeGreaterThan(0.7);
    expect(evidence.homeFormScore).toBeGreaterThan(0);
  });

  it("generates normalized 1X2 probabilities", () => {
    const fixture = getMockFixtureDetails("fix-fla-pal");
    expect(fixture).not.toBeNull();

    const forecast = generateEngineForecast(fixture!);
    const total =
      forecast.winnerProbabilities.home +
      forecast.winnerProbabilities.draw +
      forecast.winnerProbabilities.away;

    expect(total).toBeGreaterThan(0.99);
    expect(total).toBeLessThan(1.01);
    expect(forecast.markets.length).toBeGreaterThanOrEqual(5);
  });
});
