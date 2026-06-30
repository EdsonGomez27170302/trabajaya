"use client";

import Link from "next/link";

import { useRegisterStudentForm } from "./use-register-student-form";
import { RegisterSuccessCard } from "./register-success-card";
import { RegisterStudentAccountFields } from "./register-student-account-fields";
import { RegisterStudentAcademicFields } from "./register-student-academic-fields";
import { RegisterStudentPersonalFields } from "./register-student-personal-fields";
import { RegisterFormFooter } from "./register-form-footer";

export function RegisterStudentForm() {
  const { done, serverError, register, handleSubmit, errors, isSubmitting, onSubmit } = useRegisterStudentForm();

  if (done) {
    return (
      <RegisterSuccessCard
        title="Cuenta creada correctamente"
        message="Revisa tu correo institucional para verificar tu cuenta. Una vez verificado podrás iniciar sesión."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Registro</p>
        <h1 className="mt-2 text-3xl font-black text-foreground">Crea tu cuenta de estudiante</h1>
        <p className="mt-1 text-sm text-muted-foreground">Necesitas un correo institucional UNSCH (@unsch.edu.pe).</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
        <RegisterStudentAccountFields register={register} errors={errors} />
        <RegisterStudentAcademicFields register={register} errors={errors} />
        <RegisterStudentPersonalFields register={register} errors={errors} />
        <RegisterFormFooter
          serverError={serverError}
          isSubmitting={isSubmitting}
          submitLabel="Crear cuenta"
          submittingLabel="Creando cuenta…"
        />
      </form>

      <p className="text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">Inicia sesión</Link>
      </p>
    </div>
  );
}
