"use client";

import { Star } from "lucide-react";

import { formatSalary } from "@/lib/format";
import type { Job } from "@/types";
import { MyJobRowActions } from "./my-job-row-actions";

export function MyJobRow({
  job,
  featuringId,
  onToggle,
  onFeature,
  onDelete,
}: {
  job: Job;
  featuringId: number | null;
  onToggle: (job: Job) => void;
  onFeature: (job: Job) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-foreground">{job.title}</p>
          {job.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Star className="size-3 fill-amber-500 dark:fill-amber-400" /> Destacado
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {job.category} · {job.zone} · {formatSalary(job)} · {job.vacancies} vacante{job.vacancies !== 1 ? "s" : ""}
        </p>
        <p className="text-xs text-muted-foreground">{job.views_count} visualizaciones</p>
      </div>

      <MyJobRowActions job={job} featuringId={featuringId} onToggle={onToggle} onFeature={onFeature} onDelete={onDelete} />
    </div>
  );
}
