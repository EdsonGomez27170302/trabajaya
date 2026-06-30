"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { JobFormData } from "./job-form-schema";

export function JobFormBasicFields({
  register,
  errors,
}: {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
}) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título del puesto</Label>
        <Input id="title" {...register("title")} placeholder="Ej. Asistente de ventas" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Describe las responsabilidades del puesto..."
          className="min-h-30"
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="requirements">Requisitos</Label>
        <Textarea
          id="requirements"
          {...register("requirements")}
          placeholder="Ej. Conocimientos en Excel, disponibilidad de lunes a viernes..."
        />
        {errors.requirements && <p className="text-xs text-destructive">{errors.requirements.message}</p>}
      </div>
    </>
  );
}
