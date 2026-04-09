import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/section-heading";
import { getFixtureDetails } from "@/lib/data";
import { formatKickoffParts } from "@/lib/format";

type MatchPageProps = {
  params: Promise<{ fixtureId: string }>;
};

export default async function MatchPage({ params }: MatchPageProps) {
  const { fixtureId } = await params;
  const fixture = await getFixtureDetails(fixtureId);

  if (!fixture) {
    notFound();
  }

  const kickoff = formatKickoffParts(fixture.kickoffAt);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <Link href="/" className="outline-button h-11 w-11 rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="text-right">
          <p className="eyebrow">Matchroom</p>
          <p className="text-sm text-muted">{fixture.competition.name}</p>
        </div>
      </header>

      <section className="panel p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="eyebrow">{fixture.roundLabel}</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.05em]">
              {fixture.homeTeam.name} vs {fixture.awayTeam.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted">{fixture.headlineDeck}</p>
          </div>
          <div className="space-y-3 text-right">
            <p className="text-3xl font-semibold">{kickoff.time}</p>
            <div className="text-sm text-muted">
              <p>{kickoff.day}</p>
              <p>{fixture.venue}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel-soft p-5">
            <p className="eyebrow">Contexto</p>
            <p className="mt-3 text-sm text-muted">{fixture.stakes}</p>
            <Link
              href={`/analysis/${fixture.id}`}
              className="accent-button mt-5 px-5 py-3 text-sm"
            >
              Gerar palpite
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="panel-soft p-5">
            <p className="eyebrow">Perfis de equipe</p>
            <div className="mt-4 space-y-4">
              {[
                {
                  team: fixture.homeTeam.name,
                  attack: fixture.homeProfile.attackIndex,
                  defense: fixture.homeProfile.defenseIndex,
                },
                {
                  team: fixture.awayTeam.name,
                  attack: fixture.awayProfile.attackIndex,
                  defense: fixture.awayProfile.defenseIndex,
                },
              ].map((item) => (
                <div key={item.team}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.team}</span>
                    <span className="text-muted">
                      ataque {item.attack} / defesa {item.defense}
                    </span>
                  </div>
                  <div className="mt-2 metric-bar h-2">
                    <span style={{ width: `${Math.round((item.attack + item.defense) / 2)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div className="panel-soft p-5">
            <SectionHeading title="Snapshot estatistico" eyebrow="Motor base" />
            <div className="mt-5 space-y-4">
              {fixture.statSnapshot.map((stat) => {
                const total = stat.homeValue + stat.awayValue || 1;
                const homeWidth = `${Math.max(8, Math.round((stat.homeValue / total) * 100))}%`;
                const awayWidth = `${Math.max(8, Math.round((stat.awayValue / total) * 100))}%`;

                return (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{stat.homeValue}</span>
                      <span className="text-muted">{stat.label}</span>
                      <span>{stat.awayValue}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="metric-bar h-2">
                        <span style={{ width: homeWidth }} />
                      </div>
                      <div className="metric-bar h-2">
                        <span style={{ width: awayWidth }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel-soft p-5">
            <SectionHeading title="Leituras narrativas" eyebrow="Noticias e desfalques" />
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {fixture.newsSignals.map((signal) => (
                <li key={signal} className="flex gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 flex-none text-[var(--accent)]" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>

            <div className="glass-divider my-5" />

            <ul className="space-y-3 text-sm text-muted">
              {fixture.injuryNotes.map((note) => (
                <li key={`${note.teamSide}-${note.player}`} className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[var(--accent)]" />
                  <span>
                    {note.player} ({note.teamSide === "home" ? fixture.homeTeam.shortName : fixture.awayTeam.shortName})
                    {" "}
                    - {note.status}, impacto {note.impact}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <div className="panel-soft p-5">
            <SectionHeading title="Forma recente" eyebrow="Ultimos cinco jogos" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <p className="text-sm font-semibold">{fixture.homeTeam.name}</p>
                {fixture.homeForm.map((entry) => (
                  <div key={entry.label} className="flex items-center justify-between rounded-3xl border border-white/6 bg-black/10 px-4 py-3">
                    <span className="text-sm text-muted">{entry.label}</span>
                    <span className="font-semibold">
                      {entry.result} {entry.scoreline}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold">{fixture.awayTeam.name}</p>
                {fixture.awayForm.map((entry) => (
                  <div key={entry.label} className="flex items-center justify-between rounded-3xl border border-white/6 bg-black/10 px-4 py-3">
                    <span className="text-sm text-muted">{entry.label}</span>
                    <span className="font-semibold">
                      {entry.result} {entry.scoreline}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel-soft p-5">
            <SectionHeading title="H2H recente" eyebrow="Historico do duelo" />
            <div className="mt-4 space-y-3">
              {fixture.headToHead.map((entry) => (
                <div key={`${entry.date}-${entry.scoreline}`} className="rounded-3xl border border-white/6 bg-black/10 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{entry.scoreline}</p>
                      <p className="text-xs text-muted">{entry.competition}</p>
                    </div>
                    <div className="text-right text-sm text-muted">
                      <p>{entry.winner}</p>
                      <p>{entry.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
