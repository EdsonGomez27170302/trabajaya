import { RouteGuard } from "@/components/shared/route-guard";
import { AdminShell } from "@/components/layout/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard role="admin">
      <AdminShell>{children}</AdminShell>
    </RouteGuard>
  );
}
