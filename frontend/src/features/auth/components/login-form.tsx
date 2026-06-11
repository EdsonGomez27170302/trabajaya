"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { LoginResponse } from "@/types";

const schema = z.object({
  username: z.string().min(1, "Ingresa tu usuario o correo"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

type FormData = z.infer<typeof schema>;

const ROLE_HOME: Record<string, string> = {
  student: "/estudiante/dashboard",
  company: "/empresa/dashboard",
  admin: "/admin/dashboard",
};

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError("");
    try {
      const { data: res } = await api.post<LoginResponse>("/auth/login", data);
      setAuth(res.token, res.user, res.profile);
      router.push(ROLE_HOME[res.user.role] ?? "/");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Usuario o contraseña incorrectos";
      setServerError(msg);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
          Acceso
        </p>
        <h1 className="mt-2 text-3xl font-black text-foreground">
          Inicia sesión
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Estudiante, empresa o administrador.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Usuario o correo</Label>
            <Input
              id="username"
              {...register("username")}
              placeholder="usuario o correo@ejemplo.com"
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-xs text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              {...register("password")}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {serverError}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? "Ingresando…" : "Ingresar"}
          </Button>
        </form>

        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
          <p>
            ¿No tienes cuenta?{" "}
            <Link
              href="/auth/register/estudiante"
              className="font-semibold text-primary hover:underline"
            >
              Regístrate como estudiante
            </Link>{" "}
            o{" "}
            <Link
              href="/auth/register/empresa"
              className="font-semibold text-primary hover:underline"
            >
              como empresa
            </Link>
            .
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
