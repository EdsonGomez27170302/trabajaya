"use client";

import { FileText, Mail, Phone } from "lucide-react";

import type { StudentProfile } from "@/types";

export function StudentModalContact({ student }: { student: StudentProfile }) {
  return (
    <>
      <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Contacto</p>
        <div className="flex flex-col gap-2">
          {student.institutional_email && (
            <a
              href={`mailto:${student.institutional_email}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
            >
              <Mail className="size-4 shrink-0 text-primary" />
              {student.institutional_email}
            </a>
          )}
          {student.phone && (
            <a
              href={`tel:${student.phone}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
            >
              <Phone className="size-4 shrink-0 text-primary" />
              {student.phone}
            </a>
          )}
        </div>
      </div>

      {student.cv_url && (
        <a
          href={student.cv_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
        >
          <FileText className="size-4" />
          Ver CV completo
        </a>
      )}
    </>
  );
}
