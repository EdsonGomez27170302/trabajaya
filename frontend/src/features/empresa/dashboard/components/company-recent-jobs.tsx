"use client";

import Link from "next/link";

import type { Job } from "@/types";

const STATUS_LABEL: Record<string, string> = { active: "Activa", paused: "Pausada", closed: "Cerrada" };
const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  paused: "bg-yellow-50 text-yellow-700",
  closed: "bg-muted text-muted-foreground",
};

export function CompanyRecentJobs({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Últimas ofertas</p>
        <Link href="/empresa/mis-ofertas" className="text-xs text-primary hover:underline">Ver todas →</Link>
      </div>
      <div className="flex flex-col gap-2">
        {jobs.slice(0, 5).map((job) => (
          <div key={job.id} className="flex flex-col gap-2 rounded-2xl border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">{job.title}</p>
              <p className="text-xs text-muted-foreground">{job.views_count} vistas · {job.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR[job.status] ?? "bg-muted text-muted-foreground"}`}>
                {STATUS_LABEL[job.status] ?? job.status}
              </span>
              <Link href={`/empresa/candidatos/${job.id}`} className="text-xs text-muted-foreground hover:text-primary">
                Candidatos →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
