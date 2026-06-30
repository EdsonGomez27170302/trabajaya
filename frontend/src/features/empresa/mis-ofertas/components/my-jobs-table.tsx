"use client";

import Link from "next/link";

import { useMyJobsTable } from "./use-my-jobs-table";
import { MyJobRow } from "./my-job-row";

export function MyJobsTable() {
  const { jobs, loading, error, featureError, featuringId, handleToggle, handleFeature, handleDelete } =
    useMyJobsTable();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Mis ofertas</p>
          <h1 className="mt-2 text-3xl font-black text-foreground">Gestiona tus vacantes</h1>
        </div>
        <Link
          href="/empresa/mis-ofertas/nueva"
          className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          + Nueva oferta
        </Link>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
      {featureError && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{featureError}</p>}

      {!loading && !error && jobs.length === 0 && (
        <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
          Aún no has publicado ninguna oferta.
        </div>
      )}

      {jobs.length > 0 && (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <MyJobRow
              key={job.id}
              job={job}
              featuringId={featuringId}
              onToggle={handleToggle}
              onFeature={handleFeature}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
