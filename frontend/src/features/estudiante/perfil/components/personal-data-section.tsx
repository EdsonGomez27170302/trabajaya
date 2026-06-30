"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { ZONES, fieldClass, errorClass, type ProfileFormData } from "./profile-form-schema";

export function PersonalDataSection({
  register,
  errors,
}: {
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
}) {
  return (
    <section className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:grid-cols-2">
      <p className="sm:col-span-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">Datos personales</p>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Nombre(s)</label>
        <input {...register("first_name")} className={fieldClass} />
        {errors.first_name && <p className={errorClass}>{errors.first_name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Apellidos</label>
        <input {...register("last_name")} className={fieldClass} />
        {errors.last_name && <p className={errorClass}>{errors.last_name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Teléfono</label>
        <input {...register("phone")} className={fieldClass} />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Zona</label>
        <select {...register("zone")} className={fieldClass}>
          <option value="">Selecciona tu zona</option>
          {ZONES.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
        {errors.zone && <p className={errorClass}>{errors.zone.message}</p>}
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-sm font-semibold text-foreground">Presentación personal</label>
        <textarea
          {...register("bio")}
          rows={3}
          className={fieldClass}
          placeholder="Cuéntale a las empresas sobre ti, qué sabes hacer y qué tipo de trabajo buscas…"
        />
        {errors.bio && <p className={errorClass}>{errors.bio.message}</p>}
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-sm font-semibold text-foreground">URL de tu CV (opcional)</label>
        <input {...register("cv_url")} placeholder="https://drive.google.com/..." className={fieldClass} />
        {errors.cv_url && <p className={errorClass}>{errors.cv_url.message}</p>}
      </div>
    </section>
  );
}
