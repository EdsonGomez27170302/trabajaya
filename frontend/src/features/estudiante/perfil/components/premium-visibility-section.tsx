"use client";

import { Star } from "lucide-react";

export function PremiumVisibilitySection({
  isFeatured,
  onBoost,
}: {
  isFeatured: boolean;
  onBoost: () => void;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-1">Visibilidad premium</p>

      {isFeatured ? (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-700/60 dark:bg-amber-950/20">
          <Star className="size-5 fill-amber-500 text-amber-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Tu perfil está destacado</p>
            <p className="text-xs text-muted-foreground">Apareces entre los primeros en el directorio de talentos.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Destaca tu perfil y aparece primero en el directorio. Las empresas te verán antes que al resto.
          </p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Star className="size-4 text-amber-500 shrink-0" /> Apareces en la parte superior del directorio
            </li>
            <li className="flex items-center gap-2">
              <Star className="size-4 text-amber-500 shrink-0" /> Badge dorado &quot;Destacado&quot; visible para
              empresas
            </li>
            <li className="flex items-center gap-2">
              <Star className="size-4 text-amber-500 shrink-0" /> Mayor probabilidad de ser contactado
            </li>
          </ul>
          <button
            type="button"
            onClick={onBoost}
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            <Star className="size-4 fill-white" />
            {`Destacar mi perfil — S/ ${(5.0).toFixed(2)}`}
          </button>
          <p className="text-xs text-muted-foreground">Pago único mediante MercadoPago.</p>
        </div>
      )}
    </section>
  );
}
