"use client";

import { useAdminJobsTable } from "./use-admin-jobs-table";
import { AdminJobRow } from "./admin-job-row";

const STATUS_FILTERS = [
  { value: "", label: "Todas" },
  { value: "active", label: "Activas" },
  { value: "paused", label: "Pausadas" },
  { value: "closed", label: "Cerradas" },
];

export function AdminJobsTable() {
  const { jobs, loading, error, statusFilter, setStatusFilter, handleModerate, handleDelete } =
    useAdminJobsTable();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Administración</p>
        <h1 className="mt-2 text-3xl font-black text-foreground">Moderación de ofertas</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-2xl border px-4 py-1.5 text-sm font-semibold transition ${
              statusFilter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <AdminJobRow key={job.id} job={job} onModerate={handleModerate} onDelete={handleDelete} />
          ))}
          {jobs.length === 0 && (
            <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
              No hay ofertas con este filtro.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
