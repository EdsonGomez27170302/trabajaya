import { Star } from "lucide-react";

import type { Job } from "@/types";
import { LatestJobCardLogo } from "./latest-job-card-logo";
import { LatestJobCardFooter } from "./latest-job-card-footer";

export function LatestJobCard({ job }: { job: Job }) {
  if (job.is_featured) {
    return (
      <article className="group relative overflow-hidden rounded-3xl border border-amber-300 bg-linear-to-br from-amber-50 to-card p-6 shadow-sm shadow-amber-100 transition hover:shadow-md hover:shadow-amber-200 dark:border-amber-700/60 dark:from-amber-950/25 dark:to-card dark:shadow-amber-950/50">
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 dark:from-amber-600 dark:via-amber-500 dark:to-amber-700" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <LatestJobCardLogo job={job} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{job.company?.company_name}</p>
              <p className="text-xs text-muted-foreground">{job.zone}</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            <Star className="size-3 fill-amber-500 dark:fill-amber-400" />
            Destacado
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-foreground">{job.title}</h3>
        <LatestJobCardFooter job={job} />
      </article>
    );
  }

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <LatestJobCardLogo job={job} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{job.company?.company_name}</p>
          <p className="text-xs text-muted-foreground">{job.zone}</p>
        </div>
      </div>

      <h3 className="mt-4 text-lg font-bold text-foreground">{job.title}</h3>
      <LatestJobCardFooter job={job} />
    </article>
  );
}
