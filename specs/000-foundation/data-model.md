# Data Model Notes

This slice defines repository-level entities rather than product persistence.

## Structural Entities

- **Workspace App**: independently runnable application in `apps/`
- **Shared Package**: reusable domain or infrastructure module in `packages/`
- **Spec Slice**: feature directory under `specs/`

## Contract Baseline

The first shared contracts will cover:

- fixture summary and detail shapes
- analysis request and response shapes
- provider score and quota models

