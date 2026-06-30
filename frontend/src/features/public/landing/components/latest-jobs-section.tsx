import Link from "next/link";

import { getLatestJobs } from "@/features/public/landing/actions/get-landing-data";
import { LatestJobCard } from "./latest-job-card";

export async function LatestJobsSection({ search }: { search?: string }) {
  const jobs = await getLatestJobs(search);

  return (
    <section id="ofertas" className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Ofertas de trabajo</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">
            {search ? (
              <>
                Resultados para <span className="text-primary">&ldquo;{search}&rdquo;</span>
              </>
            ) : (
              "Vacantes disponibles"
            )}
          </h2>
        </div>
        <Link href="/estudiante/ofertas" className="text-sm font-semibold text-foreground hover:text-primary">
          Ver todas →
        </Link>
      </div>

      {jobs.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <LatestJobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          {search ? `No se encontraron ofertas para "${search}".` : "Pronto publicaremos nuevas ofertas."}
        </p>
      )}
    </section>
  );
}
