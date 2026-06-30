import { z } from "zod";

export const COMPANY_SECTORS = [
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

export const COMPANY_ZONES = [
  "Huamanga",
  "Carmen Alto",
  "San Juan Bautista",
  "Jesús Nazareno",
  "Andrés Avelino Cáceres",
  "Centro",
  "Otro",
];

export const companyProfileSchema = z.object({
  company_name: z.string().min(2, "Requerido"),
  ruc: z.string().length(11, "RUC debe tener 11 dígitos"),
  sector: z.string().min(1, "Selecciona un sector"),
  description: z.string().max(500, "Máximo 500 caracteres"),
  address: z.string().min(4, "Requerido"),
  zone: z.string().min(1, "Selecciona tu zona"),
  phone: z.string().min(6, "Requerido"),
  website: z.string().url("URL inválida").or(z.literal("")),
});

export type CompanyProfileFormData = z.infer<typeof companyProfileSchema>;

export const fieldClass =
  "rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";
export const errClass = "text-xs text-red-500 mt-0.5";
