"use client";

import { useCompanyProfileView } from "./use-company-profile-view";
import { CompanyProfileHeader } from "./company-profile-header";
import { CompanyProfileForm } from "./company-profile-form";

export function CompanyProfileView() {
  const { profile, loading, saved, serverError, register, handleSubmit, errors, isSubmitting, onSubmit } =
    useCompanyProfileView();

  if (loading) return <p className="text-sm text-muted-foreground">Cargando perfil…</p>;

  return (
    <div className="flex flex-col gap-6">
      <CompanyProfileHeader profile={profile} />
      <CompanyProfileForm
        register={register}
        errors={errors}
        serverError={serverError}
        saved={saved}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
      />
    </div>
  );
}
