"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { StudentProfile } from "@/types";

const ZONES = ["Huamanga", "Carmen Alto", "San Juan Bautista", "Jesús Nazareno", "Andrés Avelino Cáceres", "Centro", "Otro"];

const schema = z.object({
  first_name: z.string().min(1, "Requerido"),
  last_name: z.string().min(1, "Requerido"),
  phone: z.string().min(6, "Requerido"),
  bio: z.string().max(500, "Máximo 500 caracteres"),
  cv_url: z.string().url("URL inválida").or(z.literal("")),
  zone: z.string().min(1, "Selecciona tu zona"),
  is_available: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function StudentProfileView() {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    api.get<StudentProfile>("/student/profile")
      .then(({ data }) => {
        setProfile(data);
        reset({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          bio: data.bio,
          cv_url: data.cv_url,
          zone: data.zone,
          is_available: data.is_available,
        });
      })
      .catch(() => setServerError("No se pudo cargar el perfil."))
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmit(data: FormData) {
    setServerError("");
    setSaved(false);
    try {
      const { data: updated } = await api.put<StudentProfile>("/student/profile", data);
      setProfile(updated);
      updateProfile(updated);
      setSaved(true);
    } catch {
      setServerError("No se pudo guardar. Intenta de nuevo.");
    }
  }

  const field =
    "rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";
  const errCls = "text-xs text-red-500 mt-0.5";

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando perfil…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Perfil</p>
        <h1 className="mt-2 text-3xl font-black text-foreground">Mi perfil</h1>
        {profile && (
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.faculty} · {profile.career} · Semestre {profile.semester}
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:grid-cols-2"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Nombre(s)</label>
          <input {...register("first_name")} className={field} />
          {errors.first_name && <p className={errCls}>{errors.first_name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Apellidos</label>
          <input {...register("last_name")} className={field} />
          {errors.last_name && <p className={errCls}>{errors.last_name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Teléfono</label>
          <input {...register("phone")} className={field} />
          {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Zona</label>
          <select {...register("zone")} className={field}>
            <option value="">Selecciona tu zona</option>
            {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          {errors.zone && <p className={errCls}>{errors.zone.message}</p>}
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Biografía / presentación</label>
          <textarea {...register("bio")} rows={3} className={field} placeholder="Cuéntale a las empresas sobre ti…" />
          {errors.bio && <p className={errCls}>{errors.bio.message}</p>}
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">URL de tu CV (opcional)</label>
          <input {...register("cv_url")} placeholder="https://drive.google.com/..." className={field} />
          {errors.cv_url && <p className={errCls}>{errors.cv_url.message}</p>}
        </div>

        <div className="flex items-center gap-3 sm:col-span-2">
          <input {...register("is_available")} type="checkbox" id="is_available" className="h-4 w-4 rounded accent-primary" />
          <label htmlFor="is_available" className="text-sm text-foreground">
            Estoy disponible para trabajar
          </label>
        </div>

        {serverError && (
          <p className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{serverError}</p>
        )}
        {saved && (
          <p className="sm:col-span-2 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">
            Perfil actualizado correctamente.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="sm:col-span-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {isSubmitting ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
