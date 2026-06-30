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
  is_featured: boolean;
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
