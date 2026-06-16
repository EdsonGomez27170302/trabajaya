"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import { Eye, EyeOff } from "lucide-react";

import { api } from "@/lib/api";

const FACULTIES = [
  "Ciencias Económicas, Administrativas y Contables",
  "Ciencias Agrarias",
  "Ciencias Biológicas",
  "Ciencias de la Educación",
  "Ciencias Jurídicas y Políticas",
  "Ciencias Sociales",
  "Derecho y Ciencias Políticas",
  "Enfermería",
  "Ingeniería de Minas, Geología y Civil",
  "Ingeniería Química y Metalurgia",
  "Medicina Humana",
  "Obstetricia",
];

const ZONES = ["Huamanga", "Carmen Alto", "San Juan Bautista", "Jesús Nazareno", "Andrés Avelino Cáceres", "Centro", "Otro"];

const schema = z
  .object({
    username: z.string().min(3, "Mínimo 3 caracteres"),
    email: z.string().email("Correo inválido"),
    institutional_email: z
      .string()
      .email("Correo inválido")
      .refine((v) => v.endsWith("@unsch.edu.pe"), {
        message: "Debe terminar en @unsch.edu.pe",
      }),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirm_password: z.string(),
    first_name: z.string().min(1, "Requerido"),
    last_name: z.string().min(1, "Requerido"),
    faculty: z.string().min(1, "Selecciona tu facultad"),
    career: z.string().min(2, "Ingresa tu carrera"),
    semester: z.number().int().min(1, "Mínimo 1").max(12, "Máximo 12"),
    phone: z.string().min(6, "Teléfono requerido"),
    zone: z.string().min(1, "Selecciona tu zona"),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

export function RegisterStudentForm() {
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
      await api.post("/auth/register/student", {
        username: data.username,
        email: data.email,
        institutional_email: data.institutional_email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        faculty: data.faculty,
        career: data.career,
        semester: data.semester,
        phone: data.phone,
        zone: data.zone,
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
          Cuenta creada correctamente
        </h1>
        <p className="text-muted-foreground">
          Revisa tu correo institucional para verificar tu cuenta. Una vez
          verificado podrás iniciar sesión.
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
  const err = "text-xs text-red-500 mt-0.5";

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          Registro
        </p>
        <h1 className="mt-2 text-3xl font-black text-foreground">
          Crea tu cuenta de estudiante
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Necesitas un correo institucional UNSCH (@unsch.edu.pe).
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
        {/* Username */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Usuario</label>
          <input {...register("username")} placeholder="tu_usuario" className={field} />
          {errors.username && <p className={err}>{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Correo personal</label>
          <input {...register("email")} type="email" placeholder="correo@ejemplo.com" className={field} />
          {errors.email && <p className={err}>{errors.email.message}</p>}
        </div>

        {/* Institutional email */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Correo institucional UNSCH</label>
          <input {...register("institutional_email")} type="email" placeholder="usuario@unsch.edu.pe" className={field} />
          {errors.institutional_email && <p className={err}>{errors.institutional_email.message}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Contraseña</label>
          <div className="relative">
            <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className={`${field} pr-10`} />
            <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && <p className={err}>{errors.password.message}</p>}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Confirmar contraseña</label>
          <div className="relative">
            <input {...register("confirm_password")} type={showConfirm ? "text" : "password"} placeholder="••••••••" className={`${field} pr-10`} />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirm_password && <p className={err}>{errors.confirm_password.message}</p>}
        </div>

        {/* First name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Nombre(s)</label>
          <input {...register("first_name")} placeholder="Nombre" className={field} />
          {errors.first_name && <p className={err}>{errors.first_name.message}</p>}
        </div>

        {/* Last name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Apellidos</label>
          <input {...register("last_name")} placeholder="Apellidos" className={field} />
          {errors.last_name && <p className={err}>{errors.last_name.message}</p>}
        </div>

        {/* Faculty */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Facultad</label>
          <select {...register("faculty")} className={field}>
            <option value="">Selecciona tu facultad</option>
            {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          {errors.faculty && <p className={err}>{errors.faculty.message}</p>}
        </div>

        {/* Career */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Carrera</label>
          <input {...register("career")} placeholder="Ej: Administración de Empresas" className={field} />
          {errors.career && <p className={err}>{errors.career.message}</p>}
        </div>

        {/* Semester */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Semestre actual</label>
          <input {...register("semester", { valueAsNumber: true })} type="number" min={1} max={12} placeholder="1 – 12" className={field} />
          {errors.semester && <p className={err}>{errors.semester.message}</p>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Teléfono</label>
          <input {...register("phone")} placeholder="9XXXXXXXX" className={field} />
          {errors.phone && <p className={err}>{errors.phone.message}</p>}
        </div>

        {/* Zone */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-foreground">Zona de residencia</label>
          <select {...register("zone")} className={field}>
            <option value="">Selecciona tu zona</option>
            {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
          {errors.zone && <p className={err}>{errors.zone.message}</p>}
        </div>

        {/* Server error */}
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
          {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
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
