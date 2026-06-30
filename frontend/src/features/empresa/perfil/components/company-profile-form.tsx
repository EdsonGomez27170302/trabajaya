"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { CompanyProfileFormData } from "./company-profile-schema";
import { CompanyProfileFields } from "./company-profile-fields";

export function CompanyProfileForm({
  register,
  errors,
  serverError,
  saved,
  isSubmitting,
  onSubmit,
}: {
  register: UseFormRegister<CompanyProfileFormData>;
  errors: FieldErrors<CompanyProfileFormData>;
  serverError: string;
  saved: boolean;
  isSubmitting: boolean;
  onSubmit: React.FormEventHandler;
}) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:grid-cols-2">
      <CompanyProfileFields register={register} errors={errors} />

      {serverError && <p className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{serverError}</p>}
      {saved && <p className="sm:col-span-2 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">Perfil actualizado correctamente.</p>}

      <button type="submit" disabled={isSubmitting} className="sm:col-span-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">
        {isSubmitting ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
