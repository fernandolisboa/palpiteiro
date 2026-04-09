# Analyses API Contract

## `POST /api/analyses`

Creates or regenerates an `AnalysisRun`.

### Request

- `fixtureId`
- `providers[]`

### Response

- `analysisId`
- `fixtureId`
- `consensus`
- `providerForecasts[]`
- `evidence`
- `generatedAt`

## `GET /api/analyses/:analysisId`

Returns the previously generated analysis representation for the given
identifier. In demo mode the response may be deterministically regenerated.

