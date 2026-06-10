import { StudentHeader } from "@/features/estudiante/components/student-header";
import { StudentSidebar } from "@/features/estudiante/components/student-sidebar";

export default function EstudianteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />
      <div className="flex flex-1 flex-col">
        <StudentHeader />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
