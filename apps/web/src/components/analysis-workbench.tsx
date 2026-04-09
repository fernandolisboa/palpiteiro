"use client";

import { useMemo, useState, useTransition } from "react";
import { BrainCircuit, RefreshCcw, Sparkles } from "lucide-react";

import {
  providerLabels,
  providerNames,
  type AnalysisRun,
  type ProviderKey,
} from "@palpiteiro/domain";

import { formatPercent } from "@/lib/format";

type AnalysisWorkbenchProps = {
  fixtureId: string;
  fixtureLabel: string;
  defaultProviders: ProviderKey[];
  initialAnalysis: AnalysisRun;
};

const allProviders: ProviderKey[] = ["claude", "gpt", "gemini", "grok"];

export function AnalysisWorkbench({
  fixtureId,
  fixtureLabel,
  defaultProviders,
  initialAnalysis,
}: AnalysisWorkbenchProps) {
  const [selectedProviders, setSelectedProviders] =
    useState<ProviderKey[]>(defaultProviders);
  const [analysis, setAnalysis] = useState(initialAnalysis);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedLabel = useMemo(
    () => selectedProviders.map((provider) => providerLabels[provider]).join(", "),
    [selectedProviders],
  );

  function toggleProvider(provider: ProviderKey) {
    setSelectedProviders((current) => {
      if (current.includes(provider)) {
        return current.length === 1
          ? current
          : current.filter((entry) => entry !== provider);
      }

      return [...current, provider];
    });
  }

  function regenerate() {
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/analyses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fixtureId,
          providers: selectedProviders,
        }),
      });

      if (!response.ok) {
        setError("Nao foi possivel gerar o palpite agora.");
        return;
      }

      const nextAnalysis = (await response.json()) as AnalysisRun;
      setAnalysis(nextAnalysis);
    });
  }

  return (
    <div className="space-y-5">
      <section className="panel motion-enter p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="eyebrow">Analise orientada por consenso</p>
            <h2 className="section-title">{fixtureLabel}</h2>
            <p className="max-w-xl text-sm text-muted">
              O motor probabilistico ancora o palpite e os modelos entram para
              ampliar contexto e comparar vieses.
            </p>
          </div>
          <button
            type="button"
            onClick={regenerate}
            disabled={isPending}
            className="accent-button px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCcw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            {isPending ? "Atualizando" : "Gerar novamente"}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {allProviders.map((provider) => {
            const active = selectedProviders.includes(provider);

            return (
              <button
                key={provider}
                type="button"
                onClick={() => toggleProvider(provider)}
                className={`chip ${
                  active ? "chip-active" : ""
                }`}
                aria-pressed={active}
              >
                {providerLabels[provider]}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="panel-soft p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Consenso</p>
                <h3 className="mt-1 text-2xl font-semibold">
                  {analysis.consensus.topMarkets[0]?.pick ?? "Sem mercado"}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {analysis.consensus.rationale[0]}
                </p>
              </div>
              <div className="rounded-full border border-[rgba(131,255,85,0.25)] bg-[rgba(131,255,85,0.14)] px-3 py-2 text-right">
                <p className="text-xs font-semibold text-muted">Confianca</p>
                <p className="text-xl font-semibold">
                  {analysis.consensus.confidence}%
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {(
                [
                  ["Mandante", analysis.consensus.winnerProbabilities.home],
                  ["Empate", analysis.consensus.winnerProbabilities.draw],
                  ["Visitante", analysis.consensus.winnerProbabilities.away],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {label}
                  </p>
                  <div className="metric-bar h-2">
                    <span style={{ width: formatPercent(value) }} />
                  </div>
                  <p className="text-lg font-semibold">{formatPercent(value)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-soft flex flex-col justify-between gap-4 p-5">
            <div>
              <p className="eyebrow">Pacote atual</p>
              <p className="mt-2 text-sm text-muted">
                Provedores ativos: {selectedLabel}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Placar-base
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {analysis.consensus.exactScore}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Alinhamento
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {analysis.consensus.agreement}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm danger">{error}</p> : null}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted">
          <Sparkles className="h-4 w-4 text-[var(--accent)]" />
          Leituras dos modelos
        </div>
        {analysis.providerForecasts.map((forecast) => (
          <article key={forecast.provider} className="panel-soft p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{forecast.providerLabel}</p>
                <h3 className="mt-1 text-xl font-semibold">
                  {providerNames[forecast.provider]}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-muted">
                  {forecast.style}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3 py-2 text-sm text-muted">
                <BrainCircuit className="h-4 w-4 text-[var(--accent)]" />
                {forecast.confidence}% conf.
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Mandante",
                  value: formatPercent(forecast.winnerProbabilities.home),
                },
                {
                  label: "Empate",
                  value: formatPercent(forecast.winnerProbabilities.draw),
                },
                {
                  label: "Visitante",
                  value: formatPercent(forecast.winnerProbabilities.away),
                },
                {
                  label: "Placar",
                  value: forecast.exactScore,
                },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/6 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {item.label}
                  </p>
                  <p className="mt-3 text-xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Gols", value: forecast.totalGoalsLine },
                { label: "Cartoes", value: forecast.cardsLine },
                { label: "Escanteios", value: forecast.cornersLine },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/6 bg-[rgba(131,255,85,0.05)] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {item.label}
                  </p>
                  <p className="mt-2 font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            <ul className="mt-4 space-y-2 text-sm text-muted">
              {forecast.rationale.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}

