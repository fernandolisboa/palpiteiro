import { Trophy } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { getRanking } from "@/lib/data";
import { formatPercentInt } from "@/lib/format";

export default async function RankingPage() {
  const ranking = await getRanking();

  return (
    <div className="space-y-6">
      <header className="panel p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-3xl border border-[rgba(131,255,85,0.24)] bg-[rgba(131,255,85,0.14)] p-4">
            <Trophy className="h-6 w-6 text-[var(--accent)]" />
          </div>
          <div>
            <p className="eyebrow">Leaderboard</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.05em]">
              Ranking de IAs
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              O ranking observa acuracia, calibracao e tendencia. Nao mede
              apenas green/red.
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <SectionHeading title="Desempenho recente" eyebrow="Amostra resolvida" />
        {ranking.map((provider, index) => (
          <article key={provider.provider} className="panel-soft p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">
                  {index + 1}o lugar
                </p>
                <h2 className="mt-2 text-2xl font-semibold">{provider.providerName}</h2>
                <p className="mt-2 text-sm text-muted">
                  {provider.resolvedSamples} jogos resolvidos, tendencia {provider.trend}.
                </p>
              </div>
              <div className="rounded-full border border-white/8 bg-white/4 px-3 py-2 text-sm text-muted">
                {formatPercentInt(provider.accuracy * 100)} acerto
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Acuracia
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatPercentInt(provider.accuracy * 100)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Calibracao
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatPercentInt(provider.calibration * 100)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Greens / Reds
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {provider.greens} / {provider.reds}
                </p>
              </div>
            </div>

            <div className="mt-4 metric-bar h-2">
              <span style={{ width: formatPercentInt(provider.accuracy * 100) }} />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

