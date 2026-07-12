import { serverApi } from "@/lib/server-api";
import type { Job, StudentProfile } from "@/types";

export interface PlatformStats {
  active_jobs: number;
  verified_students: number;
  registered_companies: number;
}

const FALLBACK_STATS: PlatformStats = {
  active_jobs: 0,
  verified_students: 0,
  registered_companies: 0,
};

export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const { data } = await serverApi.get<PlatformStats>("stats");
    return data;
  } catch {
    return FALLBACK_STATS;
  }
}

export async function getLatestJobs(search?: string): Promise<Job[]> {
  try {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    const { data } = await serverApi.get<{ data: Job[] }>("jobs", { params });
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function getAvailableStudents(): Promise<StudentProfile[]> {
  try {
    const { data } = await serverApi.get<{ data: StudentProfile[] }>("students");
    return data.data ?? [];
  } catch {
    return [];
  }
}
