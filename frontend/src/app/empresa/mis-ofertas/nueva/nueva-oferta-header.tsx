import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function NuevaOfertaHeader() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <Link
        href="/empresa/mis-ofertas"
        className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
        aria-label="Volver a mis ofertas"
      >
        <ChevronLeft className="size-5" />
      </Link>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Empresa</p>
        <h1 className="text-2xl font-black text-foreground">Nueva oferta</h1>
      </div>
    </div>
  );
}
