import { z } from "zod";

export const ZONES = [
  "Huamanga",
  "Carmen Alto",
  "San Juan Bautista",
  "Jesús Nazareno",
  "Andrés Avelino Cáceres",
  "Centro",
  "Otro",
];
export const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
export const TURNOS = ["Mañana", "Tarde", "Noche"];

export const profileFormSchema = z.object({
  first_name: z.string().min(1, "Requerido"),
  last_name: z.string().min(1, "Requerido"),
  phone: z.string().min(6, "Requerido"),
  bio: z.string().max(500, "Máximo 500 caracteres"),
  cv_url: z.string().url("URL inválida").or(z.literal("")),
  zone: z.string().min(1, "Selecciona tu zona"),
  is_available: z.boolean(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export const fieldClass =
  "rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";
export const errorClass = "text-xs text-red-500 mt-0.5";
