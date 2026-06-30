export const AUTH_ZONES = [
  "Huamanga",
  "Carmen Alto",
  "San Juan Bautista",
  "Jesús Nazareno",
  "Andrés Avelino Cáceres",
  "Centro",
  "Otro",
];

export const fieldClass =
  "rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40";
export const errClass = "text-xs text-red-500 mt-0.5";

export function extractApiError(err: unknown, fallback: string): string {
  return (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? fallback;
}
