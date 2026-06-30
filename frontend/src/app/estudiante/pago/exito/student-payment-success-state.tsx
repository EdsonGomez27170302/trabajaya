import Link from "next/link";
import { Star } from "lucide-react";

export function StudentPaymentSuccessState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-4xl">
          <Star className="size-8 fill-amber-500 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-600">Perfil destacado</p>
          <h1 className="mt-2 text-3xl font-black text-foreground">¡Tu perfil ahora aparece entre los primeros!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Las empresas te verán antes que al resto en el directorio de talentos.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Link href="/estudiante/perfil" className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Ver mi perfil
          </Link>
          <Link href="/estudiante/dashboard" className="rounded-2xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
            Ir al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
