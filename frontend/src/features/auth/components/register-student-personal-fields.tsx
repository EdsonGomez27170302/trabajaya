"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { fieldClass, errClass, AUTH_ZONES } from "./auth-form-shared";
import type { RegisterStudentData } from "./register-student-schema";

export function RegisterStudentPersonalFields({
  register,
  errors,
}: {
  register: UseFormRegister<RegisterStudentData>;
  errors: FieldErrors<RegisterStudentData>;
}) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Teléfono</label>
        <input {...register("phone")} placeholder="9XXXXXXXX" className={fieldClass} />
        {errors.phone && <p className={errClass}>{errors.phone.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Zona de residencia</label>
        <select {...register("zone")} className={fieldClass}>
          <option value="">Selecciona tu zona</option>
          {AUTH_ZONES.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
        {errors.zone && <p className={errClass}>{errors.zone.message}</p>}
      </div>
    </>
  );
}
