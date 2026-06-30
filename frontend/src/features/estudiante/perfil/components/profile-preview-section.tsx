"use client";

import type { StudentProfile } from "@/types";
import { ProfilePreviewCard } from "./profile-preview-card";

export function ProfilePreviewSection({ profile }: { profile: StudentProfile }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">
        Vista previa de tu publicación
      </p>
      <p className="mb-4 text-sm text-muted-foreground">Así te ven las empresas en el directorio de talentos.</p>

      <div className="max-w-xs">
        <ProfilePreviewCard profile={profile} />
      </div>
    </section>
  );
}
