import type { StudentProfile, CompanyProfile } from "@/types";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: "student" | "company" | "admin";
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  student_profile?: StudentProfile;
  company_profile?: CompanyProfile;
}

export const ROLE_LABEL: Record<string, string> = {
  student: "Estudiante",
  company: "Empresa",
  admin: "Admin",
};

export const ROLE_COLOR: Record<string, string> = {
  student: "bg-blue-50 text-blue-700",
  company: "bg-purple-50 text-purple-700",
  admin: "bg-primary/10 text-primary",
};
