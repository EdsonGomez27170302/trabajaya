"use client";

import { MapPin, Star } from "lucide-react";

import { ASSET_BASE_URL } from "@/lib/config";
import type { StudentProfile } from "@/types";

export function ProfilePreviewHeader({ profile }: { profile: StudentProfile }) {
  return (
    <>
      {profile.is_featured && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            <Star className="size-3 fill-amber-500" />
            Destacado
          </span>
        </div>
      )}

      <div className="relative flex items-center gap-3">
        {profile.profile_photo ? (
          <img
            src={`${ASSET_BASE_URL}${profile.profile_photo}`}
            alt={`${profile.first_name} ${profile.last_name}`}
            className="h-12 w-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {profile.first_name?.[0] ?? "E"}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">
            {profile.first_name} {profile.last_name}
          </p>
          {profile.zone && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              {profile.zone}
            </p>
          )}
        </div>
        {profile.is_featured && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 shrink-0">
            <Star className="size-3 fill-amber-500" />
            Destacado
          </span>
        )}
      </div>
    </>
  );
}
