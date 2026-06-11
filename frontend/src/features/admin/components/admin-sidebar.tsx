"use client";

import { FileText, LayoutDashboard, LogOut, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth-store";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/ofertas", label: "Ofertas", icon: FileText },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    router.replace("/auth/login");
  }

  return (
    <aside className={cn("hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex", className)}>
      <div className="flex items-center gap-2 border-b border-border px-6 py-6">
        <ShieldCheck className="size-6 text-primary" />
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">TrabajaYa</p>
          <p className="text-sm font-semibold text-foreground">Admin</p>
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
          <p className="truncate text-sm font-semibold text-foreground">
            {user?.username ?? "Admin"}
          </p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
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
