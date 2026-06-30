"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api";
import type { Application } from "@/types";
import { CandidateRow } from "./candidate-row";

export function CandidatesView({ jobId }: { jobId: string }) {
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Candidatos</p>
          <h1 className="mt-2 text-3xl font-black text-foreground">Candidatos para oferta #{jobId}</h1>
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
          {applications.map((app) => (
            <CandidateRow key={app.id} app={app} onStatus={handleStatus} />
          ))}
        </div>
      )}
    </div>
  );
}
