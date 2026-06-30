"use client";

import { MapPin, Star } from "lucide-react";

import { ASSET_BASE_URL } from "@/lib/config";
import type { StudentProfile } from "@/types";

export function StudentModalHeader({ student }: { student: StudentProfile }) {
  return (
    <div className="flex items-center gap-4 pr-10">
      {student.profile_photo ? (
        <img
          src={`${ASSET_BASE_URL}${student.profile_photo}`}
          alt={`${student.first_name} ${student.last_name}`}
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
          {student.first_name?.[0] ?? "E"}
        </div>
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-bold text-foreground text-lg">
            {student.first_name} {student.last_name}
          </p>
          {student.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
              <Star className="size-3 fill-amber-500" />
              Destacado
            </span>
          )}
        </div>
        {student.zone && (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" />
            {student.zone}
          </p>
        )}
      </div>
    </div>
  );
}
