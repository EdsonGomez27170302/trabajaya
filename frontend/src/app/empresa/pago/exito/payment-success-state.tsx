import Link from "next/link";

export function PaymentSuccessState({ jobId }: { jobId: number | null }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-4xl">✓</div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Oferta destacada</p>
          <h1 className="mt-2 text-3xl font-black text-foreground">¡Tu oferta ahora aparece entre las primeras!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            La oferta {jobId ? `#${jobId}` : ""} ya está destacada y llegará a más estudiantes de la UNSCH.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Link href="/empresa/mis-ofertas" className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Ver mis ofertas
          </Link>
          <Link href="/empresa/dashboard" className="rounded-2xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
            Ir al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
