"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { CompanyProfile } from "@/types";

const SECTORS = [
  "Comercio retail", "Tecnología", "Gastronomía y restaurantes",
  "Servicios y logística", "Construcción", "Agro y agroindustria",
  "Educación", "Salud", "Turismo y hotelería", "Otro",
];
const ZONES = ["Huamanga", "Carmen Alto", "San Juan Bautista", "Jesús Nazareno", "Andrés Avelino Cáceres", "Centro", "Otro"];

const schema = z.object({
  company_name: z.string().min(2, "Requerido"),
  ruc: z.string().length(11, "RUC debe tener 11 dígitos"),
  sector: z.string().min(1, "Selecciona un sector"),
  description: z.string().max(500, "Máximo 500 caracteres"),
  address: z.string().min(4, "Requerido"),
  zone: z.string().min(1, "Selecciona tu zona"),
  phone: z.string().min(6, "Requerido"),
  website: z.string().url("URL inválida").or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export function CompanyProfileView() {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    api.get<CompanyProfile>("/company/profile")
      .then(({ data }) => {
        setProfile(data);
        reset({
          company_name: data.company_name,
          ruc: data.ruc,
          sector: data.sector,
          description: data.description,
          address: data.address,
          zone: data.zone,
          phone: data.phone,
          website: data.website,
        });
      })
      .catch(() => setServerError("No se pudo cargar el perfil."))
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmit(data: FormData) {
    setServerError("");
    setSaved(false);
    try {
      const { data: updated } = await api.put<CompanyProfile>("/company/profile", data);
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

  if (loading) return <p className="text-sm text-muted-foreground">Cargando perfil…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Perfil</p>
        <h1 className="mt-2 text-3xl font-black text-foreground">Perfil de empresa</h1>
        {profile && (
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{profile.sector}</span>
            <span>·</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${profile.is_verified ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
              {profile.is_verified ? "Verificada" : "Pendiente de verificación"}
            </span>
            </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Nombre de la empresa</label>
          <input {...register("company_name")} className={field} />
          {errors.company_name && <p className={errCls}>{errors.company_name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">RUC</label>
          <input {...register("ruc")} maxLength={11} className={field} />
          {errors.ruc && <p className={errCls}>{errors.ruc.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Sector</label>
          <select {...register("sector")} className={field}>
            <option value="">Selecciona un sector</option>
            {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.sector && <p className={errCls}>{errors.sector.message}</p>}
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Descripción</label>
          <textarea {...register("description")} rows={3} className={field} placeholder="Describe tu empresa…" />
          {errors.description && <p className={errCls}>{errors.description.message}</p>}
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Dirección</label>
          <input {...register("address")} className={field} />
          {errors.address && <p className={errCls}>{errors.address.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Zona</label>
          <select {...register("zone")} className={field}>
            <option value="">Selecciona tu zona</option>
            {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          {errors.zone && <p className={errCls}>{errors.zone.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Teléfono</label>
          <input {...register("phone")} className={field} />
          {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Sitio web (opcional)</label>
          <input {...register("website")} placeholder="https://miempresa.pe" className={field} />
          {errors.website && <p className={errCls}>{errors.website.message}</p>}
        </div>

        {serverError && <p className="sm:col-span-2 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{serverError}</p>}
        {saved && <p className="sm:col-span-2 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">Perfil actualizado correctamente.</p>}

        <button type="submit" disabled={isSubmitting} className="sm:col-span-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">
          {isSubmitting ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
