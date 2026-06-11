"use client";

import { useState } from "react";

import { AdminHeader } from "@/features/admin/components/admin-header";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-72 bg-card shadow-xl">
            <AdminSidebar className="flex w-full" />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <AdminHeader onMenuToggle={() => setMobileOpen((v) => !v)} />
        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}
