import type { User, StudentProfile, CompanyProfile } from "./user";

export interface LoginResponse {
  user: User;
  profile: StudentProfile | CompanyProfile | null;
}
