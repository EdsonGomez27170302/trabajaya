"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { LoginResponse } from "@/types";

const loginSchema = z.object({
  username: z.string().min(1, "Ingresa tu usuario o correo"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

const ROLE_HOME: Record<string, string> = {
  student: "/estudiante/dashboard",
  company: "/empresa/dashboard",
  admin: "/admin/dashboard",
};

export function useLoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginFormData) {
    setServerError("");
    try {
      const { data: res } = await api.post<LoginResponse>("/auth/login", data);
      setAuth(res.user, res.profile);
      router.push(ROLE_HOME[res.user.role] ?? "/");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "Usuario o contraseña incorrectos";
      setServerError(msg);
    }
  }

  return { register, handleSubmit, errors, isSubmitting, serverError, onSubmit };
}
