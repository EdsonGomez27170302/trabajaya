"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { LoginResponse } from "@/types";

const ROLE_HOME: Record<string, string> = {
  student: "/estudiante/dashboard",
  company: "/empresa/dashboard",
  admin: "/admin/dashboard",
};

interface Props {
  role: "student" | "company" | "admin";
  children: React.ReactNode;
}

export function RouteGuard({ role, children }: Props) {
  const router = useRouter();
  const { user, setAuth, logout } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get<LoginResponse>("/auth/me")
      .then(({ data }) => active && setAuth(data.user, data.profile))
      .catch(() => active && logout())
      .finally(() => active && setChecked(true));
    return () => {
      active = false;
    };
  }, [setAuth, logout]);

  useEffect(() => {
    if (!checked) return;
    if (!user) {
      router.replace("/auth/login");
    } else if (user.role !== role) {
      router.replace(ROLE_HOME[user.role] ?? "/auth/login");
    }
  }, [checked, user, role, router]);

  if (!checked || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </div>
    );
  }

  return <>{children}</>;
}
