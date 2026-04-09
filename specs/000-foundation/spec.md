# Feature Specification: Foundation Bootstrap

**Feature Branch**: `000-foundation`  
**Created**: 2026-04-09  
**Status**: Draft  
**Input**: User description: "Bootstrap the Palpiteiro repository with Spec Kit,
monorepo structure, coding standards, compliance guardrails, and enough product
shell to support fast incremental delivery."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Foundation Setup (Priority: P1)

As an engineer starting the project, I need a repository that already encodes
the product rules, architecture baseline, and local workflows so that
implementation can start without re-deciding core standards.

**Why this priority**: Without a credible foundation, every later slice risks
rework in architecture, compliance posture, and code organization.

**Independent Test**: Clone the repository, inspect the root docs/specs, and
run the documented local bootstrap successfully.

**Acceptance Scenarios**:

1. **Given** a new clone, **When** an engineer opens the repository, **Then**
   the repository exposes an explicit constitution, root scripts, and folder
   structure for the intended product.
2. **Given** the foundation slice, **When** CI runs, **Then** lint, typecheck,
   tests, and build are defined and executable from the repository root.

---

### User Story 2 - Shared Contracts (Priority: P2)

As an engineer building later slices, I need shared domain contracts and package
boundaries so that UI, APIs, and engines can evolve without copy-pasting types.

**Why this priority**: The MVP depends on the same analysis contracts in
frontend, backend, persistence, and provider orchestration.

**Independent Test**: Import shared types into a route handler and a UI module
without redefining entities.

**Acceptance Scenarios**:

1. **Given** a new feature, **When** it needs fixture or analysis data, **Then**
   it can import shared contracts from a dedicated package.

---

### User Story 3 - Product Shell Readiness (Priority: P3)

As a product builder, I need the repository to include a credible shell for the
main app experience so that future slices can be added without redesigning the
navigation model.

**Why this priority**: The project aims for a fast MVP, so the shell should be
in place early.

**Independent Test**: Start the app and verify the major navigation surfaces
exist, even when backed by mock data.

**Acceptance Scenarios**:

1. **Given** the running app, **When** a user lands on the product, **Then**
   the main surfaces for matches, analysis, ranking, history, and profile are
   visible and coherent.

### Edge Cases

- How does the repo behave when no external secrets are configured?
- How do engineers distinguish real integrations from demo-mode adapters?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST initialize as a Spec Kit project with a concrete
  constitution for Palpiteiro.
- **FR-002**: The repository MUST expose a monorepo structure with one web app
  and shared packages for domain, data sources, probability, AI orchestration,
  and database concerns.
- **FR-003**: The root MUST provide standard scripts for development, build,
  linting, typechecking, and tests.
- **FR-004**: The repository MUST include architecture and setup documentation.
- **FR-005**: The system MUST support running in demo mode without external
  provider credentials.
- **FR-006**: The repository MUST include automated validation in CI.

### Key Entities *(include if feature involves data)*

- **Repository Slice**: A vertical implementation unit with its own Spec Kit
  artifacts and code changes.
- **Shared Contract**: A reusable type or schema consumed by multiple packages.
- **Demo Mode**: A local execution mode that uses mocks instead of paid
  services.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new contributor can bootstrap the repository locally in under
  15 minutes using the documented steps.
- **SC-002**: The repository can run lint, typecheck, tests, and build from the
  root without manual path juggling.
- **SC-003**: At least five first-class product contexts are recognizable in the
  initial app shell.

## Assumptions

- Node 24 is the local runtime baseline.
- The first shipped client is a mobile-first web app, not a native mobile app.
- Demo data is acceptable until Supabase and API-Football secrets are provided.

