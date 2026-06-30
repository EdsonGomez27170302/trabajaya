"use client";

import { useUsersTable } from "./use-users-table";
import { UserRow } from "./user-row";

const ROLE_FILTERS = [
  { value: "", label: "Todos" },
  { value: "student", label: "Estudiantes" },
  { value: "company", label: "Empresas" },
  { value: "admin", label: "Admin" },
];

export function UsersTable() {
  const { users, loading, error, roleFilter, setRoleFilter, handleToggle, handleVerify } = useUsersTable();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Administración</p>
        <h1 className="mt-2 text-3xl font-black text-foreground">Gestión de usuarios</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {ROLE_FILTERS.map((f) => (
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
          {users.map((user) => (
            <UserRow key={user.id} user={user} onToggle={handleToggle} onVerify={handleVerify} />
          ))}
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
