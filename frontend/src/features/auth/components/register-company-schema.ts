import { z } from "zod";

export const SECTORS = [
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

export const registerCompanySchema = z
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

export type RegisterCompanyData = z.infer<typeof registerCompanySchema>;
