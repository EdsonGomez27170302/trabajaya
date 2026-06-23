"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { StudentProfile, CompanyProfile } from "@/types";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: "student" | "company" | "admin";
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  student_profile?: StudentProfile;
  company_profile?: CompanyProfile;
}

const ROLE_LABEL: Record<string, string> = {
  student: "Estudiante",
  company: "Empresa",
  admin: "Admin",
};

const ROLE_COLOR: Record<string, string> = {
  student: "bg-blue-50 text-blue-700",
  company: "bg-purple-50 text-purple-700",
  admin: "bg-primary/10 text-primary",
};

export function UsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const q = roleFilter ? `?role=${roleFilter}` : "";
    api
      .get<{ data: AdminUser[] }>(`/admin/users${q}`)
      .then(({ data }) => setUsers(data.data))
      .catch(() => setError("No se pudieron cargar los usuarios."))
      .finally(() => setLoading(false));
  }, [roleFilter]);

  async function handleToggle(user: AdminUser) {
    try {
      const { data: updated } = await api.put<AdminUser>(`/admin/users/${user.id}/toggle-active`);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, is_active: updated.is_active } : u)));
    } catch {
      alert("No se pudo actualizar el usuario.");
    }
  }

  async function handleVerify(user: AdminUser) {
    if (!user.company_profile) return;
    try {
      await api.put(`/admin/companies/${user.company_profile.id}/verify`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id && u.company_profile
            ? { ...u, company_profile: { ...u.company_profile, is_verified: true } }
            : u,
        ),
      );
    } catch {
      alert("No se pudo verificar la empresa.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          Administración
        </p>
        <h1 className="mt-2 text-3xl font-black text-foreground">
          Gestión de usuarios
        </h1>
      </div>

      <div className="flex gap-2">
        {[
          { value: "", label: "Todos" },
          { value: "student", label: "Estudiantes" },
          { value: "company", label: "Empresas" },
          { value: "admin", label: "Admin" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setRoleFilter(f.value)}
            className={`rounded-2xl border px-4 py-1.5 text-sm font-semibold transition ${
              roleFilter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {users.map((user) => {
            const name =
              user.student_profile
                ? `${user.student_profile.first_name} ${user.student_profile.last_name}`
                : user.company_profile?.company_name ?? user.username;

            return (
              <div
                key={user.id}
                className={`flex flex-col gap-3 rounded-3xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between ${
                  !user.is_active ? "border-red-100 opacity-60" : "border-border"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ROLE_COLOR[user.role]}`}>
                      {ROLE_LABEL[user.role]}
                    </span>
                    {!user.is_active && (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                        Suspendido
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email} · @{user.username}</p>
                  {user.company_profile && (
                    <p className="text-xs text-muted-foreground">
                      RUC: {user.company_profile.ruc} ·{" "}
                      {user.company_profile.is_verified ? (
                        <span className="text-green-600">Verificada</span>
                      ) : (
                        <span className="text-yellow-600">Sin verificar</span>
                      )}
                      {" · "}Plan {user.company_profile.plan}
                    </p>
                  )}
                  {user.student_profile && (
                    <p className="text-xs text-muted-foreground">
                      {user.student_profile.faculty} · {user.student_profile.career} · Sem. {user.student_profile.semester}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {user.company_profile && !user.company_profile.is_verified && (
                    <button
                      onClick={() => handleVerify(user)}
                      className="rounded-2xl border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-100"
                    >
                      Verificar empresa
                    </button>
                  )}
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleToggle(user)}
                      className={`rounded-2xl border px-3 py-1 text-xs font-semibold ${
                        user.is_active
                          ? "border-red-200 text-red-500 hover:bg-red-50"
                          : "border-green-200 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {user.is_active ? "Suspender" : "Activar"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {users.length === 0 && (
            <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
              No hay usuarios con este filtro.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
