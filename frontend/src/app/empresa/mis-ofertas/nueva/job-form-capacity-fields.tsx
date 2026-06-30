"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { JobFormData } from "./job-form-schema";

export function JobFormCapacityFields({
  register,
  errors,
}: {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="hours_per_week">Horas por semana</Label>
        <Input
          id="hours_per_week"
          type="number"
          min={1}
          max={60}
          {...register("hours_per_week", { valueAsNumber: true })}
          placeholder="Ej. 20"
        />
        {errors.hours_per_week && <p className="text-xs text-destructive">{errors.hours_per_week.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="vacancies">Número de vacantes</Label>
        <Input id="vacancies" type="number" min={1} {...register("vacancies", { valueAsNumber: true })} placeholder="Ej. 2" />
        {errors.vacancies && <p className="text-xs text-destructive">{errors.vacancies.message}</p>}
      </div>
    </div>
  );
}
