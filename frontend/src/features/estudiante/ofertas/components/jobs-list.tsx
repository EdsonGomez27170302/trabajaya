"use client";

import { useState } from "react";
import { AtSign, Building2, GraduationCap, Mail, MapPin, Phone, Star, X } from "lucide-react";

import { ASSET_BASE_URL } from "@/lib/config";
import { formatSalary, formatScheduleSummary } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Job } from "@/types";

const MODALITY_LABELS: Record<string, string> = {
  presencial: "Presencial",
  remoto: "Remoto",
  mixto: "Mixto",
};

function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full hover:bg-muted"
          aria-label="Cerrar"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-10">
          {job.company?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${ASSET_BASE_URL}${job.company.logo_url}`}
              alt={job.company.company_name}
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
              <Building2 className="size-5 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{job.company?.company_name}</p>
            <p className="text-sm text-muted-foreground">{job.zone}</p>
          </div>
          {job.is_featured && (
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
              <Star className="size-3 fill-amber-500" />
              Destacado
            </span>
          )}
        </div>

        <h2 className="mt-4 text-2xl font-black text-foreground">{job.title}</h2>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {MODALITY_LABELS[job.modality] ?? job.modality}
          </span>
          {job.category && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {job.category}
            </span>
          )}
        </div>

        {/* Detalles */}
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Salario</p>
            <p className="font-semibold text-foreground">{formatSalary(job)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Horas/semana</p>
            <p className="font-semibold text-foreground">{job.hours_per_week}h</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Vacantes</p>
            <p className="font-semibold text-foreground">{job.vacancies}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Horario</p>
            <p className="font-semibold text-foreground text-xs">{formatScheduleSummary(job.schedule)}</p>
          </div>
        </div>

        {job.description && (
          <div className="mt-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripción</p>
            <p className="whitespace-pre-line text-sm text-foreground">{job.description}</p>
          </div>
        )}

        {job.requirements && (
          <div className="mt-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Requisitos</p>
            <p className="whitespace-pre-line text-sm text-foreground">{job.requirements}</p>
          </div>
        )}

        {/* Contacto */}
        {(job.contact_phone || job.contact_email || job.contact_address) && (
          <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Contacto</p>
            <div className="flex flex-col gap-2">
              {job.contact_phone && (
                <a
                  href={`tel:${job.contact_phone}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <Phone className="size-4 shrink-0 text-primary" />
                  {job.contact_phone}
                </a>
              )}
              {job.contact_email && (
                <a
                  href={`mailto:${job.contact_email}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  <AtSign className="size-4 shrink-0 text-primary" />
                  {job.contact_email}
                </a>
              )}
              {job.contact_address && (
                <p className="inline-flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  {job.contact_address}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function JobsList({ jobs }: { jobs: Job[] }) {
  const [selected, setSelected] = useState<Job | null>(null);

  if (jobs.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
        No hay ofertas disponibles en este momento.
      </div>
    );
  }

  return (
    <>
      {selected && <JobModal job={selected} onClose={() => setSelected(null)} />}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <article
            key={job.id}
            onClick={() => setSelected(job)}
            className={cn(
              "relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-3xl border p-6 text-card-foreground shadow-sm transition hover:shadow-md",
              job.is_featured
                ? "border-amber-300 bg-linear-to-br from-amber-50 to-card shadow-amber-100 dark:border-amber-700/60 dark:from-amber-950/25 dark:to-card dark:shadow-amber-950/50"
                : "border-border bg-card",
            )}
          >
            {job.is_featured && (
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 dark:from-amber-600 dark:via-amber-500 dark:to-amber-700" />
            )}

            <div className="flex items-center gap-3">
              {job.company?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${ASSET_BASE_URL}${job.company.logo_url}`}
                  alt={job.company.company_name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted" />
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">
                  {job.company?.company_name}
                </p>
                <p className="text-sm text-muted-foreground">{job.zone}</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-foreground">{job.title}</h2>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {MODALITY_LABELS[job.modality] ?? job.modality}
              </span>
              {job.is_featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                  <Star className="size-3 fill-amber-500 dark:fill-amber-400" />
                  Destacado
                </span>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">{formatSalary(job)}</span>
              <span className="text-muted-foreground">
                {job.vacancies} vacante{job.vacancies === 1 ? "" : "s"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{formatScheduleSummary(job.schedule)}</p>
            <p className="text-xs text-muted-foreground">Toca para ver detalles y contacto →</p>
          </article>
        ))}
      </div>
    </>
  );
}
