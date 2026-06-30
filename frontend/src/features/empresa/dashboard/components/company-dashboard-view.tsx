"use client";

import Link from "next/link";

import { StatCards } from "@/components/shared/stat-cards";
import { useCompanyDashboard } from "./use-company-dashboard";
import { CompanyRecentJobs } from "./company-recent-jobs";

export function CompanyDashboardView() {
  const { profile, jobs, loading, activeJobs, pausedJobs, totalViews } = useCompanyDashboard();

  if (loading) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Dashboard</p>
        <h1 className="mt-2 text-3xl font-black text-foreground">{profile?.company_name ?? "Mi empresa"}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{profile?.sector}</span>
          <span>·</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${profile?.is_verified ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
            {profile?.is_verified ? "Verificada" : "Pendiente de verificación"}
          </span>
        </div>
      </div>

      <StatCards
        stats={[
          { label: "Ofertas activas", value: activeJobs, color: "text-green-600" },
          { label: "Ofertas pausadas", value: pausedJobs, color: "text-yellow-600" },
          { label: "Vistas totales", value: totalViews, color: "text-primary" },
        ]}
      />

      <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-semibold text-foreground">Acciones rápidas</p>
        <div className="flex flex-wrap gap-2">
          <Link href="/empresa/mis-ofertas/nueva" className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            + Nueva oferta
          </Link>
          <Link href="/empresa/mis-ofertas" className="rounded-2xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
            Mis ofertas
          </Link>
          <Link href="/empresa/perfil" className="rounded-2xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
            Editar perfil
          </Link>
        </div>
      </div>

      <CompanyRecentJobs jobs={jobs} />
    </div>
  );
}
