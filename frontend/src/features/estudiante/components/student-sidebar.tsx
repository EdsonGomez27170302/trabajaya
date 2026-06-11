"use client";

import { Briefcase, ClipboardList, GraduationCap, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth-store";
import type { StudentProfile } from "@/types";

const navItems = [
  { href: "/estudiante/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/estudiante/ofertas", label: "Ofertas", icon: Briefcase },
  { href: "/estudiante/postulaciones", label: "Postulaciones", icon: ClipboardList },
  { href: "/estudiante/perfil", label: "Perfil", icon: UserRound },
];

interface StudentSidebarProps {
  className?: string;
}

export function StudentSidebar({ className }: StudentSidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, user, logout } = useAuthStore();
  const student = profile as StudentProfile | null;

  const name = student
    ? `${student.first_name} ${student.last_name}`
    : user?.username ?? "Estudiante";

  function handleLogout() {
    logout();
    router.replace("/auth/login");
  }

  return (
    <aside className={cn("hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex", className)}>
      <div className="flex items-center gap-2 border-b border-border px-6 py-6">
        <GraduationCap className="size-6 text-primary" />
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">TrabajaYa</p>
          <p className="text-sm font-semibold text-foreground">Estudiante</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <div className="mb-3 px-2">
          <p className="truncate text-sm font-semibold text-foreground">{name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {student?.career ?? "Estudiante UNSCH"}
          </p>
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
    </aside>
  );
}
