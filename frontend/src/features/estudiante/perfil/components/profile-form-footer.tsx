"use client";

export function ProfileFormFooter({
  serverError,
  saved,
  isSubmitting,
}: {
  serverError: string;
  saved: boolean;
  isSubmitting: boolean;
}) {
  return (
    <>
      {serverError && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{serverError}</p>}
      {saved && (
        <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">Perfil actualizado correctamente.</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
      >
        {isSubmitting ? "Guardando…" : "Guardar cambios"}
      </button>
    </>
  );
}
