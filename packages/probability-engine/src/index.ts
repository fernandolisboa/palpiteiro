import type {
  EngineForecast,
  EvidenceBundle,
  FixtureDetails,
  MarketPick,
  WinnerProbabilities,
} from "@palpiteiro/domain";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, precision = 2): number {
  return Number(value.toFixed(precision));
}

function poisson(lambda: number, k: number): number {
  const numerator = Math.exp(-lambda) * lambda ** k;
  let denominator = 1;

  for (let i = 2; i <= k; i += 1) {
    denominator *= i;
  }

  return numerator / denominator;
}

function buildMatrix(homeXg: number, awayXg: number, maxGoals = 6): number[][] {
  return Array.from({ length: maxGoals + 1 }, (_, homeGoals) =>
    Array.from({ length: maxGoals + 1 }, (_, awayGoals) =>
      poisson(homeXg, homeGoals) * poisson(awayXg, awayGoals),
    ),
  );
}

function deriveWinnerProbabilities(matrix: number[][]): WinnerProbabilities {
  let home = 0;
  let draw = 0;
  let away = 0;

  matrix.forEach((row, homeGoals) => {
    row.forEach((value, awayGoals) => {
      if (homeGoals > awayGoals) {
        home += value;
      } else if (homeGoals === awayGoals) {
        draw += value;
      } else {
        away += value;
      }
    });
  });

  const total = home + draw + away;

  return {
    home: round(home / total, 3),
    draw: round(draw / total, 3),
    away: round(away / total, 3),
  };
}

function deriveExactScore(matrix: number[][]): string {
  let bestScore = "1-1";
  let bestValue = 0;

  matrix.forEach((row, homeGoals) => {
    row.forEach((value, awayGoals) => {
      if (value > bestValue) {
        bestValue = value;
        bestScore = `${homeGoals}-${awayGoals}`;
      }
    });
  });

  return bestScore;
}

function probabilityOver(matrix: number[][], line: number): number {
  let probability = 0;

  matrix.forEach((row, homeGoals) => {
    row.forEach((value, awayGoals) => {
      if (homeGoals + awayGoals > line) {
        probability += value;
      }
    });
  });

  return round(probability, 3);
}

function probabilityBtts(matrix: number[][]): number {
  let probability = 0;

  matrix.forEach((row, homeGoals) => {
    row.forEach((value, awayGoals) => {
      if (homeGoals > 0 && awayGoals > 0) {
        probability += value;
      }
    });
  });

  return round(probability, 3);
}

export function buildEvidenceBundle(details: FixtureDetails): EvidenceBundle {
  const homePoints = details.homeForm.reduce((score, entry) => {
    if (entry.result === "W") {
      return score + 3;
    }
    if (entry.result === "D") {
      return score + 1;
    }
    return score;
  }, 0);

  const awayPoints = details.awayForm.reduce((score, entry) => {
    if (entry.result === "W") {
      return score + 3;
    }
    if (entry.result === "D") {
      return score + 1;
    }
    return score;
  }, 0);

  const injuryPenalty =
    details.injuryNotes.filter((note) => note.impact === "high").length > 0
      ? 0.06
      : 0.02;
  const completeness = clamp(0.92 - injuryPenalty, 0.72, 0.96);

  return {
    fixtureId: details.id,
    competition: details.competition.slug,
    generatedAt: new Date().toISOString(),
    homeTeam: details.homeProfile,
    awayTeam: details.awayProfile,
    homeFormScore: homePoints / 15,
    awayFormScore: awayPoints / 15,
    newsSignals: details.newsSignals,
    injuriesSummary: details.injuryNotes.map(
      (note) => `${note.player}: ${note.status}`,
    ),
    dataCompleteness: round(completeness, 2),
  };
}

function buildMarketPicks(
  winnerProbabilities: WinnerProbabilities,
  exactScore: string,
  over25Goals: number,
  btts: number,
  cardsMean: number,
  cornersMean: number,
): MarketPick[] {
  const picks: MarketPick[] = [];
  const strongestSide = Object.entries(winnerProbabilities).sort(
    (left, right) => right[1] - left[1],
  )[0];

  if (strongestSide) {
    const [side, probability] = strongestSide;
    const label =
      side === "home" ? "Mandante vence" : side === "away" ? "Visitante vence" : "Empate";
    const pick =
      side === "home" ? "Mandante" : side === "away" ? "Visitante" : "Empate";

    picks.push({
      key: "winner",
      label,
      pick,
      probability,
      risk: probability >= 0.5 ? "low" : "medium",
      rationale: "Mercado principal alinhado ao maior bloco de probabilidade.",
    });
  }

  picks.push({
    key: "goals",
    label: "Gols (+/- 2.5)",
    pick: over25Goals >= 0.5 ? "Mais de 2.5" : "Menos de 2.5",
    probability: over25Goals >= 0.5 ? over25Goals : round(1 - over25Goals, 3),
    risk: over25Goals >= 0.6 || over25Goals <= 0.4 ? "low" : "medium",
    rationale: "Derivado da distribuicao de gols esperados do confronto.",
  });

  picks.push({
    key: "btts",
    label: "Ambas marcam",
    pick: btts >= 0.5 ? "Sim" : "Nao",
    probability: btts >= 0.5 ? btts : round(1 - btts, 3),
    risk: "medium",
    rationale: "Sinal cruzado entre xG, forma recente e taxa historica de BTTS.",
  });

  picks.push({
    key: "cards",
    label: "Cartoes",
    pick: cardsMean >= 5.4 ? "Mais de 4.5" : "Entre 4 e 5",
    probability: clamp(round(0.54 + (cardsMean - 5) * 0.08, 3), 0.45, 0.82),
    risk: "medium",
    rationale: "Media disciplinar combinada dos dois lados.",
  });

  picks.push({
    key: "corners",
    label: "Escanteios",
    pick: cornersMean >= 9.6 ? "Mais de 9.5" : "Entre 8 e 10",
    probability: clamp(round(0.53 + (cornersMean - 9) * 0.06, 3), 0.44, 0.8),
    risk: cornersMean >= 10 ? "low" : "medium",
    rationale: "Volume territorial e perfis de cruzamento ponderados pelo mando.",
  });

  picks.push({
    key: "scoreline",
    label: "Placar exato",
    pick: exactScore,
    probability: 0.18,
    risk: "high",
    rationale: "Melhor scoreline pontual da matriz de Poisson.",
  });

  return picks;
}

export function generateEngineForecast(details: FixtureDetails): EngineForecast {
  const evidence = buildEvidenceBundle(details);
  const home = evidence.homeTeam;
  const away = evidence.awayTeam;

  const homeExpectedGoals = clamp(
    1.35 +
      (home.attackIndex - away.defenseIndex) * 0.018 +
      (home.formIndex - away.formIndex) * 0.01 +
      0.17 -
      home.injuriesImpact * 1.4,
    0.55,
    3.2,
  );
  const awayExpectedGoals = clamp(
    1.1 +
      (away.attackIndex - home.defenseIndex) * 0.017 +
      (away.formIndex - home.formIndex) * 0.008 -
      away.injuriesImpact * 1.35,
    0.45,
    2.9,
  );

  const matrix = buildMatrix(homeExpectedGoals, awayExpectedGoals);
  const winnerProbabilities = deriveWinnerProbabilities(matrix);
  const exactScore = deriveExactScore(matrix);
  const over25Goals = probabilityOver(matrix, 2.5);
  const bothTeamsToScore = probabilityBtts(matrix);
  const totalGoalsMean = round(homeExpectedGoals + awayExpectedGoals, 2);
  const totalCardsMean = round(
    (home.cardsForPerMatch +
      away.cardsForPerMatch +
      home.cardsAgainstPerMatch +
      away.cardsAgainstPerMatch) /
      2,
    2,
  );
  const totalCornersMean = round(
    (home.cornersForPerMatch +
      away.cornersForPerMatch +
      home.cornersAgainstPerMatch +
      away.cornersAgainstPerMatch) /
      2,
    2,
  );

  const edge = Math.max(
    winnerProbabilities.home,
    winnerProbabilities.draw,
    winnerProbabilities.away,
  );
  const confidence = clamp(
    round(
      58 +
        (edge - 0.34) * 120 +
        evidence.dataCompleteness * 18 -
        Math.abs(homeExpectedGoals - awayExpectedGoals) * 4,
      0,
    ),
    48,
    91,
  );

  return {
    homeExpectedGoals: round(homeExpectedGoals),
    awayExpectedGoals: round(awayExpectedGoals),
    totalGoalsMean,
    totalCardsMean,
    totalCornersMean,
    winnerProbabilities,
    bothTeamsToScore,
    over25Goals,
    exactScore,
    confidence,
    markets: buildMarketPicks(
      winnerProbabilities,
      exactScore,
      over25Goals,
      bothTeamsToScore,
      totalCardsMean,
      totalCornersMean,
    ),
    reasons: [
      `${details.homeTeam.name} chega com forma recente de ${Math.round(evidence.homeFormScore * 100)}%.`,
      `${details.awayTeam.name} sustenta rating defensivo de ${details.awayProfile.defenseIndex}.`,
      `O pacote de dados esta ${Math.round(evidence.dataCompleteness * 100)}% completo para esta partida.`,
    ],
  };
}

