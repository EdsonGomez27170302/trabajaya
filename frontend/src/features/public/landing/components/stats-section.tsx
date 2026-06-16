import { getPlatformStats } from "@/features/public/landing/actions/get-landing-data";

export async function StatsSection() {
  const stats = await getPlatformStats();

  const items = [
    { label: "Ofertas activas", value: stats.active_jobs },
    { label: "Estudiantes verificados", value: stats.verified_students },
    { label: "Empresas conectadas", value: stats.registered_companies },
  ];

  return (
    <section className="border-y border-border bg-muted/50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Hoy en la plataforma
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {items.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <p className="text-4xl font-black text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
