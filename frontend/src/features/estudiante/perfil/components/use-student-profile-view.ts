"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { StudentProfile } from "@/types";
import { profileFormSchema, type ProfileFormData } from "./profile-form-schema";
import { useProfileAvailability } from "./use-profile-availability";
import { useLoadProfile } from "./use-load-profile";

export function useStudentProfileView() {
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [saved, setSaved] = useState(false);
  const [boosting, setBoosting] = useState(false);
  const [boostError, setBoostError] = useState("");
  const { availability, setAvailability, toggleTurno } = useProfileAvailability();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileFormSchema) });

  const { profile, setProfile, loading, serverError, setServerError } = useLoadProfile(reset, setAvailability);
  const awaitingPayment = useRef(false);

  useEffect(() => {
    function onFocus() {
      if (!awaitingPayment.current) return;
      awaitingPayment.current = false;
      api
        .get<StudentProfile>("/student/profile")
        .then(({ data }) => setProfile(data))
        .catch(() => {});
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [setProfile]);

  async function handleBoost() {
    setBoostError("");
    setBoosting(true);
    try {
      const { data } = await api.post<{ init_point: string }>("/student/payment/create-preference");
      window.open(data.init_point, "_blank", "noopener,noreferrer");
      awaitingPayment.current = true;
      setBoosting(false);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "No se pudo iniciar el pago. Intenta de nuevo.";
      setBoostError(msg);
      setBoosting(false);
    }
  }

  async function onSubmit(data: ProfileFormData) {
    setServerError("");
    setSaved(false);
    try {
      const { data: updated } = await api.put<StudentProfile>("/student/profile", { ...data, availability });
      setProfile(updated);
      updateProfile(updated);
      setSaved(true);
    } catch {
      setServerError("No se pudo guardar. Intenta de nuevo.");
    }
  }

  return {
    profile,
    loading,
    saved,
    serverError,
    availability,
    boosting,
    boostError,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    toggleTurno,
    handleBoost,
    onSubmit,
  };
}
