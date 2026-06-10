import Link from "next/link";

import { valueHighlights } from "@/features/public/landing/lib/data-landing";

export function HeroSection() {
  return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            Bolsa laboral digital para estudiantes y empresas
          </p>
          <h1 className="max-w-2xl text-4xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Encuentra trabajo por horas y publica vacantes en Ayacucho, sin
            papeleo ni pérdidas de tiempo.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Conectamos estudiantes de la UNSCH con empresas locales que
            necesitan talento joven, con filtros por zona, horario y
            modalidad.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#estudiantes"
              className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Soy estudiante
            </Link>
            <Link
              href="#empresas"
              className="rounded-full border border-border bg-background px-5 py-3 font-semibold text-foreground transition hover:bg-muted"
            >
              Soy empresa
            </Link>
          </div>
        </div>

        <article className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">
            Qué resuelve
          </p>
          <h2 className="mt-3 text-2xl font-bold text-foreground">
            Una sola fuente confiable para ofertas reales.
          </h2>
          <ul className="mt-6 space-y-4 text-muted-foreground">
            {valueHighlights.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
