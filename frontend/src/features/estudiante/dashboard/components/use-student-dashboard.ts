"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { Application, StudentProfile } from "@/types";

export function useStudentDashboard() {
  const { profile: storeProfile } = useAuthStore();
  const [profile, setProfile] = useState<StudentProfile | null>(storeProfile as StudentProfile | null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<StudentProfile>("/student/profile"),
      api.get<{ data: Application[] }>("/student/applications"),
    ])
      .then(([pRes, aRes]) => {
        setProfile(pRes.data);
        setApplications(aRes.data.data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const total = applications.length;
  const pending = applications.filter((a) => a.status === "pending" || a.status === "viewed").length;
  const accepted = applications.filter((a) => a.status === "accepted").length;

  return { profile, applications, loading, total, pending, accepted };
}
