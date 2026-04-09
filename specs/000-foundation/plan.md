# Implementation Plan: Foundation Bootstrap

**Branch**: `000-foundation` | **Date**: 2026-04-09 | **Spec**:
[spec.md](./spec.md)  
**Input**: Feature specification from `/specs/000-foundation/spec.md`

## Summary

Bootstrap Palpiteiro as a Spec Kit monorepo with a production-minded web shell,
shared contracts, demo-mode support, and CI automation.

## Technical Context

**Language/Version**: TypeScript 5, Node 24  
**Primary Dependencies**: Next.js 16, React 19, Tailwind CSS 4, Vitest  
**Storage**: Supabase Postgres schema plus demo-mode in-memory data  
**Testing**: Vitest for domain logic, workspace typecheck, Next lint/build  
**Target Platform**: Vercel-hosted web application  
**Project Type**: Monorepo web product  
**Performance Goals**: Fast local startup, mobile-first rendering, zero external
dependency requirement for demo mode  
**Constraints**: Server-only secrets, no operator behavior, schema validation at
boundaries  
**Scale/Scope**: Single public-facing web app plus shared packages

## Constitution Check

- Pass: server-only secret handling remains mandatory
- Pass: deterministic engine remains the primary source of probability outputs
- Pass: shared contracts are introduced before cross-cutting feature work
- Pass: the slice is independently demonstrable and testable

## Project Structure

### Documentation (this feature)

```text
specs/000-foundation/
|- spec.md
|- plan.md
|- research.md
|- data-model.md
|- quickstart.md
|- checklists/
|  `- requirements.md
`- tasks.md
```

### Source Code (repository root)

```text
apps/
  web/
packages/
  ai-orchestrator/
  data-sources/
  db/
  domain/
  probability-engine/
docs/
.github/workflows/
```

**Structure Decision**: Use one Next.js app with shared packages to keep the
MVP cohesive while preserving growth paths for additional clients or services.
