# Implementation Plan: Fixtures And Shell

**Branch**: `001-fixtures-and-shell` | **Date**: 2026-04-09 | **Spec**:
[spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-fixtures-and-shell/spec.md`

## Summary

Implement the mobile-first shell for fixtures, match details, analysis,
rankings, history, and profile using shared contracts plus demo-mode APIs.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16  
**Primary Dependencies**: Next.js App Router, Tailwind CSS 4, Lucide icons,
shared workspace packages  
**Storage**: In-memory demo mode with Supabase-ready types  
**Testing**: Vitest for domain logic, root typecheck, Next build and lint  
**Target Platform**: Web, mobile-first  
**Project Type**: Monorepo web application  
**Performance Goals**: Analysis response under 2 seconds in demo mode, crisp
mobile rendering  
**Constraints**: No odds or operator behavior, provider selection must stay
server-mediated, shell must remain polished on mobile  
**Scale/Scope**: Core navigation plus demo APIs and shared domain packages

## Constitution Check

- Pass: no client-side secret handling introduced
- Pass: deterministic forecast remains primary even with multi-provider UI
- Pass: shared contracts drive pages and APIs
- Pass: the slice is independently testable from local demo mode

## Project Structure

### Documentation (this feature)

```text
specs/001-fixtures-and-shell/
|- spec.md
|- plan.md
|- research.md
|- data-model.md
|- quickstart.md
|- checklists/
|  `- requirements.md
|- contracts/
|  |- analyses-api.md
|  `- fixtures-api.md
`- tasks.md
```

### Source Code (repository root)

```text
apps/web/src/app/
apps/web/src/components/
apps/web/src/lib/
packages/domain/src/
packages/data-sources/src/
packages/probability-engine/src/
packages/ai-orchestrator/src/
packages/db/
```

**Structure Decision**: Keep rendering and route handlers in the Next app while
moving product contracts and core logic into shared packages.
