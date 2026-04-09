"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  Goal,
  History,
  Trophy,
  UserRound,
} from "lucide-react";

const items = [
  { href: "/", label: "Jogos", icon: Goal },
  { href: "/analysis/fix-fla-pal", label: "Palpites", icon: BrainCircuit },
  { href: "/ranking", label: "Ranking", icon: Trophy },
  { href: "/history", label: "Historico", icon: History },
  { href: "/profile", label: "Perfil", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/6 bg-[rgba(6,14,10,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-screen-md items-center justify-between px-4 py-3">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 text-[11px] font-semibold ${
                active ? "text-foreground" : "text-muted"
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                  active
                    ? "border-[rgba(131,255,85,0.28)] bg-[rgba(131,255,85,0.14)]"
                    : "border-transparent bg-transparent"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

