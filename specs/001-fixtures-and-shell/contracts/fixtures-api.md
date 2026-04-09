# Fixtures API Contract

## `GET /api/fixtures`

Returns an array of `FixtureSummary` objects.

### Query Parameters

- `competition` optional competition slug

## `GET /api/fixtures/:fixtureId`

Returns a `FixtureDetails` object for a single fixture.

### Error Cases

- `404` when the fixture id is unknown

