import { getJobs } from "@/features/estudiante/ofertas/actions/get-jobs";
import { JobsList } from "./jobs-list";

export async function JobsView() {
  const jobs = await getJobs();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          Ofertas
        </p>
        <h1 className="mt-2 text-3xl font-black text-foreground">
          Explora ofertas para estudiantes
        </h1>
        <p className="mt-2 text-muted-foreground">
          {jobs.length} oferta{jobs.length === 1 ? "" : "s"} activa
          {jobs.length === 1 ? "" : "s"} en este momento.
        </p>
      </div>

      <JobsList jobs={jobs} />
    </div>
  );
}
