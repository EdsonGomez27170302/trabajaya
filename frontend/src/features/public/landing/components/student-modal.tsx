"use client";

import { GraduationCap, X } from "lucide-react";

import type { StudentProfile } from "@/types";
import { StudentModalHeader } from "./student-modal-header";
import { StudentModalContact } from "./student-modal-contact";

export function StudentModal({ student, onClose }: { student: StudentProfile; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Cerrar"
        >
          <X className="size-4" />
        </button>

        <StudentModalHeader student={student} />

        {student.career && (
          <div className="mt-4 flex items-start gap-2 rounded-2xl border border-border bg-muted/40 p-3 text-sm">
            <GraduationCap className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">{student.career}</p>
              {student.faculty && <p className="text-muted-foreground">{student.faculty}</p>}
              {student.semester ? <p className="text-muted-foreground">Semestre {student.semester}</p> : null}
            </div>
          </div>
        )}

        {student.bio && (
          <div className="mt-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sobre mí</p>
            <p className="text-sm text-foreground">{student.bio}</p>
          </div>
        )}

        <StudentModalContact student={student} />
      </div>
    </div>
  );
}
