import { CompanyHeader } from "@/features/empresa/components/company-header";
import { CompanySidebar } from "@/features/empresa/components/company-sidebar";

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <CompanySidebar />
      <div className="flex flex-1 flex-col">
        <CompanyHeader />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
