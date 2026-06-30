"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { fieldClass, errClass } from "./auth-form-shared";
import { FACULTIES, type RegisterStudentData } from "./register-student-schema";

export function RegisterStudentAcademicFields({
  register,
  errors,
}: {
  register: UseFormRegister<RegisterStudentData>;
  errors: FieldErrors<RegisterStudentData>;
}) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Nombre(s)</label>
        <input {...register("first_name")} placeholder="Nombre" className={fieldClass} />
        {errors.first_name && <p className={errClass}>{errors.first_name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Apellidos</label>
        <input {...register("last_name")} placeholder="Apellidos" className={fieldClass} />
        {errors.last_name && <p className={errClass}>{errors.last_name.message}</p>}
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-sm font-semibold text-foreground">Facultad</label>
        <select {...register("faculty")} className={fieldClass}>
          <option value="">Selecciona tu facultad</option>
          {FACULTIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        {errors.faculty && <p className={errClass}>{errors.faculty.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Carrera</label>
        <input {...register("career")} placeholder="Ej: Administración de Empresas" className={fieldClass} />
        {errors.career && <p className={errClass}>{errors.career.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Semestre actual</label>
        <input
          {...register("semester", { valueAsNumber: true })}
          type="number"
          min={1}
          max={12}
          placeholder="1 – 12"
          className={fieldClass}
        />
        {errors.semester && <p className={errClass}>{errors.semester.message}</p>}
      </div>
    </>
  );
}
