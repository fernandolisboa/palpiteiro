"use client";

import { useState, useTransition } from "react";

import {
  competitionLabels,
  providerLabels,
  type UserPreferences,
  type UserQuota,
} from "@palpiteiro/domain";

type PreferencesPanelProps = {
  initialPreferences: UserPreferences;
  quota: UserQuota;
};

export function PreferencesPanel({
  initialPreferences,
  quota,
}: PreferencesPanelProps) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleProvider(provider: keyof typeof providerLabels) {
    setPreferences((current) => {
      if (current.selectedProviders.includes(provider)) {
        if (current.selectedProviders.length === 1) {
          return current;
        }

        return {
          ...current,
          selectedProviders: current.selectedProviders.filter(
            (entry) => entry !== provider,
          ),
        };
      }

      return {
        ...current,
        selectedProviders: [...current.selectedProviders, provider],
      };
    });
  }

  function savePreferences() {
    setStatus(null);

    startTransition(async () => {
      const response = await fetch("/api/me/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        setStatus("Nao foi possivel salvar agora.");
        return;
      }

      const payload = (await response.json()) as {
        preferences: UserPreferences;
      };
      setPreferences(payload.preferences);
      setStatus("Preferencias atualizadas no modo demo.");
    });
  }

  return (
    <div className="space-y-5">
      <section className="panel p-5">
        <p className="eyebrow">Conta e creditos</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Creditos gerenciados
            </p>
            <p className="mt-2 text-3xl font-semibold">{quota.managedCredits}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Limite diario
            </p>
            <p className="mt-2 text-3xl font-semibold">{quota.dailyCap}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Uso hoje
            </p>
            <p className="mt-2 text-3xl font-semibold">{quota.usedToday}</p>
          </div>
        </div>
      </section>

      <section className="panel-soft p-5">
        <p className="eyebrow">Preferencias</p>
        <div className="mt-4 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-semibold">Competicao padrao</span>
            <select
              className="w-full rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-sm"
              value={preferences.defaultCompetition}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  defaultCompetition: event.target.value as UserPreferences["defaultCompetition"],
                }))
              }
            >
              {Object.entries(competitionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold">Modo de analise</span>
            <select
              className="w-full rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-sm"
              value={preferences.analysisMode}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  analysisMode: event.target.value as UserPreferences["analysisMode"],
                }))
              }
            >
              <option value="managed">Chaves do app</option>
              <option value="hybrid">Hibrido</option>
              <option value="byok">Somente BYOK</option>
            </select>
          </label>

          <div className="space-y-2">
            <span className="text-sm font-semibold">Provedores ativos</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(providerLabels).map(([provider, label]) => {
                const active = preferences.selectedProviders.includes(
                  provider as keyof typeof providerLabels,
                );

                return (
                  <button
                    key={provider}
                    type="button"
                    onClick={() =>
                      toggleProvider(provider as keyof typeof providerLabels)
                    }
                    className={`chip ${active ? "chip-active" : ""}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center justify-between rounded-3xl border border-white/6 bg-black/10 px-4 py-3">
            <span>
              <span className="block text-sm font-semibold">
                Notificacoes de oportunidades
              </span>
              <span className="block text-xs text-muted">
                Placeholder para a fase de notificacoes.
              </span>
            </span>
            <input
              type="checkbox"
              checked={preferences.notificationsEnabled}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  notificationsEnabled: event.target.checked,
                }))
              }
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-sm text-muted">{status ?? "Modo demo sem persistencia real."}</p>
          <button
            type="button"
            onClick={savePreferences}
            disabled={isPending}
            className="accent-button px-5 py-3 text-sm disabled:opacity-70"
          >
            {isPending ? "Salvando" : "Salvar preferencias"}
          </button>
        </div>
      </section>
    </div>
  );
}

