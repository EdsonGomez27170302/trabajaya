"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import type { Job } from "@/types";

const STATUS_LABEL: Record<string, string> = { active: "Activa", paused: "Pausada", closed: "Cerrada" };
const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  paused: "bg-yellow-50 text-yellow-700",
  closed: "bg-muted text-muted-foreground",
};

export function MyJobRowActions({
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
    <div className="flex flex-wrap items-center gap-2">
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[job.status] ?? "bg-muted text-foreground"}`}>
        {STATUS_LABEL[job.status] ?? job.status}
      </span>
      <Link href={`/empresa/candidatos/${job.id}`} className="rounded-2xl border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">
        Ver candidatos
      </Link>
      {job.status !== "closed" && (
        <button onClick={() => onToggle(job)} className="rounded-2xl border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">
          {job.status === "active" ? "Pausar" : "Activar"}
        </button>
      )}
      {!job.is_featured && (
        <button
          disabled={featuringId === job.id}
          onClick={() => onFeature(job)}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-amber-200 transition hover:bg-amber-600 active:scale-95 disabled:opacity-60 dark:shadow-amber-900"
        >
          <Sparkles className="size-3.5" />
          {featuringId === job.id ? "Redirigiendo…" : "Destacar · S/ 5.00"}
        </button>
      )}
      <button onClick={() => onDelete(job.id)} className="rounded-2xl border border-border px-3 py-1 text-xs text-muted-foreground hover:border-red-300 hover:text-red-500">
        Eliminar
      </button>
    </div>
  );
}
