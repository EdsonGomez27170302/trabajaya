import { Bell } from "lucide-react";

export function CompanyHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div>
        <p className="text-sm text-muted-foreground">Bienvenido de vuelta</p>
        <h1 className="text-lg font-bold text-foreground">Panel de empresa</h1>
      </div>
      <button
        type="button"
        aria-label="Notificaciones"
        className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <Bell className="size-5" />
      </button>
    </header>
  );
}
