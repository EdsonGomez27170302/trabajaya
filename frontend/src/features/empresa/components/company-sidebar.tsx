"use client";

import {
  Briefcase,
  Building2,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";

const navItems = [
  { href: "/empresa/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/empresa/mis-ofertas", label: "Mis ofertas", icon: Briefcase },
  { href: "/empresa/perfil", label: "Perfil", icon: UserRound },
];

export function CompanySidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex items-center gap-2 border-b border-border px-6 py-6">
        <Building2 className="size-6 text-primary" />
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">
            TrabajaYa
          </p>
          <p className="text-sm font-semibold text-foreground">Empresa</p>
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
    </aside>
  );
}
