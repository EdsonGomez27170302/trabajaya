"use client";

import { GraduationCap } from "lucide-react";

import type { StudentProfile } from "@/types";
import { StudentGridCardHeader } from "./student-grid-card-header";

export function StudentGridCard({
  student,
  onSelect,
}: {
  student: StudentProfile;
  onSelect: (student: StudentProfile) => void;
}) {
  return (
    <article
      onClick={() => onSelect(student)}
      className={`flex cursor-pointer flex-col gap-4 rounded-3xl border p-5 shadow-sm transition hover:shadow-md ${
        student.is_featured
          ? "border-amber-300 bg-linear-to-br from-amber-50 to-card dark:border-amber-700/60 dark:from-amber-950/25"
          : "border-border bg-card"
      }`}
    >
      <StudentGridCardHeader student={student} />

      {student.career && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <GraduationCap className="mt-0.5 size-4 shrink-0" />
          <span>
            {student.career}
            {student.semester ? ` · Sem. ${student.semester}` : ""}
          </span>
        </div>
      )}

      {student.bio && <p className="line-clamp-2 text-sm text-muted-foreground">{student.bio}</p>}

      <p className="mt-auto text-xs text-muted-foreground">Toca para ver contacto →</p>
    </article>
  );
}
