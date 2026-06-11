"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORIES = [
  "Tecnología",
  "Comercio y ventas",
  "Gastronomía",
  "Educación y tutorías",
  "Salud",
  "Logística y transporte",
  "Construcción",
  "Turismo y hotelería",
  "Administración",
  "Agro y agroindustria",
  "Otro",
];

const ZONES = [
  "Huamanga",
  "Carmen Alto",
  "San Juan Bautista",
  "Jesús Nazareno",
  "Andrés Avelino Cáceres",
  "Centro",
  "Otro",
];

const schema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  requirements: z.string().min(10, "Ingresa al menos un requisito"),
  category: z.string().min(1, "Selecciona una categoría"),
  modality: z.enum(["presencial", "remoto", "mixto"]),
  zone: z.string().min(1, "Selecciona una zona"),
  salary: z.number({ message: "El salario debe ser mayor a 0" }).min(1, "El salario debe ser mayor a 0"),
  salary_type: z.enum(["por_hora", "mensual"]),
  hours_per_week: z.number({ message: "Indica las horas semanales" }).min(1).max(60, "Máximo 60 horas"),
  vacancies: z.number({ message: "Debe haber al menos 1 vacante" }).min(1),
  expires_at: z.string().min(1, "Selecciona la fecha de expiración"),
});

type FormData = z.infer<typeof schema>;

export default function NuevaOfertaPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError("");
    try {
      await api.post("/company/jobs", data);
      router.push("/empresa/mis-ofertas");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "No se pudo crear la oferta. Intenta de nuevo.";
      setServerError(msg);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/empresa/mis-ofertas"
          className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Volver a mis ofertas"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            Empresa
          </p>
          <h1 className="text-2xl font-black text-foreground">Nueva oferta</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la vacante</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Título */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Título del puesto</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Ej. Asistente de ventas"
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe las responsabilidades del puesto..."
                className="min-h-[120px]"
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Requisitos */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="requirements">Requisitos</Label>
              <Textarea
                id="requirements"
                {...register("requirements")}
                placeholder="Ej. Conocimientos en Excel, disponibilidad de lunes a viernes..."
              />
              {errors.requirements && (
                <p className="text-xs text-destructive">{errors.requirements.message}</p>
              )}
            </div>

            {/* Categoría y Modalidad */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category">Categoría</Label>
                <Select id="category" {...register("category")} defaultValue="">
                  <option value="" disabled>Selecciona una categoría</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="modality">Modalidad</Label>
                <Select id="modality" {...register("modality")} defaultValue="">
                  <option value="" disabled>Selecciona modalidad</option>
                  <option value="presencial">Presencial</option>
                  <option value="remoto">Remoto</option>
                  <option value="mixto">Mixto</option>
                </Select>
                {errors.modality && (
                  <p className="text-xs text-destructive">{errors.modality.message}</p>
                )}
              </div>
            </div>

            {/* Zona */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="zone">Zona</Label>
              <Select id="zone" {...register("zone")} defaultValue="">
                <option value="" disabled>Selecciona zona</option>
                {ZONES.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </Select>
              {errors.zone && (
                <p className="text-xs text-destructive">{errors.zone.message}</p>
              )}
            </div>

            {/* Salario */}
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
                {errors.salary && (
                  <p className="text-xs text-destructive">{errors.salary.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="salary_type">Tipo de salario</Label>
                <Select id="salary_type" {...register("salary_type")} defaultValue="">
                  <option value="" disabled>Selecciona tipo</option>
                  <option value="mensual">Mensual</option>
                  <option value="por_hora">Por hora</option>
                </Select>
                {errors.salary_type && (
                  <p className="text-xs text-destructive">{errors.salary_type.message}</p>
                )}
              </div>
            </div>

            {/* Horas semanales y Vacantes */}
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
                {errors.hours_per_week && (
                  <p className="text-xs text-destructive">{errors.hours_per_week.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="vacancies">Número de vacantes</Label>
                <Input
                  id="vacancies"
                  type="number"
                  min={1}
                  {...register("vacancies", { valueAsNumber: true })}
                  placeholder="Ej. 2"
                />
                {errors.vacancies && (
                  <p className="text-xs text-destructive">{errors.vacancies.message}</p>
                )}
              </div>
            </div>

            {/* Fecha de expiración */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="expires_at">Fecha de expiración</Label>
              <Input
                id="expires_at"
                type="date"
                {...register("expires_at")}
              />
              {errors.expires_at && (
                <p className="text-xs text-destructive">{errors.expires_at.message}</p>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <p className="rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
                {serverError}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/empresa/mis-ofertas")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Publicando…" : "Publicar oferta"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
