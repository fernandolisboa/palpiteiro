# Data Model

## Entities

### FixtureSummary

- `id`
- `competition`
- `kickoffAt`
- `venue`
- `homeTeam`
- `awayTeam`
- `status`
- `signalTag`

### FixtureDetails

- `fixture`
- `headline`
- `homeForm`
- `awayForm`
- `headToHead`
- `statSnapshot`
- `injuryNotes`
- `newsSignals`

### AnalysisRun

- `analysisId`
- `fixtureId`
- `providers`
- `consensus`
- `providerForecasts`
- `evidence`
- `generatedAt`

### ProviderScore

- `provider`
- `accuracy`
- `calibration`
- `trend`
- `resolvedSamples`

