import type { StudentProfile } from "./user";
import type { Job } from "./job";

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
