import Link from "next/link";
import { Star } from "lucide-react";

import { getLatestJobs } from "@/features/public/landing/actions/get-landing-data";
import { ASSET_BASE_URL } from "@/lib/config";
import { formatSalary } from "@/lib/format";

export async function LatestJobsSection({ search }: { search?: string }) {
  const jobs = await getLatestJobs(search);

  return (
    <section id="ofertas" className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">
            Ofertas de trabajo
          </p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            {search ? (
              <>
                Resultados para{" "}
                <span className="text-primary">&ldquo;{search}&rdquo;</span>
              </>
            ) : (
              "Vacantes disponibles"
            )}
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
          {jobs.map((job) =>
            job.is_featured ? (
              <article
                key={job.id}
                className="group relative overflow-hidden rounded-3xl border border-amber-300 bg-linear-to-br from-amber-50 to-card p-6 shadow-sm shadow-amber-100 transition hover:shadow-md hover:shadow-amber-200 dark:border-amber-700/60 dark:from-amber-950/25 dark:to-card dark:shadow-amber-950/50"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 dark:from-amber-600 dark:via-amber-500 dark:to-amber-700" />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {job.company?.logo_url ? (
                      <img
                        src={`${ASSET_BASE_URL}${job.company.logo_url}`}
                        alt={job.company.company_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {job.company?.company_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{job.zone}</p>
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                    <Star className="size-3 fill-amber-500 dark:fill-amber-400" />
                    Destacado
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {job.title}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {formatSalary(job)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {job.vacancies} vacante{job.vacancies === 1 ? "" : "s"}
                  </span>
                </div>
              </article>
            ) : (
              <article
                key={job.id}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  {job.company?.logo_url ? (
                    <img
                      src={`${ASSET_BASE_URL}${job.company.logo_url}`}
                      alt={job.company.company_name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {job.company?.company_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{job.zone}</p>
                  </div>
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {job.title}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {formatSalary(job)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {job.vacancies} vacante{job.vacancies === 1 ? "" : "s"}
                  </span>
                </div>
              </article>
            )
          )}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          {search
            ? `No se encontraron ofertas para "${search}".`
            : "Pronto publicaremos nuevas ofertas."}
        </p>
      )}
    </section>
  );
}
