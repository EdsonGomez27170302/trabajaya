"use client";

import { ROLE_COLOR, ROLE_LABEL, type AdminUser } from "./users-table-types";

export function UserRowInfo({ user, name }: { user: AdminUser; name: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold text-foreground">{name}</p>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${ROLE_COLOR[user.role]}`}>
          {ROLE_LABEL[user.role]}
        </span>
        {!user.is_active && (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">Suspendido</span>
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
  );
}
