<!--
Sync Impact Report
- Version change: 0.0.0 -> 1.0.0
- Modified principles: template placeholders replaced with project-specific principles
- Added sections: Product Guardrails, Delivery Workflow
- Removed sections: none
- Templates requiring updates:
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: none
-->
# Palpiteiro Constitution

## Core Principles

### I. Security And Compliance First

Every integration secret, quota decision, and provider credential MUST stay on
the server. Client code MUST treat all external provider access as untrusted.
The product MUST behave as a recommendation platform only: no bet placement, no
wallet, no operator flow, no bookmaker links, and no odds comparison in the
MVP.

### II. Deterministic Forecast Core

The probability engine MUST remain the source of truth for structured forecast
outputs. Large language models MAY explain, compare, or diversify predictions,
but they MUST consume normalized evidence and MUST return schema-validated
responses. No feature may depend on free-form model prose for business logic.

### III. Typed Contracts Everywhere

Cross-package contracts for fixtures, analyses, evidence, quotas, and rankings
MUST live in shared types. Route handlers and provider adapters MUST validate
inputs and outputs with explicit schemas before data crosses a boundary.
Breaking contract changes require spec updates and coordinated implementation.

### IV. Mobile-First Product Quality

Every shipped slice MUST be usable on common mobile widths before desktop polish
is considered complete. UX MUST favor intentional hierarchy, restrained chrome,
and clear operational copy over generic dashboard card grids. Visual changes
must preserve a premium, legible experience across dark surfaces and low-light
contexts.

### V. Vertical Slices With Tests

Work MUST progress in independently demonstrable slices. Domain logic MUST ship
with automated tests before or alongside implementation. Every slice MUST leave
the repository in a releasable state: linting, typechecking, tests, and build
must pass before merge to `main`.

## Product Guardrails

- Required stack baseline: Next.js, TypeScript, Tailwind, Supabase, Vercel
- Auth and persistence MUST assume invite-only beta first
- Row Level Security MUST be the default posture for persisted user data
- BYOK support MUST use encrypted-at-rest storage and explicit user control
- Feature flags or demo mode MAY exist, but they MUST not weaken secret
  handling, schema validation, or API boundaries

## Delivery Workflow

- The repository uses Spec Kit for new slices
- Each feature MUST have `spec.md`, `plan.md`, and `tasks.md` before major
  implementation begins
- Research notes, contracts, and quickstart docs SHOULD be written when they
  materially reduce ambiguity
- Commits MUST align to working slices rather than random file groups

## Governance

This constitution overrides informal local habits. Amendments require:

1. documenting the change in the relevant spec or architecture note
2. updating this constitution with a semver version bump
3. verifying impacted templates or workflows still align with the new rule

Compliance with this constitution MUST be reviewed during implementation,
testing, and merge.

**Version**: 1.0.0 | **Ratified**: 2026-04-09 | **Last Amended**: 2026-04-09

