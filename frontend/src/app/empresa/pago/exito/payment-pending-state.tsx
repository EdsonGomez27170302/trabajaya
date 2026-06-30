import Link from "next/link";

export function PaymentPendingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-4xl">⏳</div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-600">Pago en proceso</p>
          <h1 className="mt-2 text-3xl font-black text-foreground">Pago pendiente</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tu pago está siendo procesado. Te notificaremos cuando se confirme. Puede tardar unos minutos.
          </p>
        </div>
        <Link href="/empresa/dashboard" className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
