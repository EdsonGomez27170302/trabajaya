import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-border bg-card">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-primary">
            TrabajaYa
          </p>
          <h2 className="text-xl font-semibold text-foreground">
            Ayacucho para estudiantes UNSCH
          </h2>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/auth/login"
            className="font-semibold text-foreground transition hover:text-primary"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth/register/estudiante"
            className="rounded-full bg-foreground px-4 py-2 font-semibold text-background transition hover:bg-foreground/90"
          >
            Crear cuenta
          </Link>
        </div>
      </nav>
    </header>
  );
}
