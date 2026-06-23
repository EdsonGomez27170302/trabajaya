"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { api } from "@/lib/api";

type State = "loading" | "success" | "pending" | "error";

export default function PagoExitoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<State>("loading");
  const [jobId, setJobId] = useState<number | null>(null);
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
        const { data } = await api.get<{ status: string; upgraded: boolean; job_id?: number }>(
          `/company/payment/confirm?payment_id=${paymentId}`
        );
        if (data.upgraded) {
          if (data.job_id) setJobId(data.job_id);
          setState("success");
        } else {
          setState(data.status === "pending" ? "pending" : "error");
        }
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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-4xl">
            ✓
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
              Oferta destacada
            </p>
            <h1 className="mt-2 text-3xl font-black text-foreground">
              ¡Tu oferta ahora aparece entre las primeras!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              La oferta {jobId ? `#${jobId}` : ""} ya está destacada y llegará a más
              estudiantes de la UNSCH.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Link
              href="/empresa/mis-ofertas"
              className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Ver mis ofertas
            </Link>
            <Link
              href="/empresa/dashboard"
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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-4xl">
            ⏳
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-600">
              Pago en proceso
            </p>
            <h1 className="mt-2 text-3xl font-black text-foreground">
              Pago pendiente
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu pago está siendo procesado. Te notificaremos cuando se
              confirme. Puede tardar unos minutos.
            </p>
          </div>
          <Link
            href="/empresa/dashboard"
            className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-4xl">
          ✕
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-500">
            Error
          </p>
          <h1 className="mt-2 text-3xl font-black text-foreground">
            No se pudo confirmar el pago
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Si realizaste el pago pero no se activó el plan, contacta a soporte
            con tu número de transacción.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <button
            onClick={() => router.push("/empresa/perfil")}
            className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/empresa/dashboard"
            className="rounded-2xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
