import { getPlatformStats } from "@/features/public/landing/actions/get-landing-data";

export async function StatsSection() {
  const stats = await getPlatformStats();

  const items = [
    { label: "Ofertas activas", value: stats.active_jobs },
    { label: "Estudiantes verificados", value: stats.verified_students },
    { label: "Empresas conectadas", value: stats.registered_companies },
  ];

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 sm:grid-cols-3 lg:px-8">
        <p className="col-span-full text-sm uppercase tracking-[0.3em] text-primary-foreground/70">
          Hoy en la plataforma
        </p>
        {items.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-black">{stat.value}</p>
            <p className="mt-1 text-sm text-primary-foreground/80">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
