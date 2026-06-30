"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NavbarMobileMenu } from "./navbar-mobile-menu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-primary/30 bg-primary">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary-foreground/70">TrabajaYa</p>
          <h2 className="text-lg font-semibold text-primary-foreground sm:text-xl">Ayacucho para estudiantes UNSCH</h2>
        </div>

        <div className="hidden items-center gap-3 text-sm md:flex">
          <ThemeToggle />
          <Link href="/auth/login" className="font-semibold text-primary-foreground/90 transition hover:text-primary-foreground">
            Iniciar sesión
          </Link>
          <Link
            href="/auth/register/estudiante"
            className="rounded-full bg-primary-foreground px-4 py-2 font-semibold text-primary transition hover:bg-primary-foreground/90"
          >
            Crear cuenta
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            className="flex size-9 items-center justify-center rounded-xl border border-primary-foreground/20 text-primary-foreground transition hover:bg-primary-foreground/10"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && <NavbarMobileMenu onClose={() => setMobileMenuOpen(false)} />}
    </header>
  );
}
