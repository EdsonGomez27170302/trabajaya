"use client";

import { formatSalary, formatScheduleSummary } from "@/lib/format";
import type { Job } from "@/types";

const MODALITY_LABELS: Record<string, string> = {
  presencial: "Presencial",
  remoto: "Remoto",
  mixto: "Mixto",
};

export function JobDetailModalStats({ job }: { job: Job }) {
  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {MODALITY_LABELS[job.modality] ?? job.modality}
        </span>
        {job.category && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{job.category}</span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm">
        <div><p className="text-xs text-muted-foreground">Salario</p><p className="font-semibold text-foreground">{formatSalary(job)}</p></div>
        <div><p className="text-xs text-muted-foreground">Horas/semana</p><p className="font-semibold text-foreground">{job.hours_per_week}h</p></div>
        <div><p className="text-xs text-muted-foreground">Vacantes</p><p className="font-semibold text-foreground">{job.vacancies}</p></div>
        <div><p className="text-xs text-muted-foreground">Horario</p><p className="font-semibold text-foreground text-xs">{formatScheduleSummary(job.schedule)}</p></div>
      </div>

      {job.description && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción</p>
          <p className="whitespace-pre-line text-sm text-foreground">{job.description}</p>
        </div>
      )}
      {job.requirements && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Requisitos</p>
          <p className="whitespace-pre-line text-sm text-foreground">{job.requirements}</p>
        </div>
      )}
    </>
  );
}
