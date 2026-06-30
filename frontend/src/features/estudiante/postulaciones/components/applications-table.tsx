"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { Application } from "@/types";
import { ApplicationRow } from "./application-row";

export function ApplicationsTable() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<{ data: Application[] }>("/student/applications")
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
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Postulaciones</p>
        <h1 className="mt-2 text-3xl font-black text-foreground">Mis postulaciones</h1>
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
            <ApplicationRow key={app.id} app={app} onWithdraw={handleWithdraw} />
          ))}
        </div>
      )}
    </div>
  );
}
