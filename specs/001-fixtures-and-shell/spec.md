# Feature Specification: Fixtures And Shell

**Feature Branch**: `001-fixtures-and-shell`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "Build the mobile-first product shell with fixtures,
match detail, initial analysis flow, ranking, history, and profile surfaces."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Match Opportunities (Priority: P1)

As a user looking for betting ideas, I want to browse upcoming Brazilian
football matches and quickly see which ones deserve attention.

**Why this priority**: The home experience is the front door of the product and
the start of every downstream analysis.

**Independent Test**: Open the homepage and navigate upcoming fixtures by
competition without touching any other screen.

**Acceptance Scenarios**:

1. **Given** the user opens the app, **When** fixtures are available, **Then**
   the user sees upcoming matches grouped and labeled clearly.
2. **Given** multiple competitions exist, **When** the user changes the active
   competition, **Then** the visible fixture list updates accordingly.

---

### User Story 2 - Inspect A Match (Priority: P2)

As a user evaluating a single match, I want a dedicated details page with
signals, context, and historical evidence before generating a recommendation.

**Why this priority**: The match detail page is where trust is built before the
actual forecast is consumed.

**Independent Test**: Open a match from the homepage and review match context,
signals, and stat summaries without generating an analysis.

**Acceptance Scenarios**:

1. **Given** a match exists, **When** the user opens its detail page, **Then**
   the page exposes head-to-head, recent form, stat ranges, and news-style
   signals.

---

### User Story 3 - Generate Multi-Model Analysis (Priority: P3)

As a user comparing forecasting styles, I want to trigger a multi-model analysis
and see consensus plus per-provider viewpoints.

**Why this priority**: The differentiator of Palpiteiro is combining a
deterministic engine with multiple AI perspectives.

**Independent Test**: Select providers, generate an analysis, and inspect
consensus plus provider cards without leaving the analysis flow.

**Acceptance Scenarios**:

1. **Given** the user is on the analysis page, **When** they request an
   analysis, **Then** the system returns a consensus and per-provider forecast
   cards.
2. **Given** the user prefers a subset of providers, **When** they toggle
   provider selection, **Then** the next analysis run respects that selection.

### Edge Cases

- What happens when a fixture cannot be found?
- What happens when no provider is selected?
- How is demo mode distinguished from real provider-backed execution?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display upcoming fixtures by competition.
- **FR-002**: The system MUST provide a dedicated detail page for each fixture.
- **FR-003**: The system MUST expose a dedicated analysis workspace with
  selectable providers.
- **FR-004**: The system MUST return a consensus forecast and per-provider
  forecasts for a requested analysis.
- **FR-005**: The system MUST provide ranking, history, and profile surfaces
  aligned with the product narrative.
- **FR-006**: The system MUST remain usable in demo mode with mock data.
- **FR-007**: The system MUST avoid bet placement, operator calls-to-action, or
  bookmaker odds within the shell.

### Key Entities *(include if feature involves data)*

- **FixtureSummary**: lightweight representation of an upcoming match for lists
- **FixtureDetails**: richer match context for a single match
- **AnalysisRequest**: selected fixture and providers for a run
- **AnalysisRun**: consensus, provider forecasts, evidence, and metadata
- **ProviderScore**: ranking snapshot for one analysis provider
- **UserPreferences**: default competition, provider set, and notification
  intent

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can reach a match detail page from the homepage in two taps
  or fewer.
- **SC-002**: A user can trigger a demo analysis and see results in under
  2 seconds on local development hardware.
- **SC-003**: All primary surfaces remain legible and navigable on 390px-wide
  mobile screens.

## Assumptions

- The initial shell can rely on normalized mock fixtures and mock provider
  output.
- Rankings and history can be seeded until persisted outcomes are enabled.
- Notifications remain a placeholder surface in this slice.

