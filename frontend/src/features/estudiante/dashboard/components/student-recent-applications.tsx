"use client";

import Link from "next/link";

import { formatSalary } from "@/lib/format";
import type { Application } from "@/types";
import { APPLICATION_STATUS_COLOR, APPLICATION_STATUS_LABEL } from "@/features/estudiante/components/application-status";

export function StudentRecentApplications({ applications }: { applications: Application[] }) {
  if (applications.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
        Aún no tienes postulaciones.{" "}
        <Link href="/estudiante/ofertas" className="font-semibold text-primary hover:underline">
          Busca ofertas disponibles →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Últimas postulaciones</p>
        <Link href="/estudiante/postulaciones" className="text-xs text-primary hover:underline">Ver todas →</Link>
      </div>
      <div className="flex flex-col gap-2">
        {applications.slice(0, 4).map((app) => (
          <div key={app.id} className="flex flex-col gap-1 rounded-2xl border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">{app.job?.title ?? "Oferta"}</p>
              <p className="text-xs text-muted-foreground">
                {app.job?.company?.company_name} · {app.job ? formatSalary(app.job) : ""}
              </p>
            </div>
            <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${APPLICATION_STATUS_COLOR[app.status] ?? "bg-muted text-foreground"}`}>
              {APPLICATION_STATUS_LABEL[app.status] ?? app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
