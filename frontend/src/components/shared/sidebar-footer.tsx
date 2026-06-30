"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";

export function SidebarFooter({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.replace("/auth/login");
  }

  return (
    <div className="border-t border-border px-4 py-4">
      <div className="mb-3 px-2">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-red-50 hover:text-red-600"
      >
        <LogOut className="size-5" />
        Cerrar sesión
      </button>
    </div>
  );
}
