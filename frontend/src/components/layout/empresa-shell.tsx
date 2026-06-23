"use client";

import { useState } from "react";

import { CompanyHeader } from "@/features/empresa/components/company-header";
import { CompanySidebar } from "@/features/empresa/components/company-sidebar";

export function EmpresaShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-card shadow-xl">
            <CompanySidebar className="flex w-full" />
          </div>
        </div>
      )}

      <CompanySidebar />

      <div className="flex flex-1 flex-col">
        <CompanyHeader onMenuToggle={() => setMobileOpen((v) => !v)} />
        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}
