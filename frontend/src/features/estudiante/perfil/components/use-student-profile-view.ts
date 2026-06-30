"use client";

import { useState } from "react";
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
  const [showPayment, setShowPayment] = useState(false);
  const { availability, setAvailability, toggleTurno } = useProfileAvailability();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileFormSchema) });

  const { profile, setProfile, loading, serverError, setServerError } = useLoadProfile(reset, setAvailability);

  function handleBoost() {
    setShowPayment(true);
  }

  function handlePaymentSuccess() {
    setShowPayment(false);
    setProfile((prev) => (prev ? { ...prev, is_featured: true } : prev));
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
    showPayment,
    setShowPayment,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    toggleTurno,
    handleBoost,
    handlePaymentSuccess,
    onSubmit,
  };
}
