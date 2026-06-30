"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { AdminUser } from "./users-table-types";

export function useUsersTable() {
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

  return { users, loading, error, roleFilter, setRoleFilter, handleToggle, handleVerify };
}
