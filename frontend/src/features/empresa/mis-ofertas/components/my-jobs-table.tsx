"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Star } from "lucide-react";

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

export function MyJobsTable() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [featureError, setFeatureError] = useState("");
  const [featuringId, setFeaturingId] = useState<number | null>(null);

  useEffect(() => {
    api.get<{ data: Job[] } | Job[]>("/company/jobs")
      .then(({ data: raw }) => setJobs(Array.isArray(raw) ? raw : (raw as { data: Job[] }).data ?? []))
      .catch(() => setError("No se pudieron cargar las ofertas."))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(job: Job) {
    const newStatus = job.status === "active" ? "paused" : "active";
    try {
      const { data: updated } = await api.put<Job>(`/company/jobs/${job.id}`, {
        ...job,
        status: newStatus,
      });
      setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    } catch {
      setError("No se pudo actualizar el estado.");
    }
  }

  async function handleFeature(job: Job) {
    setFeatureError("");
    setFeaturingId(job.id);
    try {
      const { data } = await api.post<{ init_point: string }>("/company/payment/create-preference", {
        job_id: job.id,
      });
      window.location.href = data.init_point;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "No se pudo iniciar el pago. Intenta de nuevo.";
      setFeatureError(msg);
      setFeaturingId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar esta oferta?")) return;
    try {
      await api.delete(`/company/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch {
      setError("No se pudo eliminar la oferta.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
            Mis ofertas
          </p>
          <h1 className="mt-2 text-3xl font-black text-foreground">
            Gestiona tus vacantes
          </h1>
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
      {featureError && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
          {featureError}
        </p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
          Aún no has publicado ninguna oferta.
        </div>
      )}

      {jobs.length > 0 && (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{job.title}</p>
                  {job.is_featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      <Star className="size-3 fill-amber-500 dark:fill-amber-400" />
                      Destacado
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {job.category} · {job.zone} · {formatSalary(job)} · {job.vacancies} vacante{job.vacancies !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {job.views_count} visualizaciones
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[job.status] ?? "bg-muted text-foreground"}`}>
                  {STATUS_LABEL[job.status] ?? job.status}
                </span>
                <Link
                  href={`/empresa/candidatos/${job.id}`}
                  className="rounded-2xl border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                >
                  Ver candidatos
                </Link>
                {job.status !== "closed" && (
                  <button
                    type="button"
                    onClick={() => handleToggle(job)}
                    className="rounded-2xl border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                  >
                    {job.status === "active" ? "Pausar" : "Activar"}
                  </button>
                )}
                {!job.is_featured && (
                  <button
                    type="button"
                    disabled={featuringId === job.id}
                    onClick={() => handleFeature(job)}
                    className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-amber-200 transition hover:bg-amber-600 active:scale-95 disabled:opacity-60 dark:shadow-amber-900"
                  >
                    <Sparkles className="size-3.5" />
                    {featuringId === job.id ? "Redirigiendo…" : "Destacar · S/ 5.00"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(job.id)}
                  className="rounded-2xl border border-border px-3 py-1 text-xs text-muted-foreground hover:border-red-300 hover:text-red-500"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
