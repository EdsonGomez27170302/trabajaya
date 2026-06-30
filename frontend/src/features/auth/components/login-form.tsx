"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLoginForm } from "./use-login-form";

export function LoginForm() {
  const { register, handleSubmit, errors, isSubmitting, serverError, onSubmit } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <Link href="/" className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> Volver al inicio
        </Link>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Acceso</p>
        <h1 className="mt-2 text-3xl font-black text-foreground">Inicia sesión</h1>
        <p className="mt-1 text-sm text-muted-foreground">Estudiante, empresa o administrador.</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Usuario o correo</Label>
            <Input id="username" {...register("username")} placeholder="usuario o correo@ejemplo.com" autoComplete="username" />
            {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input id="password" {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" className="pr-10" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          {serverError && <p className="rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? "Ingresando…" : "Ingresar"}
          </Button>
        </form>

        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
          <p>
            ¿No tienes cuenta?{" "}
            <Link href="/auth/register/estudiante" className="font-semibold text-primary hover:underline">Regístrate como estudiante</Link>{" "}
            o{" "}
            <Link href="/auth/register/empresa" className="font-semibold text-primary hover:underline">como empresa</Link>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
