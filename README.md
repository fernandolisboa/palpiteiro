# Palpiteiro

Palpiteiro e um produto web mobile-first para gerar recomendacoes de apostas em
futebol brasileiro sem operar apostas diretamente. O foco do MVP e combinar um
motor probabilistico deterministico com analises complementares de multiplos
modelos de IA.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS v4
- Supabase Auth + Postgres + RLS
- Vercel para deploy e cron jobs
- GitHub Spec Kit para processo spec-driven

## Monorepo

```text
apps/
  web/                      # produto web principal
packages/
  ai-orchestrator/          # contrato dos provedores e consenso
  data-sources/             # mocks e adaptadores externos
  db/                       # schema, migracoes e tipos de persistencia
  domain/                   # entidades e contratos compartilhados
  probability-engine/       # motor probabilistico deterministico
specs/                      # artefatos do Spec Kit
docs/                       # arquitetura e decisoes
```

## Getting Started

1. Ative o Node instalado via `nvm`.
2. Execute `npm install` na raiz.
3. Rode `npm run dev`.
4. Abra `http://localhost:3000`.

Sem credenciais externas o app funciona em modo demo, usando fixtures e
analises mockadas. Quando as variaveis de ambiente forem preenchidas, a base ja
esta preparada para evoluir para Supabase, API-Football e provedores reais de
IA.

## Processo

O repositorio usa Spec Kit desde o bootstrap:

- `specs/000-foundation`: padroes, arquitetura e baseline tecnico
- `specs/001-fixtures-and-shell`: navegacao principal, shell visual e fluxo de
  analise inicial

Novos slices devem seguir `spec.md -> plan.md -> tasks.md -> implementacao`.
