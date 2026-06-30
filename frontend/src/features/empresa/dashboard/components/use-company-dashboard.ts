"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { CompanyProfile, Job } from "@/types";

export function useCompanyDashboard() {
  const { profile: storeProfile } = useAuthStore();
  const [profile, setProfile] = useState<CompanyProfile | null>(storeProfile as CompanyProfile | null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get<CompanyProfile>("/company/profile"), api.get<{ data: Job[] } | Job[]>("/company/jobs")])
      .then(([pRes, jRes]) => {
        setProfile(pRes.data);
        const raw = jRes.data;
        setJobs(Array.isArray(raw) ? raw : (raw as { data: Job[] }).data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const pausedJobs = jobs.filter((j) => j.status === "paused").length;
  const totalViews = jobs.reduce((sum, j) => sum + j.views_count, 0);

  return { profile, jobs, loading, activeJobs, pausedJobs, totalViews };
}
