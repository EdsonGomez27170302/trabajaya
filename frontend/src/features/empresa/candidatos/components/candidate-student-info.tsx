"use client";

import type { StudentProfile } from "@/types";

export function CandidateStudentInfo({ student }: { student?: StudentProfile }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-semibold text-foreground">
        {student ? `${student.first_name} ${student.last_name}` : "Candidato"}
      </p>
      {student && (
        <>
          <p className="text-sm text-muted-foreground">
            {student.faculty} · {student.career} · Sem. {student.semester}
          </p>
          <p className="text-sm text-muted-foreground">
            {student.zone}
            {student.phone ? ` · ${student.phone}` : ""}
          </p>
          {student.cv_url && (
            <a
              href={student.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Ver CV →
            </a>
          )}
        </>
      )}
    </div>
  );
}
