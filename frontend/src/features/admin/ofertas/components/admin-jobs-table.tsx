"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { formatSalary } from "@/lib/format";
import type { Job } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  active: "Activa",
  paused: "Pausada",
  closed: "Cerrada",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  paused: "bg-yellow-50 text-yellow-700",
  closed: "bg-muted text-muted-foreground",
};

export function AdminJobsTable() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const q = statusFilter ? `?status=${statusFilter}` : "";
    api
      .get<{ data: Job[] }>(`/admin/jobs${q}`)
      .then(({ data }) => setJobs(data.data))
      .catch(() => setError("No se pudieron cargar las ofertas."))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  async function handleModerate(job: Job, status: "active" | "paused" | "closed") {
    try {
      const { data: updated } = await api.put<Job>(`/admin/jobs/${job.id}/moderate`, { status });
      setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    } catch {
      alert("No se pudo moderar la oferta.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar esta oferta permanentemente?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch {
      alert("No se pudo eliminar la oferta.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          Administración
        </p>
        <h1 className="mt-2 text-3xl font-black text-foreground">
          Moderación de ofertas
        </h1>
      </div>

      <div className="flex gap-2">
        {[
          { value: "", label: "Todas" },
          { value: "active", label: "Activas" },
          { value: "paused", label: "Pausadas" },
          { value: "closed", label: "Cerradas" },
        ].map((f) => (
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
            <div
              key={job.id}
              className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{job.title}</p>
                  {job.is_featured && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      Destacada
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {job.company?.company_name} · {job.category} · {job.zone} · {formatSalary(job)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {job.views_count} vistas · {job.vacancies} vacante{job.vacancies !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[job.status] ?? "bg-muted text-foreground"}`}>
                  {STATUS_LABEL[job.status] ?? job.status}
                </span>
                {job.status !== "active" && (
                  <button
                    onClick={() => handleModerate(job, "active")}
                    className="rounded-2xl border border-green-200 px-3 py-1 text-xs text-green-700 hover:bg-green-50"
                  >
                    Activar
                  </button>
                )}
                {job.status === "active" && (
                  <button
                    onClick={() => handleModerate(job, "closed")}
                    className="rounded-2xl border border-yellow-200 px-3 py-1 text-xs text-yellow-700 hover:bg-yellow-50"
                  >
                    Cerrar
                  </button>
                )}
                <button
                  onClick={() => handleDelete(job.id)}
                  className="rounded-2xl border border-border px-3 py-1 text-xs text-muted-foreground hover:border-red-300 hover:text-red-500"
                >
                  Eliminar
                </button>
              </div>
            </div>
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
