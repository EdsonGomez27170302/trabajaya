"use client";

import { useState } from "react";

import type { Job } from "@/types";
import { JobDetailModal } from "./job-detail-modal";
import { JobListCard } from "./job-list-card";

export function JobsList({ jobs }: { jobs: Job[] }) {
  const [selected, setSelected] = useState<Job | null>(null);

  if (jobs.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
        No hay ofertas disponibles en este momento.
      </div>
    );
  }

  return (
    <>
      {selected && <JobDetailModal job={selected} onClose={() => setSelected(null)} />}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <JobListCard key={job.id} job={job} onSelect={setSelected} />
        ))}
      </div>
    </>
  );
}
