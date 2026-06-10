import type { ReactNode } from "react";

interface PlaceholderCardProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PlaceholderCard({
  eyebrow,
  title,
  description,
  children,
}: PlaceholderCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-black">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}
