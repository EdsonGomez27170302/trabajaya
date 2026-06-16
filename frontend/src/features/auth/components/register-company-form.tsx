"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import { Eye, EyeOff } from "lucide-react";

import { api } from "@/lib/api";

const SECTORS = [
  "Comercio retail",
  "Tecnología",
  "Gastronomía y restaurantes",
  "Servicios y logística",
  "Construcción",
  "Agro y agroindustria",
  "Educación",
  "Salud",
  "Turismo y hotelería",
  "Otro",
];

const ZONES = ["Huamanga", "Carmen Alto", "San Juan Bautista", "Jesús Nazareno", "Andrés Avelino Cáceres", "Centro", "Otro"];

const schema = z
  .object({
    username: z.string().min(3, "Mínimo 3 caracteres"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirm_password: z.string(),
    company_name: z.string().min(2, "Nombre requerido"),
    ruc: z.string().length(11, "El RUC debe tener 11 dígitos"),
    sector: z.string().min(1, "Selecciona un sector"),
    address: z.string().min(4, "Dirección requerida"),
    zone: z.string().min(1, "Selecciona tu zona"),
    phone: z.string().min(6, "Teléfono requerido"),
    website: z.string().url("URL inválida").or(z.literal("")),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

export function RegisterCompanyForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError("");
    try {
      await api.post("/auth/register/company", {
        username: data.username,
        email: data.email,
        password: data.password,
        company_name: data.company_name,
        ruc: data.ruc,
        sector: data.sector,
        address: data.address,
        zone: data.zone,
        phone: data.phone,
        website: data.website,
      });
      setDone(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Error al registrarse. Intenta de nuevo.";
      setServerError(msg);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          ¡Listo!
        </p>
        <h1 className="text-3xl font-black text-foreground">
          Empresa registrada
        </h1>
        <p className="text-muted-foreground">
          Tu cuenta fue creada. Un administrador verificará tu empresa para que
          puedas publicar ofertas. Una vez verificado, inicia sesión con tus
          credenciales.
        </p>
        <Link
          href="/auth/login"
          className="mt-2 inline-block rounded-2xl bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  const field =
    "rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";
  const errCls = "text-xs text-red-500 mt-0.5";

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          Registro
        </p>
        <h1 className="mt-2 text-3xl font-black text-foreground">
          Registra tu empresa
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Un administrador verificará tu empresa antes de que puedas publicar
          ofertas.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Usuario</label>
          <input {...register("username")} placeholder="tu_usuario" className={field} />
          {errors.username && <p className={errCls}>{errors.username.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Correo</label>
          <input {...register("email")} type="email" placeholder="contacto@empresa.com" className={field} />
          {errors.email && <p className={errCls}>{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Contraseña</label>
          <div className="relative">
            <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className={`${field} pr-10`} />
            <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && <p className={errCls}>{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Confirmar contraseña</label>
          <div className="relative">
            <input {...register("confirm_password")} type={showConfirm ? "text" : "password"} placeholder="••••••••" className={`${field} pr-10`} />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirm_password && <p className={errCls}>{errors.confirm_password.message}</p>}
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Nombre de la empresa</label>
          <input {...register("company_name")} placeholder="Nombre comercial" className={field} />
          {errors.company_name && <p className={errCls}>{errors.company_name.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">RUC (11 dígitos)</label>
          <input {...register("ruc")} placeholder="20XXXXXXXXX" maxLength={11} className={field} />
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
          <label className="text-sm font-semibold text-foreground">Dirección</label>
          <input {...register("address")} placeholder="Jr. Lima 123, Ayacucho" className={field} />
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
          <input {...register("phone")} placeholder="066-XXXXXX" className={field} />
          {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Sitio web (opcional)</label>
          <input {...register("website")} placeholder="https://miempresa.pe" className={field} />
          {errors.website && <p className={errCls}>{errors.website.message}</p>}
        </div>

        {serverError && (
          <div className="sm:col-span-2">
            <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="sm:col-span-2 mt-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {isSubmitting ? "Registrando empresa…" : "Registrar empresa"}
        </button>
      </form>

      <p className="text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
