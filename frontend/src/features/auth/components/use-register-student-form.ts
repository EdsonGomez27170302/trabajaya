"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/lib/api";
import { extractApiError } from "./auth-form-shared";
import { registerStudentSchema, type RegisterStudentData } from "./register-student-schema";

export function useRegisterStudentForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<RegisterStudentData>({ resolver: zodResolver(registerStudentSchema) });

  async function onSubmit(data: RegisterStudentData) {
    setServerError("");
    try {
      await api.post("/auth/register/student", {
        username: data.username, email: data.email,
        institutional_email: data.institutional_email, password: data.password,
        first_name: data.first_name, last_name: data.last_name,
        faculty: data.faculty, career: data.career, semester: data.semester,
        phone: data.phone, zone: data.zone,
      });
      setDone(true);
    } catch (err) {
      setServerError(extractApiError(err, "Error al registrarse. Intenta de nuevo."));
    }
  }

  return { done, serverError, register, handleSubmit, errors, isSubmitting, onSubmit };
}
