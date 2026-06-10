import { api } from "@/lib/api";
import type { Job } from "@/types";

interface JobsResponse {
  data: Job[];
  page: number;
  limit: number;
  total: number;
}

export async function getJobs(): Promise<Job[]> {
  try {
    const { data } = await api.get<JobsResponse>("/jobs");
    return data.data;
  } catch {
    return [];
  }
}
