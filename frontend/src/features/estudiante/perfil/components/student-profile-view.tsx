"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FileText, GraduationCap, Mail, MapPin, Star } from "lucide-react";

import { api } from "@/lib/api";
import { ASSET_BASE_URL } from "@/lib/config";
import { useAuthStore } from "@/store/auth-store";
import type { StudentProfile } from "@/types";

const ZONES = ["Huamanga", "Carmen Alto", "San Juan Bautista", "Jesús Nazareno", "Andrés Avelino Cáceres", "Centro", "Otro"];
const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const TURNOS = ["Mañana", "Tarde", "Noche"];

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
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [boosting, setBoosting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    api.get<StudentProfile>("/student/profile")
      .then(({ data }) => {
        setProfile(data);
        setAvailability(data.availability ?? {});
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

  function toggleTurno(day: string, turno: string) {
    setAvailability((prev) => {
      const current = prev[day] ?? [];
      const updated = current.includes(turno)
        ? current.filter((t) => t !== turno)
        : [...current, turno];
      if (updated.length === 0) {
        const { [day]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [day]: updated };
    });
  }

  async function handleBoost() {
    setBoosting(true);
    try {
      const { data } = await api.post<{ init_point: string }>("/student/payment/create-preference");
      window.location.href = data.init_point;
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "No se pudo iniciar el pago.";
      setServerError(msg);
      setBoosting(false);
    }
  }

  async function onSubmit(data: FormData) {
    setServerError("");
    setSaved(false);
    try {
      const { data: updated } = await api.put<StudentProfile>("/student/profile", {
        ...data,
        availability,
      });
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

        {/* Datos personales */}
        <section className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:grid-cols-2">
          <p className="sm:col-span-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Datos personales
          </p>

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
            <label className="text-sm font-semibold text-foreground">
              Presentación personal
            </label>
            <textarea
              {...register("bio")}
              rows={3}
              className={field}
              placeholder="Cuéntale a las empresas sobre ti, qué sabes hacer y qué tipo de trabajo buscas…"
            />
            {errors.bio && <p className={errCls}>{errors.bio.message}</p>}
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-sm font-semibold text-foreground">URL de tu CV (opcional)</label>
            <input {...register("cv_url")} placeholder="https://drive.google.com/..." className={field} />
            {errors.cv_url && <p className={errCls}>{errors.cv_url.message}</p>}
          </div>
        </section>

        {/* Disponibilidad */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Disponibilidad horaria
          </p>
          <p className="mt-1 text-sm text-muted-foreground mb-4">
            Marca los días y turnos en los que puedes trabajar.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-90 text-sm">
              <thead>
                <tr>
                  <th className="pb-3 text-left font-semibold text-foreground w-28">Día</th>
                  {TURNOS.map((t) => (
                    <th key={t} className="pb-3 text-center font-semibold text-foreground">
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {DAYS.map((day) => (
                  <tr key={day}>
                    <td className="py-2.5 text-sm text-foreground font-medium">{day}</td>
                    {TURNOS.map((turno) => {
                      const checked = (availability[day] ?? []).includes(turno);
                      return (
                        <td key={turno} className="py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => toggleTurno(day, turno)}
                            className={`mx-auto flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-semibold transition ${
                              checked
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            {checked ? "✓" : ""}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {Object.keys(availability).length > 0 && (
            <p className="mt-4 text-xs text-muted-foreground">
              Disponible:{" "}
              {Object.entries(availability)
                .map(([day, turnos]) => `${day} (${turnos.join(", ")})`)
                .join(" · ")}
            </p>
          )}
        </section>

        {/* Visibilidad */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">
            Visibilidad en el directorio
          </p>
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3">
            <input
              {...register("is_available")}
              type="checkbox"
              id="is_available"
              className="mt-0.5 h-4 w-4 rounded accent-primary shrink-0"
            />
            <div>
              <label htmlFor="is_available" className="text-sm font-semibold text-foreground cursor-pointer">
                Mostrarme en el directorio de talentos
              </label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Las empresas podrán ver tu perfil, carrera, disponibilidad y CV en la página principal.
              </p>
            </div>
          </div>
        </section>

        {serverError && (
          <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{serverError}</p>
        )}
        {saved && (
          <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">
            Perfil actualizado correctamente.
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {isSubmitting ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>

      {/* Vista previa de la publicación */}
      {profile && (
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">
            Vista previa de tu publicación
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Así te ven las empresas en el directorio de talentos.
          </p>

          <div className="max-w-xs">
            <article className={`flex flex-col gap-4 rounded-3xl border p-5 shadow-sm ${
              profile.is_featured
                ? "border-amber-300 bg-linear-to-br from-amber-50 to-card dark:border-amber-700/60 dark:from-amber-950/25"
                : "border-border bg-background"
            }`}>
              {profile.is_featured && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                    <Star className="size-3 fill-amber-500" />
                    Destacado
                  </span>
                </div>
              )}

              <div className="relative flex items-center gap-3">
                {profile.profile_photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${ASSET_BASE_URL}${profile.profile_photo}`}
                    alt={`${profile.first_name} ${profile.last_name}`}
                    className="h-12 w-12 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {profile.first_name?.[0] ?? "E"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {profile.first_name} {profile.last_name}
                  </p>
                  {profile.zone && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3 shrink-0" />
                      {profile.zone}
                    </p>
                  )}
                </div>
                {profile.is_featured && (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 shrink-0">
                    <Star className="size-3 fill-amber-500" />
                    Destacado
                  </span>
                )}
              </div>

              {profile.career && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="mt-0.5 size-4 shrink-0" />
                  <span>{profile.career}{profile.semester ? ` · Sem. ${profile.semester}` : ""}</span>
                </div>
              )}

              {profile.bio && (
                <p className="line-clamp-3 text-sm text-muted-foreground">{profile.bio}</p>
              )}

              <div className="mt-auto flex flex-col gap-2">
                {profile.institutional_email && (
                  <span className="inline-flex items-center gap-1.5 truncate text-xs text-primary">
                    <Mail className="size-3.5 shrink-0" />
                    {profile.institutional_email}
                  </span>
                )}
                {profile.cv_url && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground">
                    <FileText className="size-3.5" />
                    Ver CV
                  </span>
                )}
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Destacar perfil */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-1">
          Visibilidad premium
        </p>

        {profile?.is_featured ? (
          <div className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-700/60 dark:bg-amber-950/20">
            <Star className="size-5 fill-amber-500 text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Tu perfil está destacado</p>
              <p className="text-xs text-muted-foreground">Apareces entre los primeros en el directorio de talentos.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Destaca tu perfil y aparece primero en el directorio. Las empresas te verán antes que al resto.
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Star className="size-4 text-amber-500 shrink-0" /> Apareces en la parte superior del directorio</li>
              <li className="flex items-center gap-2"><Star className="size-4 text-amber-500 shrink-0" /> Badge dorado "Destacado" visible para empresas</li>
              <li className="flex items-center gap-2"><Star className="size-4 text-amber-500 shrink-0" /> Mayor probabilidad de ser contactado</li>
            </ul>
            <button
              type="button"
              onClick={handleBoost}
              disabled={boosting}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
            >
              <Star className="size-4 fill-white" />
              {boosting ? "Redirigiendo al pago…" : `Destacar mi perfil — S/ ${(5.00).toFixed(2)}`}
            </button>
            <p className="text-xs text-muted-foreground">Pago único mediante MercadoPago.</p>
          </div>
        )}
      </section>
    </div>
  );
}
