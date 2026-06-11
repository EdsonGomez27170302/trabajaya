import * as React from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "default"
  | "outline"
  | "ghost"
  | "destructive"
  | "secondary"
  | "link";

export type ButtonSize = "sm" | "default" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-muted",
  ghost:
    "bg-transparent text-foreground hover:bg-muted",
  destructive:
    "bg-destructive text-white hover:bg-destructive/90",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  link:
    "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-xl",
  default: "h-10 px-5 py-2 text-sm rounded-xl",
  lg: "h-12 px-8 text-base rounded-2xl",
  icon: "size-9 rounded-xl p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          variantClasses[variant],
          variant !== "link" && sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
