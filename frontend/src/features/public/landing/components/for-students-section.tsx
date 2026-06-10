import Link from "next/link";

export function ForStudentsSection() {
  return (
    <article
      id="estudiantes"
      className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-sm"
    >
      <p className="text-sm uppercase tracking-[0.3em] text-primary-foreground/70">
        Para estudiantes
      </p>
      <h3 className="mt-3 text-2xl font-bold">
        Publica tu perfil y recibe vacantes compatibles
      </h3>
      <p className="mt-4 text-primary-foreground/90">
        Lleva tu experiencia, disponibilidad y zona para que las empresas te
        encuentren rápido.
      </p>
      <Link
        href="/auth/register/estudiante"
        className="mt-6 inline-flex rounded-full bg-background px-5 py-3 font-semibold text-foreground transition hover:bg-muted"
      >
        Crear cuenta de estudiante
      </Link>
    </article>
  );
}
