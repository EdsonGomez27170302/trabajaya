"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { formatSalary } from "@/lib/format";
import type { Application, StudentProfile } from "@/types";

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

export function StudentDashboardView() {
  const { profile: storeProfile } = useAuthStore();
  const [profile, setProfile] = useState<StudentProfile | null>(
    storeProfile as StudentProfile | null,
  );
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<StudentProfile>("/student/profile"),
      api.get<{ data: Application[] }>("/student/applications"),
    ])
      .then(([pRes, aRes]) => {
        setProfile(pRes.data);
        setApplications(aRes.data.data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const total = applications.length;
  const pending = applications.filter((a) => a.status === "pending" || a.status === "viewed").length;
  const accepted = applications.filter((a) => a.status === "accepted").length;

  if (loading) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-black text-foreground">
          Hola, {profile?.first_name ?? "estudiante"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile?.faculty} · {profile?.career} · Semestre {profile?.semester}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Postulaciones", value: total, color: "text-primary" },
          { label: "En proceso", value: pending, color: "text-yellow-600" },
          { label: "Aceptadas", value: accepted, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col gap-1 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-semibold text-foreground">Acciones rápidas</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/estudiante/ofertas" className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Buscar ofertas
          </Link>
          <Link href="/estudiante/postulaciones" className="rounded-2xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
            Mis postulaciones
          </Link>
          <Link href="/estudiante/perfil" className="rounded-2xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
            Mi perfil
          </Link>
        </div>
      </div>

      {applications.length > 0 && (
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Últimas postulaciones</p>
            <Link href="/estudiante/postulaciones" className="text-xs text-primary hover:underline">Ver todas →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {applications.slice(0, 4).map((app) => (
              <div key={app.id} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{app.job?.title ?? "Oferta"}</p>
                  <p className="text-xs text-muted-foreground">
                    {app.job?.company?.company_name} · {app.job ? formatSalary(app.job) : ""}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR[app.status] ?? "bg-muted text-foreground"}`}>
                  {STATUS_LABEL[app.status] ?? app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 && (
        <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
          Aún no tienes postulaciones.{" "}
          <Link href="/estudiante/ofertas" className="font-semibold text-primary hover:underline">
            Busca ofertas disponibles →
          </Link>
        </div>
      )}
    </div>
  );
}
