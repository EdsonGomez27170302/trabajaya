"use client";

import { ASSET_BASE_URL } from "@/lib/config";
import { formatSalary } from "@/lib/format";
import type { Application } from "@/types";
import { APPLICATION_STATUS_COLOR, APPLICATION_STATUS_LABEL } from "@/features/estudiante/components/application-status";

export function ApplicationRow({
  app,
  onWithdraw,
}: {
  app: Application;
  onWithdraw: (id: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {app.job?.company?.logo_url ? (
          <img
            src={`${ASSET_BASE_URL}${app.job.company.logo_url}`}
            alt={app.job.company.company_name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted" />
        )}
        <div>
          <p className="font-semibold text-foreground">{app.job?.title ?? "Oferta"}</p>
          <p className="text-sm text-muted-foreground">
            {app.job?.company?.company_name} · {app.job ? formatSalary(app.job) : ""}
          </p>
          <p className="text-xs text-muted-foreground">
            Postulado el{" "}
            {new Date(app.created_at).toLocaleDateString("es-PE", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${APPLICATION_STATUS_COLOR[app.status] ?? "bg-muted text-foreground"}`}>
          {APPLICATION_STATUS_LABEL[app.status] ?? app.status}
        </span>
        {app.status === "pending" && (
          <button
            onClick={() => onWithdraw(app.id)}
            className="rounded-2xl border border-border px-3 py-1 text-xs text-muted-foreground hover:border-red-300 hover:text-red-500"
          >
            Retirar
          </button>
        )}
      </div>
    </div>
  );
}
