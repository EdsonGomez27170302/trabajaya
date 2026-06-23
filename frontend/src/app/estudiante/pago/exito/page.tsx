"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";

import { api } from "@/lib/api";

type State = "loading" | "success" | "pending" | "error";

export default function PagoExitoEstudiantePage() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<State>("loading");
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    async function confirm() {
      const paymentId = searchParams.get("payment_id");
      const status = searchParams.get("status");

      if (!paymentId || status === "failure") {
        setState("error");
        return;
      }
      if (status === "pending") {
        setState("pending");
        return;
      }

      try {
        const { data } = await api.get<{ status: string; upgraded: boolean }>(
          `/student/payment/confirm?payment_id=${paymentId}`
        );
        if (data.upgraded) setState("success");
        else setState(data.status === "pending" ? "pending" : "error");
      } catch {
        setState("error");
      }
    }

    confirm();
  }, [searchParams]);

  if (state === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Verificando tu pago…</p>
        </div>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-4xl">
            <Star className="size-8 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-600">
              Perfil destacado
            </p>
            <h1 className="mt-2 text-3xl font-black text-foreground">
              ¡Tu perfil ahora aparece entre los primeros!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Las empresas te verán antes que al resto en el directorio de talentos.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Link
              href="/estudiante/perfil"
              className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Ver mi perfil
            </Link>
            <Link
              href="/estudiante/dashboard"
              className="rounded-2xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
            >
              Ir al dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (state === "pending") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-4xl">⏳</div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-600">Pago en proceso</p>
            <h1 className="mt-2 text-3xl font-black text-foreground">Pago pendiente</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu pago está siendo procesado. Te notificaremos cuando se confirme.
            </p>
          </div>
          <Link href="/estudiante/dashboard" className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

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
