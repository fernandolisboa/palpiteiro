import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import { AnalysisWorkbench } from "@/components/analysis-workbench";
import { generateAnalysis, getFixtureDetails, getPreferences } from "@/lib/data";

type AnalysisPageProps = {
  params: Promise<{ fixtureId: string }>;
};

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { fixtureId } = await params;
  const fixture = await getFixtureDetails(fixtureId);

  if (!fixture) {
    notFound();
  }

  const preferences = await getPreferences();
  const initialAnalysis = await generateAnalysis({
    fixtureId,
    providers: preferences.selectedProviders,
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <Link href={`/matches/${fixture.id}`} className="outline-button h-11 w-11 rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="text-right">
          <p className="eyebrow">Comparador</p>
          <p className="text-sm text-muted">{fixture.homeTeam.shortName} vs {fixture.awayTeam.shortName}</p>
        </div>
      </header>

      <section className="panel p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Analise multi-modelo</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.05em]">
              {fixture.homeTeam.name} vs {fixture.awayTeam.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              O motor deterministico gera a ancora do palpite. Em seguida, cada
              IA monta sua leitura sobre o mesmo pacote de evidencias.
            </p>
          </div>
          <Link
            href={`/matches/${fixture.id}`}
            className="outline-button px-5 py-3 text-sm"
          >
            Ver contexto completo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <AnalysisWorkbench
        fixtureId={fixture.id}
        fixtureLabel={`${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`}
        defaultProviders={preferences.selectedProviders}
        initialAnalysis={initialAnalysis}
      />
    </div>
  );
}

