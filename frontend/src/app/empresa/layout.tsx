import { RouteGuard } from "@/components/shared/route-guard";
import { EmpresaShell } from "@/components/layout/empresa-shell";

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard role="company">
      <EmpresaShell>{children}</EmpresaShell>
    </RouteGuard>
  );
}
