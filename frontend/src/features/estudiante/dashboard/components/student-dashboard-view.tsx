"use client";

import Link from "next/link";

import { StatCards } from "@/components/shared/stat-cards";
import { useStudentDashboard } from "./use-student-dashboard";
import { StudentRecentApplications } from "./student-recent-applications";

export function StudentDashboardView() {
  const { profile, applications, loading, total, pending, accepted } = useStudentDashboard();

  if (loading) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Dashboard</p>
        <h1 className="mt-2 text-3xl font-black text-foreground">Hola, {profile?.first_name ?? "estudiante"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile?.faculty} · {profile?.career} · Semestre {profile?.semester}
        </p>
      </div>

      <StatCards
        stats={[
          { label: "Postulaciones", value: total, color: "text-primary" },
          { label: "En proceso", value: pending, color: "text-yellow-600" },
          { label: "Aceptadas", value: accepted, color: "text-green-600" },
        ]}
      />

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

      <StudentRecentApplications applications={applications} />
    </div>
  );
}
