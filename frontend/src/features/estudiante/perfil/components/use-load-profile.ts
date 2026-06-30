"use client";

import { useEffect, useState } from "react";
import type { UseFormReset } from "react-hook-form";

import { api } from "@/lib/api";
import type { StudentProfile } from "@/types";
import type { ProfileFormData } from "./profile-form-schema";

export function useLoadProfile(
  reset: UseFormReset<ProfileFormData>,
  setAvailability: (a: Record<string, string[]>) => void,
) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    api
      .get<StudentProfile>("/student/profile")
      .then(({ data }) => {
        setProfile(data);
        setAvailability(data.availability ?? {});
        reset({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          bio: data.bio,
          cv_url: data.cv_url,
          zone: data.zone,
          is_available: data.is_available,
        });
      })
      .catch(() => setServerError("No se pudo cargar el perfil."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  return { profile, setProfile, loading, serverError, setServerError };
}
