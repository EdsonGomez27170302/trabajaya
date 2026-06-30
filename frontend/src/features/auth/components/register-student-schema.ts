import { z } from "zod";

export const FACULTIES = [
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

export const registerStudentSchema = z
  .object({
    username: z.string().min(3, "Mínimo 3 caracteres"),
    email: z.string().email("Correo inválido"),
    institutional_email: z
      .string()
      .email("Correo inválido")
      .refine((v) => v.endsWith("@unsch.edu.pe"), { message: "Debe terminar en @unsch.edu.pe" }),
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

export type RegisterStudentData = z.infer<typeof registerStudentSchema>;
