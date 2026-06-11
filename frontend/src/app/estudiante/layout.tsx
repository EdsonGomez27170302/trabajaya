import { RouteGuard } from "@/components/shared/route-guard";
import { EstudianteShell } from "@/components/layout/estudiante-shell";

export default function EstudianteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard role="student">
      <EstudianteShell>{children}</EstudianteShell>
    </RouteGuard>
  );
}
