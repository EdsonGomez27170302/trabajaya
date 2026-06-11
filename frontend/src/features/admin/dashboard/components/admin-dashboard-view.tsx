"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api";

interface Stats {
  active_jobs: number;
  registered_companies: number;
  verified_students: number;
}

export function AdminDashboardView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Stats>("/stats")
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Cargando…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          Administración
        </p>
        <h1 className="mt-2 text-3xl font-black text-foreground">
          Panel de control
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestiona usuarios, empresas y ofertas de trabajo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Ofertas activas", value: stats?.active_jobs ?? 0, color: "text-primary" },
          { label: "Empresas registradas", value: stats?.registered_companies ?? 0, color: "text-green-600" },
          { label: "Estudiantes verificados", value: stats?.verified_students ?? 0, color: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col gap-1 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/usuarios"
          className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-primary"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Usuarios</p>
          <h2 className="text-xl font-black text-foreground">Gestión de usuarios</h2>
          <p className="text-sm text-muted-foreground">
            Activa/desactiva cuentas y verifica empresas pendientes.
          </p>
        </Link>
        <Link
          href="/admin/ofertas"
          className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-primary"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Ofertas</p>
          <h2 className="text-xl font-black text-foreground">Moderación de ofertas</h2>
          <p className="text-sm text-muted-foreground">
            Revisa, modera y elimina ofertas inapropiadas de la plataforma.
          </p>
        </Link>
      </div>
    </div>
  );
}
