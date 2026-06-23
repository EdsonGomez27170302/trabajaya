"use client";

import { Bell, ChevronLeft, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuthStore } from "@/store/auth-store";
import type { StudentProfile } from "@/types";

interface Props {
  onMenuToggle?: () => void;
}

export function StudentHeader({ onMenuToggle }: Props) {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const student = profile as StudentProfile | null;

  const name = student
    ? `${student.first_name} ${student.last_name}`
    : user?.username ?? "Estudiante";

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Abrir menú"
          className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground md:hidden"
        >
          <Menu className="size-5" />
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Volver"
          className="hidden size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground md:flex"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div>
          <p className="text-sm text-muted-foreground">{name}</p>
          <h1 className="text-base font-bold text-foreground md:text-lg">
            Panel de estudiante
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notificaciones"
          className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Bell className="size-5" />
        </button>
      </div>
    </header>
  );
}
