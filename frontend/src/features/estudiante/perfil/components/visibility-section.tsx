"use client";

import type { UseFormRegister } from "react-hook-form";

import type { ProfileFormData } from "./profile-form-schema";

export function VisibilitySection({ register }: { register: UseFormRegister<ProfileFormData> }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">Visibilidad en el directorio</p>
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3">
        <input
          {...register("is_available")}
          type="checkbox"
          id="is_available"
          className="mt-0.5 h-4 w-4 rounded accent-primary shrink-0"
        />
        <div>
          <label htmlFor="is_available" className="text-sm font-semibold text-foreground cursor-pointer">
            Mostrarme en el directorio de talentos
          </label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Las empresas podrán ver tu perfil, carrera, disponibilidad y CV en la página principal.
          </p>
        </div>
      </div>
    </section>
  );
}
