"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { COMPANY_SECTORS, fieldClass, errClass, type CompanyProfileFormData } from "./company-profile-schema";
import { CompanyContactFields } from "./company-contact-fields";

export function CompanyProfileFields({
  register,
  errors,
}: {
  register: UseFormRegister<CompanyProfileFormData>;
  errors: FieldErrors<CompanyProfileFormData>;
}) {
  return (
    <>
      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-sm font-semibold text-foreground">Nombre de la empresa</label>
        <input {...register("company_name")} className={fieldClass} />
        {errors.company_name && <p className={errClass}>{errors.company_name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">RUC</label>
        <input {...register("ruc")} maxLength={11} className={fieldClass} />
        {errors.ruc && <p className={errClass}>{errors.ruc.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Sector</label>
        <select {...register("sector")} className={fieldClass}>
          <option value="">Selecciona un sector</option>
          {COMPANY_SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.sector && <p className={errClass}>{errors.sector.message}</p>}
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-sm font-semibold text-foreground">Descripción</label>
        <textarea {...register("description")} rows={3} className={fieldClass} placeholder="Describe tu empresa…" />
        {errors.description && <p className={errClass}>{errors.description.message}</p>}
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-sm font-semibold text-foreground">Dirección</label>
        <input {...register("address")} className={fieldClass} />
        {errors.address && <p className={errClass}>{errors.address.message}</p>}
      </div>

      <CompanyContactFields register={register} errors={errors} />
    </>
  );
}
