import Link from "next/link";

import { getLatestJobs } from "@/features/public/landing/actions/get-landing-data";
import { formatSalary, formatScheduleSummary } from "@/lib/format";

export async function LatestJobsSection() {
  const jobs = await getLatestJobs(3);

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

      {jobs.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Destacado
                </span>
                <span className="text-sm text-muted-foreground">
                  {job.zone}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                {job.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {job.company?.company_name}
              </p>
              <p className="mt-4 text-sm text-foreground">
                {formatSalary(job)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatScheduleSummary(job.schedule)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Pronto publicaremos nuevas ofertas.
        </p>
      )}
    </section>
  );
}
