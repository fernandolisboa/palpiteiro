import { History as HistoryIcon } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { getHistory } from "@/lib/data";

export default async function HistoryPage() {
  const history = await getHistory();

  return (
    <div className="space-y-6">
      <header className="panel p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-3xl border border-[rgba(131,255,85,0.24)] bg-[rgba(131,255,85,0.14)] p-4">
            <HistoryIcon className="h-6 w-6 text-[var(--accent)]" />
          </div>
          <div>
            <p className="eyebrow">Retrospecto</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.05em]">
              Historico resolvido
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              O historico mostra como os palpites se comportaram depois do apito
              final.
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <SectionHeading title="Ultimas leituras" eyebrow="Acompanhamento" />
        {history.map((entry) => (
          <article key={entry.analysisId} className="panel-soft p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{entry.provider}</p>
                <h2 className="mt-2 text-2xl font-semibold">{entry.summary}</h2>
                <p className="mt-2 text-sm text-muted">Top pick: {entry.topPick}</p>
              </div>
              <span
                className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                  entry.verdict === "green"
                    ? "border-[rgba(104,247,162,0.28)] bg-[rgba(104,247,162,0.14)] success"
                    : "border-[rgba(255,108,123,0.28)] bg-[rgba(255,108,123,0.14)] danger"
                }`}
              >
                {entry.verdict}
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Resultado real
                </p>
                <p className="mt-2 text-2xl font-semibold">{entry.actualScore}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Encerrado em
                </p>
                <p className="mt-2 text-2xl font-semibold">{entry.settledAt.slice(0, 10)}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

