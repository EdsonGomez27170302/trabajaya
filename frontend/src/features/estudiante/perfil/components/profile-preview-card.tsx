"use client";

import { FileText, GraduationCap, Mail } from "lucide-react";

import type { StudentProfile } from "@/types";
import { ProfilePreviewHeader } from "./profile-preview-header";

export function ProfilePreviewCard({ profile }: { profile: StudentProfile }) {
  return (
    <article
      className={`flex flex-col gap-4 rounded-3xl border p-5 shadow-sm ${
        profile.is_featured
          ? "border-amber-300 bg-linear-to-br from-amber-50 to-card dark:border-amber-700/60 dark:from-amber-950/25"
          : "border-border bg-background"
      }`}
    >
      <ProfilePreviewHeader profile={profile} />

      {profile.career && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <GraduationCap className="mt-0.5 size-4 shrink-0" />
          <span>
            {profile.career}
            {profile.semester ? ` · Sem. ${profile.semester}` : ""}
          </span>
        </div>
      )}

      {profile.bio && <p className="line-clamp-3 text-sm text-muted-foreground">{profile.bio}</p>}

      <div className="mt-auto flex flex-col gap-2">
        {profile.institutional_email && (
          <span className="inline-flex items-center gap-1.5 truncate text-xs text-primary">
            <Mail className="size-3.5 shrink-0" />
            {profile.institutional_email}
          </span>
        )}
        {profile.cv_url && (
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground">
            <FileText className="size-3.5" />
            Ver CV
          </span>
        )}
      </div>
    </article>
  );
}
