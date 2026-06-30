import type { CompanyProfile } from "./user";

export interface Job {
  id: number;
  company_id: number;
  company?: CompanyProfile;
  title: string;
  description: string;
  requirements: string;
  category: string;
  modality: "presencial" | "remoto" | "mixto";
  zone: string;
  salary: number;
  salary_type: "por_hora" | "mensual";
  hours_per_week: number;
  schedule: Record<string, string[]>;
  vacancies: number;
  status: "active" | "paused" | "closed";
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  is_featured: boolean;
  views_count: number;
  expires_at: string;
  created_at: string;
}
