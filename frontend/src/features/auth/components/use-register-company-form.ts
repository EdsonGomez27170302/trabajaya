"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/api";
import { extractApiError } from "./auth-form-shared";
import { registerCompanySchema, type RegisterCompanyData } from "./register-company-schema";

export function useRegisterCompanyForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<RegisterCompanyData>({ resolver: zodResolver(registerCompanySchema) });

  async function onSubmit(data: RegisterCompanyData) {
    setServerError("");
    try {
      await api.post("/auth/register/company", {
        username: data.username, email: data.email, password: data.password,
        company_name: data.company_name, ruc: data.ruc, sector: data.sector,
        address: data.address, zone: data.zone, phone: data.phone, website: data.website,
      });
      setDone(true);
    } catch (err) {
      setServerError(extractApiError(err, "Error al registrarse. Intenta de nuevo."));
    }
  }

  return { done, serverError, register, handleSubmit, errors, isSubmitting, onSubmit };
}
