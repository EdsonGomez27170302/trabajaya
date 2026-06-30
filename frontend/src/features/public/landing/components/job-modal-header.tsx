"use client";

import { Building2, Star } from "lucide-react";

import { ASSET_BASE_URL } from "@/lib/config";
import type { Job } from "@/types";

export function JobModalHeader({ job }: { job: Job }) {
  return (
    <div className="flex items-center gap-3 pr-10">
      {job.company?.logo_url ? (
        <img
          src={`${ASSET_BASE_URL}${job.company.logo_url}`}
          alt={job.company.company_name}
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
          <Building2 className="size-5 text-muted-foreground" />
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">{job.company?.company_name}</p>
        <p className="text-sm text-muted-foreground">{job.zone}</p>
      </div>
      {job.is_featured && (
        <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
          <Star className="size-3 fill-amber-500" />
          Destacado
        </span>
      )}
    </div>
  );
}
