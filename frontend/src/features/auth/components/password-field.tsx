"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { UseFormRegister, Path, FieldValues, FieldError } from "react-hook-form";

import { fieldClass, errClass } from "./auth-form-shared";

interface PasswordFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  error?: FieldError;
}

export function PasswordField<T extends FieldValues>({ id, label, register, error }: PasswordFieldProps<T>) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <div className="relative">
        <input
          {...register(id)}
          type={show ? "text" : "password"}
          placeholder="••••••••"
          className={`${fieldClass} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && <p className={errClass}>{error.message}</p>}
    </div>
  );
}
