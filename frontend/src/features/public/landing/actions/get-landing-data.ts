import { api } from "@/lib/api";
import type { Job } from "@/types";

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
    const { data } = await api.get<PlatformStats>("/stats");
    return data;
  } catch {
    return FALLBACK_STATS;
  }
}

export async function getLatestJobs(limit = 3): Promise<Job[]> {
  try {
    const { data } = await api.get<{ data: Job[] }>("/jobs/featured", {
      params: { limit },
    });
    return data.data;
  } catch {
    return [];
  }
}
