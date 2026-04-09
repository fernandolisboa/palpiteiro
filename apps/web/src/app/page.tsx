import Link from "next/link";
import { ArrowRight, BrainCircuit, ChevronRight, Goal, Sparkles, Trophy } from "lucide-react";

import { CompetitionTabs } from "@/components/competition-tabs";
import { SectionHeading } from "@/components/section-heading";
import { formatKickoffParts, formatPercentInt } from "@/lib/format";
import { getPreferences, getRanking, isDemoMode, listFixtures, normalizeCompetition } from "@/lib/data";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const preferences = await getPreferences();
  const activeCompetition = normalizeCompetition(
    resolvedSearchParams.competition,
    preferences.defaultCompetition,
  );
  const [fixtures, ranking] = await Promise.all([
    listFixtures(activeCompetition),
    getRanking(),
  ]);
  const featuredFixture = fixtures[0];

  return (
    <div className="space-y-6">
      <header className="panel motion-enter overflow-hidden p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(131,255,85,0.22)] bg-[rgba(131,255,85,0.14)]">
              <Goal className="h-6 w-6 text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="font-display text-[2.2rem] font-bold tracking-[-0.05em]">
                Palpiteiro
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
                Leitura probabilistica de futebol brasileiro com motor proprio e
                comparacao entre multiplas IAs.
              </p>
            </div>
          </div>
          <div className="space-y-2 text-right">
            <span className="chip chip-active text-xs">
              {isDemoMode() ? "Demo mode" : "Live mode"}
            </span>
            <p className="text-sm text-muted">
              Beta por convite, sem odds nem operador.
            </p>
          </div>
        </div>

        {featuredFixture ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="panel-soft p-5">
              <p className="eyebrow">Jogo em destaque</p>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold tracking-[-0.04em]">
                    {featuredFixture.homeTeam.name}
                  </p>
                  <p className="text-sm text-muted">vs {featuredFixture.awayTeam.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-muted">
                    {formatKickoffParts(featuredFixture.kickoffAt).day}
                  </p>
                  <p className="text-2xl font-semibold">
                    {formatKickoffParts(featuredFixture.kickoffAt).time}
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-xl text-sm text-muted">
                {featuredFixture.headline}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/analysis/${featuredFixture.id}`}
                  className="accent-button px-5 py-3 text-sm"
                >
                  <BrainCircuit className="h-4 w-4" />
                  Analisar agora
                </Link>
                <Link
                  href={`/matches/${featuredFixture.id}`}
                  className="outline-button px-5 py-3 text-sm"
                >
                  Ver sinais
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="panel-soft flex flex-col justify-between p-5">
              <div>
                <p className="eyebrow">Modelos em forma</p>
                <p className="mt-2 text-sm text-muted">
                  Todos os provedores recebem o mesmo pacote de evidencias antes
                  de gerar seus palpites.
                </p>
              </div>
              <div className="mt-4 space-y-3">
                {ranking.slice(0, 3).map((provider) => (
                  <div key={provider.provider}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{provider.providerName}</span>
                      <span className="text-muted">
                        {formatPercentInt(provider.accuracy * 100)}
                      </span>
                    </div>
                    <div className="metric-bar mt-2 h-2">
                      <span
                        style={{ width: formatPercentInt(provider.accuracy * 100) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <section className="space-y-4">
        <SectionHeading title="Competicoes acompanhadas" eyebrow="Filtro de agenda" />
        <CompetitionTabs activeCompetition={activeCompetition} />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Proximas partidas"
          eyebrow="Leitura rapida"
          action={
            <Link href="/ranking" className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
              Ranking
              <ChevronRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="space-y-3">
          {fixtures.map((fixture, index) => {
            const kickoff = formatKickoffParts(fixture.kickoffAt);

            return (
              <Link
                key={fixture.id}
                href={`/matches/${fixture.id}`}
                className="panel-soft motion-enter block p-5"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                      <span>{kickoff.weekday}</span>
                      <span>{kickoff.day}</span>
                      <span>{fixture.roundLabel}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-semibold tracking-[-0.04em]">
                        {fixture.homeTeam.shortName} vs {fixture.awayTeam.shortName}
                      </p>
                      <p className="text-sm text-muted">{fixture.headline}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-right">
                    <p className="text-2xl font-semibold">{kickoff.time}</p>
                    <span className="chip text-xs">{fixture.signalTag}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel-soft p-5">
          <SectionHeading title="Motor do dia" eyebrow="Enfoque do produto" />
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>
              O produto recomenda mercados e explica o por que. O usuario faz a
              aposta real onde quiser.
            </p>
            <p>
              O forecast estruturado sai primeiro do motor deterministico. As
              IAs entram para comparar leitura, linguagem e vieses.
            </p>
          </div>
        </div>
        <div className="panel-soft p-5">
          <SectionHeading title="Destaque tecnico" eyebrow="Beta readiness" />
          <div className="mt-4 flex items-start gap-3">
            <div className="rounded-2xl border border-[rgba(131,255,85,0.24)] bg-[rgba(131,255,85,0.12)] p-3">
              <Sparkles className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="font-semibold">Consenso multi-modelo</p>
              <p className="mt-2 text-sm text-muted">
                Claude, GPT, Gemini e Grok respondem ao mesmo evidence bundle e
                o app mostra alinhamento, confianca e divergencia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel-soft p-5">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-[var(--accent)]" />
          <div>
            <p className="font-semibold">Ranking calibrado</p>
            <p className="text-sm text-muted">
              O leaderboard compara acuracia e calibracao, nao apenas green/red.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
