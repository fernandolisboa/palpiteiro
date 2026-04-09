export function formatKickoffParts(kickoffAt: string) {
  const date = new Date(kickoffAt);

  return {
    weekday: new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date),
    day: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date),
    time: new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date),
  };
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function formatPercentInt(value: number) {
  return `${Math.round(value)}%`;
}

