"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { ASSET_BASE_URL } from "@/lib/config";
import { formatSalary } from "@/lib/format";
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

export function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<{ data: Application[] }>("/student/applications")
      .then(({ data }) => setApplications(data.data ?? []))
      .catch(() => setError("No se pudieron cargar las postulaciones."))
      .finally(() => setLoading(false));
  }, []);

  async function handleWithdraw(id: number) {
    if (!confirm("¿Retirar esta postulación?")) return;
    try {
      await api.delete(`/student/applications/${id}`);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("No se pudo retirar. Intenta de nuevo.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          Postulaciones
        </p>
        <h1 className="mt-2 text-3xl font-black text-foreground">
          Mis postulaciones
        </h1>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && applications.length === 0 && (
        <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
          Aún no has postulado a ninguna oferta.{" "}
          <a href="/estudiante/ofertas" className="font-semibold text-primary hover:underline">
            Ver ofertas disponibles →
          </a>
        </div>
      )}

      {applications.length > 0 && (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                {app.job?.company?.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${ASSET_BASE_URL}${app.job.company.logo_url}`}
                    alt={app.job.company.company_name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted" />
                )}
                <div>
                  <p className="font-semibold text-foreground">
                    {app.job?.title ?? "Oferta"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {app.job?.company?.company_name} ·{" "}
                    {app.job ? formatSalary(app.job) : ""}
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
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[app.status] ?? "bg-muted text-foreground"}`}
                >
                  {STATUS_LABEL[app.status] ?? app.status}
                </span>
                {app.status === "pending" && (
                  <button
                    onClick={() => handleWithdraw(app.id)}
                    className="rounded-2xl border border-border px-3 py-1 text-xs text-muted-foreground hover:border-red-300 hover:text-red-500"
                  >
                    Retirar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
