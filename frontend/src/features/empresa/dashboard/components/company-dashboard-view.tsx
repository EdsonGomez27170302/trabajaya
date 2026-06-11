"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { CompanyProfile, Job } from "@/types";

export function CompanyDashboardView() {
  const { profile: storeProfile } = useAuthStore();
  const [profile, setProfile] = useState<CompanyProfile | null>(
    storeProfile as CompanyProfile | null,
  );
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<CompanyProfile>("/company/profile"),
      api.get<{ data: Job[] } | Job[]>("/company/jobs"),
    ])
      .then(([pRes, jRes]) => {
        setProfile(pRes.data);
        const raw = jRes.data;
        setJobs(Array.isArray(raw) ? raw : (raw as { data: Job[] }).data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const pausedJobs = jobs.filter((j) => j.status === "paused").length;
  const totalViews = jobs.reduce((sum, j) => sum + j.views_count, 0);

  if (loading) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-black text-foreground">
          {profile?.company_name ?? "Mi empresa"}
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{profile?.sector}</span>
          <span>·</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${profile?.is_verified ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
            {profile?.is_verified ? "Verificada" : "Pendiente de verificación"}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Ofertas activas", value: activeJobs, color: "text-green-600" },
          { label: "Ofertas pausadas", value: pausedJobs, color: "text-yellow-600" },
          { label: "Vistas totales", value: totalViews, color: "text-primary" },
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

      {jobs.length > 0 && (
        <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Últimas ofertas</p>
            <Link href="/empresa/mis-ofertas" className="text-xs text-primary hover:underline">Ver todas →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.views_count} vistas · {job.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${job.status === "active" ? "bg-green-50 text-green-700" : job.status === "paused" ? "bg-yellow-50 text-yellow-700" : "bg-muted text-muted-foreground"}`}>
                    {job.status === "active" ? "Activa" : job.status === "paused" ? "Pausada" : "Cerrada"}
                  </span>
                  <Link href={`/empresa/candidatos/${job.id}`} className="text-xs text-muted-foreground hover:text-primary">
                    Candidatos →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
