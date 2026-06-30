"use client";

import type { Application } from "@/types";
import { CandidateStudentInfo } from "./candidate-student-info";
import { CandidateStatusActions } from "./candidate-status-actions";

export function CandidateRow({
  app,
  onStatus,
}: {
  app: Application;
  onStatus: (app: Application, status: "accepted" | "rejected" | "viewed") => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <CandidateStudentInfo student={app.student} />
        <CandidateStatusActions app={app} onStatus={onStatus} />
      </div>

      {app.cover_letter && (
        <div className="rounded-2xl bg-muted/40 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Carta de presentación</p>
          <p className="mt-1 text-sm text-foreground">{app.cover_letter}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Postulado el{" "}
        {new Date(app.created_at).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
