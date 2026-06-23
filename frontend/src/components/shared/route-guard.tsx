"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";

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
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token || !user) {
      router.replace("/auth/login");
    } else if (user.role !== role) {
      router.replace(ROLE_HOME[user.role] ?? "/auth/login");
    }
  }, [token, user, role, router]);

  if (!token || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </div>
    );
  }

  return <>{children}</>;
}
