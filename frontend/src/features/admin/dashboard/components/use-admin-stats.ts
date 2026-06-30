"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

interface Stats {
  active_jobs: number;
  registered_companies: number;
  verified_students: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Stats>("/stats")
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
