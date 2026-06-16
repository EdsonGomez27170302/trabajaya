import Link from "next/link";

export function ForCompaniesSection() {
  return (
    <article
      id="empresas"
      className="rounded-3xl bg-accent p-6 text-accent-foreground shadow-sm"
    >
      <p className="text-sm uppercase tracking-[0.3em] text-accent-foreground/70">
        Para empresas
      </p>
      <h3 className="mt-3 text-2xl font-bold">
        Publica ofertas y filtra candidatos reales
      </h3>
      <p className="mt-4 text-accent-foreground/90">
        Centraliza tu búsqueda, destaca vacantes y mejora tu alcance con un
        canal universitario.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/auth/register/empresa"
          className="inline-flex rounded-full bg-background px-5 py-3 font-semibold text-foreground transition hover:bg-muted"
        >
          Registrar mi empresa
        </Link>
        <Link
          href="#talentos"
          className="inline-flex rounded-full border border-accent-foreground/20 px-5 py-3 font-semibold text-accent-foreground transition hover:bg-accent-foreground/10"
        >
          Ver talentos disponibles →
        </Link>
      </div>
    </article>
  );
}
