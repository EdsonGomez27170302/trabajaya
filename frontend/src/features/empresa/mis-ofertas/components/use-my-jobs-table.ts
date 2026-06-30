"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import type { Job } from "@/types";

export function useMyJobsTable() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [featureError, setFeatureError] = useState("");
  const [featuringId, setFeaturingId] = useState<number | null>(null);

  useEffect(() => {
    api
      .get<{ data: Job[] } | Job[]>("/company/jobs")
      .then(({ data: raw }) => setJobs(Array.isArray(raw) ? raw : (raw as { data: Job[] }).data ?? []))
      .catch(() => setError("No se pudieron cargar las ofertas."))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(job: Job) {
    const newStatus = job.status === "active" ? "paused" : "active";
    try {
      const { data: updated } = await api.put<Job>(`/company/jobs/${job.id}`, { ...job, status: newStatus });
      setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    } catch {
      setError("No se pudo actualizar el estado.");
    }
  }

  async function handleFeature(job: Job) {
    setFeatureError("");
    setFeaturingId(job.id);
    try {
      const { data } = await api.post<{ init_point: string }>("/company/payment/create-preference", {
        job_id: job.id,
      });
      window.location.href = data.init_point;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "No se pudo iniciar el pago. Intenta de nuevo.";
      setFeatureError(msg);
      setFeaturingId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar esta oferta?")) return;
    try {
      await api.delete(`/company/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch {
      setError("No se pudo eliminar la oferta.");
    }
  }

  return { jobs, loading, error, featureError, featuringId, handleToggle, handleFeature, handleDelete };
}
