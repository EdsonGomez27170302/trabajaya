"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNuevaOferta } from "./use-nueva-oferta";
import { NuevaOfertaHeader } from "./nueva-oferta-header";
import { JobFormBasicFields } from "./job-form-basic-fields";
import { JobFormClassificationFields } from "./job-form-class-fields";
import { JobFormSalaryFields } from "./job-form-salary-fields";
import { JobFormCapacityFields } from "./job-form-capacity-fields";
import { JobFormContactFields } from "./job-form-contact-fields";
import { NuevaOfertaFooter } from "./nueva-oferta-footer";

export default function NuevaOfertaPage() {
  const { router, serverError, register, handleSubmit, errors, isSubmitting, onSubmit } = useNuevaOferta();

  return (
    <div className="mx-auto max-w-2xl">
      <NuevaOfertaHeader />

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la vacante</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <JobFormBasicFields register={register} errors={errors} />
            <JobFormClassificationFields register={register} errors={errors} />
            <JobFormSalaryFields register={register} errors={errors} />
            <JobFormCapacityFields register={register} errors={errors} />
            <JobFormContactFields register={register} errors={errors} />
            <NuevaOfertaFooter
              register={register}
              errors={errors}
              serverError={serverError}
              isSubmitting={isSubmitting}
              router={router}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
