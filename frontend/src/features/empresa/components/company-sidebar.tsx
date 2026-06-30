"use client";

import { Briefcase, Building2, LayoutDashboard, UserRound } from "lucide-react";

import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth-store";
import type { CompanyProfile } from "@/types";
import { SidebarHeader } from "@/components/shared/sidebar-header";
import { SidebarNav } from "@/components/shared/sidebar-nav";
import { SidebarFooter } from "@/components/shared/sidebar-footer";

const navItems = [
  { href: "/empresa/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/empresa/mis-ofertas", label: "Mis ofertas", icon: Briefcase },
  { href: "/empresa/perfil", label: "Perfil", icon: UserRound },
];

export function CompanySidebar({ className }: { className?: string } = {}) {
  const profile = useAuthStore((s) => s.profile);
  const company = profile as CompanyProfile | null;

  return (
    <aside className={cn("hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex", className)}>
      <SidebarHeader icon={Building2} label="Empresa" />
      <SidebarNav items={navItems} />
      <SidebarFooter title={company?.company_name ?? "Empresa"} subtitle={company?.sector ?? "Empresa"} />
    </aside>
  );
}
