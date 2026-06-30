"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { Job } from "@/types";

export function useAdminJobsTable() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const q = statusFilter ? `?status=${statusFilter}` : "";
    api
      .get<{ data: Job[] }>(`/admin/jobs${q}`)
      .then(({ data }) => setJobs(data.data))
      .catch(() => setError("No se pudieron cargar las ofertas."))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  async function handleModerate(job: Job, status: "active" | "paused" | "closed") {
    try {
      const { data: updated } = await api.put<Job>(`/admin/jobs/${job.id}/moderate`, { status });
      setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    } catch {
      alert("No se pudo moderar la oferta.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar esta oferta permanentemente?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch {
      alert("No se pudo eliminar la oferta.");
    }
  }

  return { jobs, loading, error, statusFilter, setStatusFilter, handleModerate, handleDelete };
}
