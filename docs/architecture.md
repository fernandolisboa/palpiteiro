# Arquitetura

## Objetivo

Entregar um produto sustentavel para recomendacoes de apostas, com um backend
server-side responsavel por segredo, quotas, normalizacao de dados e geracao de
analises. O cliente consome contratos fortemente tipados e mantem uma UX
mobile-first.

## Bounded Contexts

### `@palpiteiro/domain`

Contem as entidades centrais do produto: fixtures, analises, quotas, ranking,
preferencias e sinais do motor probabilistico. Esse pacote e a linguagem comum
entre frontend, APIs e integracoes.

### `@palpiteiro/data-sources`

Define o contrato `SportsDataSource` e oferece:

- `MockSportsDataSource` para desenvolvimento sem chaves
- `ApiFootballSportsDataSource` como base do provider real do MVP

Todo dado externo e normalizado antes de chegar ao resto do sistema.

### `@palpiteiro/probability-engine`

Implementa o motor deterministico. O fluxo base do MVP e:

1. normalizar sinais do jogo
2. calcular expectativa de gols com ajuste de forca relativa
3. derivar mercados primarios (`1X2`, `BTTS`, `over/under`)
4. estimar mercados auxiliares (`cards`, `corners`)
5. gerar um `EngineForecast` com confianca e evidencias

### `@palpiteiro/ai-orchestrator`

Recebe um `EvidenceBundle` e um `EngineForecast`, aplica perfis por provedor e
retorna:

- forecasts por modelo
- consenso
- divergencias
- ranking local por confianca e alinhamento

No bootstrap a implementacao e mockada, mas o contrato ja e server-side e
schema-first.

### `@palpiteiro/db`

Agrupa os schemas e migracoes do Supabase:

- onboarding por convite
- fixtures e snapshots
- historico de analises
- quotas do app
- chaves pessoais criptografadas
- ranking de provedores

## Fluxo de Dados

1. A homepage lista fixtures vindos do `SportsDataSource`.
2. O detalhe da partida monta um `EvidenceBundle`.
3. O motor probabilistico gera o forecast-base.
4. O orquestrador expande esse forecast em previsoes por provedor.
5. As APIs retornam contratos serializaveis para o cliente.
6. Quando houver persistencia ativa, resultados resolvidos retroalimentam
   historico e ranking.

## Guardrails de Produto

- Sem odds de casas, links de afiliado ou fluxo de apostas no MVP.
- Segredos e quotas sempre no servidor.
- UI mobile-first e pronta para desktop responsivo.
- O forecast deterministico e a fonte primaria; a IA complementa, nao substitui.

