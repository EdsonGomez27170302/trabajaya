import Link from "next/link";

export function AdminQuickLinks() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/admin/usuarios"
        className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-primary"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Usuarios</p>
        <h2 className="text-xl font-black text-foreground">Gestión de usuarios</h2>
        <p className="text-sm text-muted-foreground">Activa/desactiva cuentas y verifica empresas pendientes.</p>
      </Link>
      <Link
        href="/admin/ofertas"
        className="flex flex-col gap-2 rounded-3xl border border-border bg-card p-6 shadow-sm hover:border-primary"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Ofertas</p>
        <h2 className="text-xl font-black text-foreground">Moderación de ofertas</h2>
        <p className="text-sm text-muted-foreground">Revisa, modera y elimina ofertas inapropiadas de la plataforma.</p>
      </Link>
    </div>
  );
}
