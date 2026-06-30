"use client";

import Link from "next/link";

import { useRegisterCompanyForm } from "./use-register-company-form";
import { RegisterSuccessCard } from "./register-success-card";
import { RegisterCompanyAccountFields } from "./register-company-account-fields";
import { RegisterCompanyFields } from "./register-company-fields";
import { RegisterFormFooter } from "./register-form-footer";

export function RegisterCompanyForm() {
  const { done, serverError, register, handleSubmit, errors, isSubmitting, onSubmit } = useRegisterCompanyForm();

  if (done) {
    return (
      <RegisterSuccessCard
        title="Empresa registrada"
        message="Tu cuenta fue creada. Un administrador verificará tu empresa para que puedas publicar ofertas. Una vez verificado, inicia sesión con tus credenciales."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Registro</p>
        <h1 className="mt-2 text-3xl font-black text-foreground">Registra tu empresa</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Un administrador verificará tu empresa antes de que puedas publicar ofertas.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
        <RegisterCompanyAccountFields register={register} errors={errors} />
        <RegisterCompanyFields register={register} errors={errors} />
        <RegisterFormFooter
          serverError={serverError}
          isSubmitting={isSubmitting}
          submitLabel="Registrar empresa"
          submittingLabel="Registrando empresa…"
        />
      </form>

      <p className="text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">Inicia sesión</Link>
      </p>
    </div>
  );
}
