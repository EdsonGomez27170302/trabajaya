"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api";
import type { Application } from "@/types";

interface Props {
  jobId: string;
}

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

export function CandidatesView({ jobId }: Props) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<{ data: Application[] }>(`/company/jobs/${jobId}/candidates`)
      .then(({ data }) => setApplications(data.data))
      .catch(() => setError("No se pudieron cargar los candidatos."))
      .finally(() => setLoading(false));
  }, [jobId]);

  async function handleStatus(app: Application, status: "accepted" | "rejected" | "viewed") {
    try {
      const { data: updated } = await api.put<Application>(`/company/applications/${app.id}`, { status });
      setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } catch {
      alert("No se pudo actualizar el estado.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
            Candidatos
          </p>
          <h1 className="mt-2 text-3xl font-black text-foreground">
            Candidatos para oferta #{jobId}
          </h1>
        </div>
        <Link
          href="/empresa/mis-ofertas"
          className="rounded-2xl border border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary"
        >
          ← Mis ofertas
        </Link>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando candidatos…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && applications.length === 0 && (
        <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
          Aún no hay candidatos para esta oferta.
        </div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="flex flex-col gap-4">
          {applications.map((app) => {
            const student = app.student;
            return (
              <div
                key={app.id}
                className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-foreground">
                      {student ? `${student.first_name} ${student.last_name}` : "Candidato"}
                    </p>
                    {student && (
                      <>
                        <p className="text-sm text-muted-foreground">
                          {student.faculty} · {student.career} · Sem. {student.semester}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.zone}
                          {student.phone ? ` · ${student.phone}` : ""}
                        </p>
                        {student.cv_url && (
                          <a
                            href={student.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-primary hover:underline"
                          >
                            Ver CV →
                          </a>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[app.status] ?? "bg-muted text-foreground"}`}>
                      {STATUS_LABEL[app.status] ?? app.status}
                    </span>
                    {app.status === "pending" && (
                      <button
                        onClick={() => handleStatus(app, "viewed")}
                        className="rounded-2xl border border-border px-3 py-1 text-xs text-muted-foreground hover:border-blue-300 hover:text-blue-600"
                      >
                        Marcar visto
                      </button>
                    )}
                    {app.status !== "accepted" && (
                      <button
                        onClick={() => handleStatus(app, "accepted")}
                        className="rounded-2xl border border-green-200 px-3 py-1 text-xs text-green-700 hover:bg-green-50"
                      >
                        Aceptar
                      </button>
                    )}
                    {app.status !== "rejected" && (
                      <button
                        onClick={() => handleStatus(app, "rejected")}
                        className="rounded-2xl border border-red-200 px-3 py-1 text-xs text-red-500 hover:bg-red-50"
                      >
                        Rechazar
                      </button>
                    )}
                  </div>
                </div>

                {app.cover_letter && (
                  <div className="rounded-2xl bg-muted/40 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Carta de presentación
                    </p>
                    <p className="mt-1 text-sm text-foreground">{app.cover_letter}</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Postulado el{" "}
                  {new Date(app.created_at).toLocaleDateString("es-PE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
