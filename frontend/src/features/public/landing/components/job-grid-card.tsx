"use client";

import { Star } from "lucide-react";

import { ASSET_BASE_URL } from "@/lib/config";
import { formatSalary } from "@/lib/format";
import type { Job } from "@/types";

export function JobGridCard({ job, onSelect }: { job: Job; onSelect: (job: Job) => void }) {
  return (
    <article
      onClick={() => onSelect(job)}
      className={
        job.is_featured
          ? "relative cursor-pointer overflow-hidden rounded-3xl border border-amber-300 bg-linear-to-br from-amber-50 to-card p-6 shadow-sm transition hover:shadow-md dark:border-amber-700/60 dark:from-amber-950/25 dark:to-card"
          : "cursor-pointer rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
      }
    >
      {job.is_featured && (
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500" />
      )}
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
            <p className="truncate text-sm font-semibold text-foreground">{job.company?.company_name}</p>
            <p className="text-xs text-muted-foreground">{job.zone}</p>
          </div>
        </div>
        {job.is_featured && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            <Star className="size-3 fill-amber-500" />
            Destacado
          </span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-bold text-foreground">{job.title}</h3>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{formatSalary(job)}</span>
        <span className="text-xs text-muted-foreground">
          {job.vacancies} vacante{job.vacancies === 1 ? "" : "s"}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Toca para ver contacto →</p>
    </article>
  );
}
