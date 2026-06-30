"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { JobFormData } from "./job-form-schema";

export function JobFormContactFields({
  register,
  errors,
}: {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-4 flex flex-col gap-4">
      <p className="text-sm font-semibold text-foreground">Información de contacto</p>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact_phone">
          Teléfono de contacto <span className="text-destructive">*</span>
        </Label>
        <Input id="contact_phone" type="tel" {...register("contact_phone")} placeholder="Ej. 966 123 456" />
        {errors.contact_phone && <p className="text-xs text-destructive">{errors.contact_phone.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact_email">
          Correo de contacto <span className="text-muted-foreground text-xs">(opcional)</span>
        </Label>
        <Input
          id="contact_email"
          type="email"
          {...register("contact_email")}
          placeholder="Ej. rrhh@miempresa.com"
        />
        {errors.contact_email && <p className="text-xs text-destructive">{errors.contact_email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact_address">
          Dirección <span className="text-muted-foreground text-xs">(opcional)</span>
        </Label>
        <Input id="contact_address" {...register("contact_address")} placeholder="Ej. Jr. Lima 123, Huamanga" />
      </div>
    </div>
  );
}
