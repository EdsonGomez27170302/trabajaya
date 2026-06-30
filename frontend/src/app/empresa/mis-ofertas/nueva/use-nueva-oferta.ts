"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { jobFormSchema, type JobFormData } from "./job-form-schema";

export function useNuevaOferta() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>({ resolver: zodResolver(jobFormSchema) });

  async function onSubmit(data: JobFormData) {
    setServerError("");
    try {
      await api.post("/company/jobs", data);
      router.push("/empresa/mis-ofertas");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "No se pudo crear la oferta. Intenta de nuevo.";
      setServerError(msg);
    }
  }

  return { router, serverError, register, handleSubmit, errors, isSubmitting, onSubmit };
}
