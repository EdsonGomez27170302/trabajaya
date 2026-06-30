interface Stat {
  label: string;
  value: number;
  color: string;
}

export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-1 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">{s.label}</p>
          <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}
