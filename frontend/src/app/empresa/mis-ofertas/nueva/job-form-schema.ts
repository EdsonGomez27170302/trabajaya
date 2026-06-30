import { z } from "zod";

export const CATEGORIES = [
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

export const ZONES = [
  "Huamanga",
  "Carmen Alto",
  "San Juan Bautista",
  "Jesús Nazareno",
  "Andrés Avelino Cáceres",
  "Centro",
  "Otro",
];

export const jobFormSchema = z.object({
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
  contact_phone: z.string().min(7, "Ingresa un número de contacto válido"),
  contact_email: z.string().email("Correo inválido").or(z.literal("")).optional(),
  contact_address: z.string().optional(),
});

export type JobFormData = z.infer<typeof jobFormSchema>;
