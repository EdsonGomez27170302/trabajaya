"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { JobFormData } from "./job-form-schema";
import { CATEGORIES, ZONES } from "./job-form-schema";

export function JobFormClassificationFields({
  register,
  errors,
}: {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Categoría</Label>
          <Select id="category" {...register("category")} defaultValue="">
            <option value="" disabled>Selecciona una categoría</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="modality">Modalidad</Label>
          <Select id="modality" {...register("modality")} defaultValue="">
            <option value="" disabled>Selecciona modalidad</option>
            <option value="presencial">Presencial</option>
            <option value="remoto">Remoto</option>
            <option value="mixto">Mixto</option>
          </Select>
          {errors.modality && <p className="text-xs text-destructive">{errors.modality.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="zone">Zona</Label>
        <Select id="zone" {...register("zone")} defaultValue="">
          <option value="" disabled>Selecciona zona</option>
          {ZONES.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </Select>
        {errors.zone && <p className="text-xs text-destructive">{errors.zone.message}</p>}
      </div>
    </>
  );
}
