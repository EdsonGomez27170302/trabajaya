"use client";

import { Briefcase, ClipboardList, GraduationCap, LayoutDashboard, UserRound } from "lucide-react";

import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth-store";
import type { StudentProfile } from "@/types";
import { SidebarHeader } from "@/components/shared/sidebar-header";
import { SidebarNav } from "@/components/shared/sidebar-nav";
import { SidebarFooter } from "@/components/shared/sidebar-footer";

const navItems = [
  { href: "/estudiante/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/estudiante/ofertas", label: "Ofertas", icon: Briefcase },
  { href: "/estudiante/postulaciones", label: "Postulaciones", icon: ClipboardList },
  { href: "/estudiante/perfil", label: "Perfil", icon: UserRound },
];

export function StudentSidebar({ className }: { className?: string } = {}) {
  const { profile, user } = useAuthStore();
  const student = profile as StudentProfile | null;
  const name = student ? `${student.first_name} ${student.last_name}` : user?.username ?? "Estudiante";

  return (
    <aside className={cn("hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex", className)}>
      <SidebarHeader icon={GraduationCap} label="Estudiante" />
      <SidebarNav items={navItems} />
      <SidebarFooter title={name} subtitle={student?.career ?? "Estudiante UNSCH"} />
    </aside>
  );
}
