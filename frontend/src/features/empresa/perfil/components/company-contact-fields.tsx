"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { COMPANY_ZONES, fieldClass, errClass, type CompanyProfileFormData } from "./company-profile-schema";

export function CompanyContactFields({
  register,
  errors,
}: {
  register: UseFormRegister<CompanyProfileFormData>;
  errors: FieldErrors<CompanyProfileFormData>;
}) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Zona</label>
        <select {...register("zone")} className={fieldClass}>
          <option value="">Selecciona tu zona</option>
          {COMPANY_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>
        {errors.zone && <p className={errClass}>{errors.zone.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Teléfono</label>
        <input {...register("phone")} className={fieldClass} />
        {errors.phone && <p className={errClass}>{errors.phone.message}</p>}
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-sm font-semibold text-foreground">Sitio web (opcional)</label>
        <input {...register("website")} placeholder="https://miempresa.pe" className={fieldClass} />
        {errors.website && <p className={errClass}>{errors.website.message}</p>}
      </div>
    </>
  );
}
