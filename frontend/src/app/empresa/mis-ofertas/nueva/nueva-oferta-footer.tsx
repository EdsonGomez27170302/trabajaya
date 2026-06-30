"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { JobFormData } from "./job-form-schema";

export function NuevaOfertaFooter({
  register,
  errors,
  serverError,
  isSubmitting,
  router,
}: {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
  serverError: string;
  isSubmitting: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="expires_at">Fecha de expiración</Label>
        <Input id="expires_at" type="date" {...register("expires_at")} />
        {errors.expires_at && <p className="text-xs text-destructive">{errors.expires_at.message}</p>}
      </div>

      {serverError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">{serverError}</p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.push("/empresa/mis-ofertas")}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Publicando…" : "Publicar oferta"}
        </Button>
      </div>
    </>
  );
}
