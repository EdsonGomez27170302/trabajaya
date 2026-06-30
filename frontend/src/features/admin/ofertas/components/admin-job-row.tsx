"use client";

import { formatSalary } from "@/lib/format";
import type { Job } from "@/types";

const STATUS_LABEL: Record<string, string> = { active: "Activa", paused: "Pausada", closed: "Cerrada" };
const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  paused: "bg-yellow-50 text-yellow-700",
  closed: "bg-muted text-muted-foreground",
};

export function AdminJobRow({
  job,
  onModerate,
  onDelete,
}: {
  job: Job;
  onModerate: (job: Job, status: "active" | "paused" | "closed") => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-foreground">{job.title}</p>
          {job.is_featured && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Destacada</span>
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
          <button onClick={() => onModerate(job, "active")} className="rounded-2xl border border-green-200 px-3 py-1 text-xs text-green-700 hover:bg-green-50">
            Activar
          </button>
        )}
        {job.status === "active" && (
          <button onClick={() => onModerate(job, "closed")} className="rounded-2xl border border-yellow-200 px-3 py-1 text-xs text-yellow-700 hover:bg-yellow-50">
            Cerrar
          </button>
        )}
        <button onClick={() => onDelete(job.id)} className="rounded-2xl border border-border px-3 py-1 text-xs text-muted-foreground hover:border-red-300 hover:text-red-500">
          Eliminar
        </button>
      </div>
    </div>
  );
}
