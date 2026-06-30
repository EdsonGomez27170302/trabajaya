import type { LucideIcon } from "lucide-react";

export function SidebarHeader({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-6 py-6">
      <Icon className="size-6 text-primary" />
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-primary">TrabajaYa</p>
        <p className="text-sm font-semibold text-foreground">{label}</p>
      </div>
    </div>
  );
}
