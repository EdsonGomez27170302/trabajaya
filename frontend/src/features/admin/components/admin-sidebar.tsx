"use client";

import { FileText, LayoutDashboard, ShieldCheck, Users } from "lucide-react";

import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth-store";
import { SidebarHeader } from "@/components/shared/sidebar-header";
import { SidebarNav } from "@/components/shared/sidebar-nav";
import { SidebarFooter } from "@/components/shared/sidebar-footer";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/ofertas", label: "Ofertas", icon: FileText },
];

export function AdminSidebar({ className }: { className?: string } = {}) {
  const user = useAuthStore((s) => s.user);

  return (
    <aside className={cn("hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex", className)}>
      <SidebarHeader icon={ShieldCheck} label="Admin" />
      <SidebarNav items={navItems} />
      <SidebarFooter title={user?.username ?? "Admin"} subtitle={user?.email} />
    </aside>
  );
}
