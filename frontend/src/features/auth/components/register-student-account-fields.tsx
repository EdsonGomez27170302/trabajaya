"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { fieldClass, errClass } from "./auth-form-shared";
import { PasswordField } from "./password-field";
import type { RegisterStudentData } from "./register-student-schema";

export function RegisterStudentAccountFields({
  register,
  errors,
}: {
  register: UseFormRegister<RegisterStudentData>;
  errors: FieldErrors<RegisterStudentData>;
}) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Usuario</label>
        <input {...register("username")} placeholder="tu_usuario" className={fieldClass} />
        {errors.username && <p className={errClass}>{errors.username.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Correo personal</label>
        <input {...register("email")} type="email" placeholder="correo@ejemplo.com" className={fieldClass} />
        {errors.email && <p className={errClass}>{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className="text-sm font-semibold text-foreground">Correo institucional UNSCH</label>
        <input
          {...register("institutional_email")}
          type="email"
          placeholder="usuario@unsch.edu.pe"
          className={fieldClass}
        />
        {errors.institutional_email && <p className={errClass}>{errors.institutional_email.message}</p>}
      </div>

      <PasswordField<RegisterStudentData>
        id="password"
        label="Contraseña"
        register={register}
        error={errors.password}
      />
      <PasswordField<RegisterStudentData>
        id="confirm_password"
        label="Confirmar contraseña"
        register={register}
        error={errors.confirm_password}
      />
    </>
  );
}
