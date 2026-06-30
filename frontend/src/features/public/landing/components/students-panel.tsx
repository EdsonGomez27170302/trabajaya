"use client";

import type { StudentProfile } from "@/types";
import { StudentGridCard } from "./student-grid-card";

export function StudentsPanel({
  students,
  onSelectStudent,
}: {
  students: StudentProfile[];
  onSelectStudent: (student: StudentProfile) => void;
}) {
  return (
    <div className="mt-6">
      {students.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {students.map((s) => (
            <StudentGridCard key={s.id} student={s} onSelect={onSelectStudent} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Aún no hay estudiantes disponibles en el directorio.</p>
      )}
    </div>
  );
}
