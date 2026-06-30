"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { fieldClass, errClass, AUTH_ZONES } from "./auth-form-shared";
import { SECTORS, type RegisterCompanyData } from "./register-company-schema";

export function RegisterCompanyFields({
  register,
  errors,
}: {
  register: UseFormRegister<RegisterCompanyData>;
  errors: FieldErrors<RegisterCompanyData>;
}) {
  return (
    <>
      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-sm font-semibold text-foreground">Nombre de la empresa</label>
        <input {...register("company_name")} placeholder="Nombre comercial" className={fieldClass} />
        {errors.company_name && <p className={errClass}>{errors.company_name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">RUC (11 dígitos)</label>
        <input {...register("ruc")} placeholder="20XXXXXXXXX" maxLength={11} className={fieldClass} />
        {errors.ruc && <p className={errClass}>{errors.ruc.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Sector</label>
        <select {...register("sector")} className={fieldClass}>
          <option value="">Selecciona un sector</option>
          {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.sector && <p className={errClass}>{errors.sector.message}</p>}
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-sm font-semibold text-foreground">Dirección</label>
        <input {...register("address")} placeholder="Jr. Lima 123, Ayacucho" className={fieldClass} />
        {errors.address && <p className={errClass}>{errors.address.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Zona</label>
        <select {...register("zone")} className={fieldClass}>
          <option value="">Selecciona tu zona</option>
          {AUTH_ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>
        {errors.zone && <p className={errClass}>{errors.zone.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Teléfono</label>
        <input {...register("phone")} placeholder="066-XXXXXX" className={fieldClass} />
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
