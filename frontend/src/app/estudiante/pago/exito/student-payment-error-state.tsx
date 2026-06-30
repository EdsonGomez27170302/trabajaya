import Link from "next/link";

export function StudentPaymentErrorState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-4xl">✕</div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-500">Error</p>
          <h1 className="mt-2 text-3xl font-black text-foreground">No se pudo confirmar el pago</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Si realizaste el pago pero no se activó, contacta a soporte con tu número de transacción.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Link href="/estudiante/perfil" className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Intentar de nuevo
          </Link>
          <Link href="/estudiante/dashboard" className="rounded-2xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
