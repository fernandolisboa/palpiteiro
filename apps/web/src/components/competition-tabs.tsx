import Link from "next/link";

import { competitionLabels, type CompetitionSlug } from "@palpiteiro/domain";

const competitionOrder: CompetitionSlug[] = [
  "brasileirao",
  "copa-do-brasil",
  "libertadores",
];

export function CompetitionTabs({
  activeCompetition,
}: {
  activeCompetition: CompetitionSlug;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {competitionOrder.map((competition) => (
        <Link
          key={competition}
          href={`/?competition=${competition}`}
          className={`chip whitespace-nowrap ${
            activeCompetition === competition ? "chip-active" : ""
          }`}
        >
          {competitionLabels[competition]}
        </Link>
      ))}
    </div>
  );
}

