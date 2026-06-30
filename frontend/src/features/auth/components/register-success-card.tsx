import Link from "next/link";

interface Props {
  title: string;
  message: string;
}

export function RegisterSuccessCard({ title, message }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">¡Listo!</p>
      <h1 className="text-3xl font-black text-foreground">{title}</h1>
      <p className="text-muted-foreground">{message}</p>
      <Link
        href="/auth/login"
        className="mt-2 inline-block rounded-2xl bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Ir al inicio de sesión
      </Link>
    </div>
  );
}
