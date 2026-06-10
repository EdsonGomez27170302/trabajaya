import Link from "next/link";

import { latestJobs } from "@/features/public/landing/lib/data-landing";

export function LatestJobsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">
            Últimas ofertas
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            Vacantes destacadas para empezar hoy
          </h2>
        </div>
        <Link
          href="/estudiante/ofertas"
          className="text-sm font-semibold text-foreground hover:text-primary"
        >
          Ver todas →
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {latestJobs.map((job) => (
          <article
            key={job.title}
            className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {job.badge}
              </span>
              <span className="text-sm text-muted-foreground">{job.zone}</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">
              {job.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{job.company}</p>
            <p className="mt-4 text-sm text-foreground">{job.salary}</p>
            <p className="mt-2 text-sm text-muted-foreground">{job.schedule}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
