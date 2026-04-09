import { Settings2 } from "lucide-react";

import { PreferencesPanel } from "@/components/preferences-panel";
import { getPreferences, getQuota, isDemoMode } from "@/lib/data";

export default async function ProfilePage() {
  const [preferences, quota] = await Promise.all([getPreferences(), getQuota()]);

  return (
    <div className="space-y-6">
      <header className="panel p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-3xl border border-[rgba(131,255,85,0.24)] bg-[rgba(131,255,85,0.14)] p-4">
            <Settings2 className="h-6 w-6 text-[var(--accent)]" />
          </div>
          <div>
            <p className="eyebrow">Conta beta</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.05em]">
              Preferencias e quotas
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              Beta por convite com modo {isDemoMode() ? "demo" : "live"} e
              suporte planejado para chaves do app + BYOK.
            </p>
          </div>
        </div>
      </header>

      <PreferencesPanel initialPreferences={preferences} quota={quota} />
    </div>
  );
}

