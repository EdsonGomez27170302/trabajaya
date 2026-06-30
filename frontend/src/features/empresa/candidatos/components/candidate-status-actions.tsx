"use client";

import type { Application } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  viewed: "Vista",
  accepted: "Aceptada",
  rejected: "Rechazada",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  viewed: "bg-blue-50 text-blue-700",
  accepted: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-600",
};

export function CandidateStatusActions({
  app,
  onStatus,
}: {
  app: Application;
  onStatus: (app: Application, status: "accepted" | "rejected" | "viewed") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[app.status] ?? "bg-muted text-foreground"}`}>
        {STATUS_LABEL[app.status] ?? app.status}
      </span>
      {app.status === "pending" && (
        <button
          onClick={() => onStatus(app, "viewed")}
          className="rounded-2xl border border-border px-3 py-1 text-xs text-muted-foreground hover:border-blue-300 hover:text-blue-600"
        >
          Marcar visto
        </button>
      )}
      {app.status !== "accepted" && (
        <button
          onClick={() => onStatus(app, "accepted")}
          className="rounded-2xl border border-green-200 px-3 py-1 text-xs text-green-700 hover:bg-green-50"
        >
          Aceptar
        </button>
      )}
      {app.status !== "rejected" && (
        <button
          onClick={() => onStatus(app, "rejected")}
          className="rounded-2xl border border-red-200 px-3 py-1 text-xs text-red-500 hover:bg-red-50"
        >
          Rechazar
        </button>
      )}
    </div>
  );
}
