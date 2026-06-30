"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { JobFormData } from "./job-form-schema";

export function JobFormSalaryFields({
  register,
  errors,
}: {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="salary">Salario (S/)</Label>
        <Input
          id="salary"
          type="number"
          min={1}
          step={0.5}
          {...register("salary", { valueAsNumber: true })}
          placeholder="Ej. 1200"
        />
        {errors.salary && <p className="text-xs text-destructive">{errors.salary.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="salary_type">Tipo de salario</Label>
        <Select id="salary_type" {...register("salary_type")} defaultValue="">
          <option value="" disabled>Selecciona tipo</option>
          <option value="mensual">Mensual</option>
          <option value="por_hora">Por hora</option>
        </Select>
        {errors.salary_type && <p className="text-xs text-destructive">{errors.salary_type.message}</p>}
      </div>
    </div>
  );
}
