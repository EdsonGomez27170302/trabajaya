"use client";

import Link from "next/link";

export function NavbarMobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="border-t border-primary-foreground/20 bg-primary px-6 pb-4 md:hidden">
      <div className="flex flex-col gap-3 pt-4 text-sm">
        <Link
          href="/auth/login"
          onClick={onClose}
          className="font-semibold text-primary-foreground/90 transition hover:text-primary-foreground"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/auth/register/estudiante"
          onClick={onClose}
          className="inline-flex w-fit rounded-full bg-primary-foreground px-4 py-2 font-semibold text-primary transition hover:bg-primary-foreground/90"
        >
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}
