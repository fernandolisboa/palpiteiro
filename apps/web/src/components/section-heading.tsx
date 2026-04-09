import type { ReactNode } from "react";

export function SectionHeading({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-1">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
      </div>
      {action}
    </div>
  );
}

