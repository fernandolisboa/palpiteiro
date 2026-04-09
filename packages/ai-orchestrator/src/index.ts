import type {
  AnalysisRun,
  FixtureDetails,
  ModelForecast,
  ProviderKey,
  WinnerProbabilities,
} from "@palpiteiro/domain";
import { providerLabels, providerNames, sumProbabilities } from "@palpiteiro/domain";
import {
  buildEvidenceBundle,
  generateEngineForecast,
} from "@palpiteiro/probability-engine";

type ProviderProfile = {
  style: string;
  confidenceDelta: number;
  homeBias: number;
  drawBias: number;
  goalsBias: number;
  cardsBias: number;
  cornersBias: number;
  latencyMs: number;
};

const providerProfiles: Record<ProviderKey, ProviderProfile> = {
  claude: {
    style: "Leitura contextual com peso maior para forma e elenco.",
    confidenceDelta: 4,
    homeBias: 0.015,
    drawBias: 0.01,
    goalsBias: -0.08,
    cardsBias: 0.12,
    cornersBias: 0.04,
    latencyMs: 980,
  },
  gpt: {
    style: "Equilibrio entre estatistica, estado da rodada e cenarios de valor.",
    confidenceDelta: 1,
    homeBias: 0.004,
    drawBias: 0.005,
    goalsBias: 0.03,
    cardsBias: 0.05,
    cornersBias: 0.03,
    latencyMs: 840,
  },
  gemini: {
    style: "Leitura agressiva para ritmo e mercados de gols/escanteios.",
    confidenceDelta: -1,
    homeBias: 0.008,
    drawBias: -0.012,
    goalsBias: 0.1,
    cardsBias: -0.02,
    cornersBias: 0.09,
    latencyMs: 760,
  },
  grok: {
    style: "Perfil mais volatil, puxa sinais recentes e diverge mais do consenso.",
    confidenceDelta: -6,
    homeBias: -0.012,
    drawBias: 0.02,
    goalsBias: 0.06,
    cardsBias: 0.08,
    cornersBias: -0.04,
    latencyMs: 640,
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function mutateProbabilities(
  probabilities: WinnerProbabilities,
  provider: ProviderKey,
): WinnerProbabilities {
  const profile = providerProfiles[provider];

  return sumProbabilities({
    home: probabilities.home + profile.homeBias,
    draw: probabilities.draw + profile.drawBias,
    away:
      probabilities.away -
      profile.homeBias -
      profile.drawBias,
  });
}

function adaptForecast(details: FixtureDetails, provider: ProviderKey): ModelForecast {
  const profile = providerProfiles[provider];
  const engine = generateEngineForecast(details);
  const winnerProbabilities = mutateProbabilities(
    engine.winnerProbabilities,
    provider,
  );
  const totalGoalsLine =
    engine.over25Goals + profile.goalsBias >= 0.5 ? "Mais de 2.5" : "Menos de 2.5";
  const cardsLine =
    engine.totalCardsMean + profile.cardsBias >= 5.2
      ? "Mais de 4.5"
      : "Entre 4 e 5";
  const cornersLine =
    engine.totalCornersMean + profile.cornersBias >= 9.6
      ? "Mais de 9.5"
      : "Entre 8 e 10";

  return {
    provider,
    providerLabel: providerLabels[provider],
    providerName: providerNames[provider],
    style: profile.style,
    confidence: clamp(engine.confidence + profile.confidenceDelta, 42, 93),
    latencyMs: profile.latencyMs,
    winnerProbabilities,
    exactScore: engine.exactScore,
    totalGoalsLine,
    cardsLine,
    cornersLine,
    rationale: [
      profile.style,
      `Modelo recebeu ${details.newsSignals.length} sinais narrativos e ${details.statSnapshot.length} sinais estruturados.`,
      `Vies atual deste provedor: ${
        profile.goalsBias > 0 ? "pro-jogo aberto" : "pro-jogo controlado"
      }.`,
    ],
    recommendedMarkets: engine.markets,
    executionMode: "demo",
  };
}

function aggregateConsensus(forecasts: ModelForecast[], details: FixtureDetails) {
  const engine = generateEngineForecast(details);
  const avg = forecasts.reduce(
    (accumulator, forecast) => ({
      home: accumulator.home + forecast.winnerProbabilities.home,
      draw: accumulator.draw + forecast.winnerProbabilities.draw,
      away: accumulator.away + forecast.winnerProbabilities.away,
      confidence: accumulator.confidence + forecast.confidence,
    }),
    { home: 0, draw: 0, away: 0, confidence: 0 },
  );
  const count = forecasts.length || 1;
  const averagedProbabilities = sumProbabilities({
    home: avg.home / count + engine.winnerProbabilities.home * 0.35,
    draw: avg.draw / count + engine.winnerProbabilities.draw * 0.35,
    away: avg.away / count + engine.winnerProbabilities.away * 0.35,
  });
  const confidence = clamp(
    Math.round(avg.confidence / count * 0.7 + engine.confidence * 0.3),
    40,
    92,
  );
  const agreement = clamp(
    Math.round(
      100 -
        forecasts.reduce(
          (spread, forecast) =>
            spread +
            Math.abs(forecast.winnerProbabilities.home - averagedProbabilities.home) *
              100,
          0,
        ) /
          count,
    ),
    55,
    96,
  );

  const recommendedProvider = forecasts
    .slice()
    .sort(
      (left, right) =>
        right.confidence -
        Math.abs(right.winnerProbabilities.home - averagedProbabilities.home) * 100 -
        (left.confidence -
          Math.abs(left.winnerProbabilities.home - averagedProbabilities.home) * 100),
    )[0]?.provider ?? "claude";

  return {
    recommendedProvider,
    confidence,
    agreement,
    winnerProbabilities: averagedProbabilities,
    exactScore: engine.exactScore,
    topMarkets: engine.markets.slice(0, 4),
    rationale: [
      `Consenso calculado com o motor deterministico como ancora primaria.`,
      `${agreement}% de alinhamento medio entre os provedores selecionados.`,
      `Mercados auxiliares seguem a derivacao base de gols, cartoes e escanteios.`,
    ],
  };
}

export function createAnalysisRun(
  details: FixtureDetails,
  providers: ProviderKey[],
): AnalysisRun {
  const evidence = buildEvidenceBundle(details);
  const engine = generateEngineForecast(details);
  const providerForecasts = providers.map((provider) =>
    adaptForecast(details, provider),
  );

  return {
    analysisId: `${details.id}~${providers.join(",")}`,
    fixtureId: details.id,
    generatedAt: new Date().toISOString(),
    evidence,
    engine,
    consensus: aggregateConsensus(providerForecasts, details),
    providerForecasts,
  };
}
