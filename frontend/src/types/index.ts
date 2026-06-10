export interface User {
  id: number;
  username: string;
  email: string;
  role: "student" | "company" | "admin";
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  institutional_email: string;
  faculty: string;
  career: string;
  semester: number;
  phone: string;
  bio: string;
  cv_url: string;
  availability: Record<string, string[]>;
  zone: string;
  profile_photo: string;
  is_available: boolean;
}

export interface CompanyProfile {
  id: number;
  user_id: number;
  company_name: string;
  ruc: string;
  sector: string;
  description: string;
  address: string;
  zone: string;
  phone: string;
  website: string;
  logo_url: string;
  is_verified: boolean;
  plan: "free" | "premium";
}

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
  is_featured: boolean;
  views_count: number;
  expires_at: string;
  created_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  job?: Job;
  student_id: number;
  student?: StudentProfile;
  cover_letter: string;
  status: "pending" | "viewed" | "accepted" | "rejected";
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: "new_job" | "application_update" | "system";
  is_read: boolean;
  link: string;
  created_at: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  profile: StudentProfile | CompanyProfile | null;
}
