"use client";

import type { AdminUser } from "./users-table-types";

export function UserRowActions({
  user,
  onToggle,
  onVerify,
}: {
  user: AdminUser;
  onToggle: (user: AdminUser) => void;
  onVerify: (user: AdminUser) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {user.company_profile && !user.company_profile.is_verified && (
        <button
          onClick={() => onVerify(user)}
          className="rounded-2xl border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-100"
        >
          Verificar empresa
        </button>
      )}
      {user.role !== "admin" && (
        <button
          onClick={() => onToggle(user)}
          className={`rounded-2xl border px-3 py-1 text-xs font-semibold ${
            user.is_active ? "border-red-200 text-red-500 hover:bg-red-50" : "border-green-200 text-green-600 hover:bg-green-50"
          }`}
        >
          {user.is_active ? "Suspender" : "Activar"}
        </button>
      )}
    </div>
  );
}
