"use client";

import { Search } from "lucide-react";

import type { Job } from "@/types";
import { JobGridCard } from "./job-grid-card";

export function JobsSearchPanel({
  search,
  onSearchChange,
  jobs,
  onSelectJob,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}) {
  return (
    <>
      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Busca por puesto o descripción…"
          className="w-full rounded-2xl border border-border bg-background py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="mt-6">
        {jobs.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobGridCard key={job.id} job={job} onSelect={onSelectJob} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {search ? `No se encontraron ofertas para "${search}".` : "Pronto publicaremos nuevas ofertas."}
          </p>
        )}
      </div>
    </>
  );
}
