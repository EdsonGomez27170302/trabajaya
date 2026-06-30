"use client";

import { AtSign, MapPin, Phone } from "lucide-react";

import type { Job } from "@/types";

export function JobDetailModalContact({ job }: { job: Job }) {
  if (!job.contact_phone && !job.contact_email && !job.contact_address) return null;

  return (
    <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Contacto</p>
      <div className="flex flex-col gap-2">
        {job.contact_phone && (
          <a href={`tel:${job.contact_phone}`} className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
            <Phone className="size-4 shrink-0 text-primary" /> {job.contact_phone}
          </a>
        )}
        {job.contact_email && (
          <a href={`mailto:${job.contact_email}`} className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
            <AtSign className="size-4 shrink-0 text-primary" /> {job.contact_email}
          </a>
        )}
        {job.contact_address && (
          <p className="inline-flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {job.contact_address}
          </p>
        )}
      </div>
    </div>
  );
}
