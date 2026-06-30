"use client";

import { StatCards } from "@/components/shared/stat-cards";
import { useAdminStats } from "./use-admin-stats";
import { AdminQuickLinks } from "./admin-quick-links";

export function AdminDashboardView() {
  const { stats, loading } = useAdminStats();

  if (loading) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Administración</p>
        <h1 className="mt-2 text-3xl font-black text-foreground">Panel de control</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestiona usuarios, empresas y ofertas de trabajo.</p>
      </div>

      <StatCards
        stats={[
          { label: "Ofertas activas", value: stats?.active_jobs ?? 0, color: "text-primary" },
          { label: "Empresas registradas", value: stats?.registered_companies ?? 0, color: "text-green-600" },
          { label: "Estudiantes verificados", value: stats?.verified_students ?? 0, color: "text-blue-600" },
        ]}
      />

      <AdminQuickLinks />
    </div>
  );
}
