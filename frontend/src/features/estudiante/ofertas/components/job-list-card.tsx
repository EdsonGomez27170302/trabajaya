"use client";

import { Star } from "lucide-react";

import { ASSET_BASE_URL } from "@/lib/config";
import { formatSalary, formatScheduleSummary } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Job } from "@/types";

const MODALITY_LABELS: Record<string, string> = {
  presencial: "Presencial",
  remoto: "Remoto",
  mixto: "Mixto",
};

export function JobListCard({ job, onSelect }: { job: Job; onSelect: (job: Job) => void }) {
  return (
    <article
      onClick={() => onSelect(job)}
      className={cn(
        "relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-3xl border p-6 text-card-foreground shadow-sm transition hover:shadow-md",
        job.is_featured
          ? "border-amber-300 bg-linear-to-br from-amber-50 to-card shadow-amber-100 dark:border-amber-700/60 dark:from-amber-950/25 dark:to-card dark:shadow-amber-950/50"
          : "border-border bg-card",
      )}
    >
      {job.is_featured && (
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 dark:from-amber-600 dark:via-amber-500 dark:to-amber-700" />
      )}

      <div className="flex items-center gap-3">
        {job.company?.logo_url ? (
          <img src={`${ASSET_BASE_URL}${job.company.logo_url}`} alt={job.company.company_name} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-muted" />
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{job.company?.company_name}</p>
          <p className="text-sm text-muted-foreground">{job.zone}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-foreground">{job.title}</h2>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {MODALITY_LABELS[job.modality] ?? job.modality}
        </span>
        {job.is_featured && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            <Star className="size-3 fill-amber-500 dark:fill-amber-400" /> Destacado
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">{formatSalary(job)}</span>
        <span className="text-muted-foreground">{job.vacancies} vacante{job.vacancies === 1 ? "" : "s"}</span>
      </div>
      <p className="text-sm text-muted-foreground">{formatScheduleSummary(job.schedule)}</p>
      <p className="text-xs text-muted-foreground">Toca para ver detalles y contacto →</p>
    </article>
  );
}
