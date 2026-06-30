"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { CompanyProfile } from "@/types";
import { companyProfileSchema, type CompanyProfileFormData } from "./company-profile-schema";

export function useCompanyProfileView() {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<CompanyProfileFormData>({ resolver: zodResolver(companyProfileSchema) });

  useEffect(() => {
    api
      .get<CompanyProfile>("/company/profile")
      .then(({ data }) => {
        setProfile(data);
        reset({
          company_name: data.company_name, ruc: data.ruc, sector: data.sector,
          description: data.description, address: data.address, zone: data.zone,
          phone: data.phone, website: data.website,
        });
      })
      .catch(() => setServerError("No se pudo cargar el perfil."))
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmit(data: CompanyProfileFormData) {
    setServerError("");
    setSaved(false);
    try {
      const { data: updated } = await api.put<CompanyProfile>("/company/profile", data);
      setProfile(updated);
      updateProfile(updated);
      setSaved(true);
    } catch {
      setServerError("No se pudo guardar. Intenta de nuevo.");
    }
  }

  return { profile, loading, saved, serverError, register, handleSubmit, errors, isSubmitting, onSubmit };
}
