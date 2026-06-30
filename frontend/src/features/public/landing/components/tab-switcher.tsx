"use client";

import type { Tab } from "./tabs-section-types";

const TAB_LABELS: Record<Tab, string> = {
  todas: "Todas las ofertas",
  estudiante: "Soy estudiante",
  empresa: "Soy empresa",
};

export function TabSwitcher({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            tab === t
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          {TAB_LABELS[t]}
        </button>
      ))}
    </div>
  );
}
