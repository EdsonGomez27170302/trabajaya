"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { fieldClass, errClass } from "./auth-form-shared";
import { PasswordField } from "./password-field";
import type { RegisterCompanyData } from "./register-company-schema";

export function RegisterCompanyAccountFields({
  register,
  errors,
}: {
  register: UseFormRegister<RegisterCompanyData>;
  errors: FieldErrors<RegisterCompanyData>;
}) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Usuario</label>
        <input {...register("username")} placeholder="tu_usuario" className={fieldClass} />
        {errors.username && <p className={errClass}>{errors.username.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-foreground">Correo</label>
        <input {...register("email")} type="email" placeholder="contacto@empresa.com" className={fieldClass} />
        {errors.email && <p className={errClass}>{errors.email.message}</p>}
      </div>

      <PasswordField<RegisterCompanyData> id="password" label="Contraseña" register={register} error={errors.password} />
      <PasswordField<RegisterCompanyData>
        id="confirm_password"
        label="Confirmar contraseña"
        register={register}
        error={errors.confirm_password}
      />
    </>
  );
}
