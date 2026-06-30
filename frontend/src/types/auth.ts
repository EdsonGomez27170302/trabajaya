import type { User, StudentProfile, CompanyProfile } from "./user";

export interface LoginResponse {
  token: string;
  user: User;
  profile: StudentProfile | CompanyProfile | null;
}
