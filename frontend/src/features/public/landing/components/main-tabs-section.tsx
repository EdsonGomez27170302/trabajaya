"use client";

import { useState } from "react";
import { FileText, GraduationCap, Mail, MapPin, Phone, Search, Star, X, Building2, AtSign } from "lucide-react";

import { ASSET_BASE_URL } from "@/lib/config";
import { formatSalary } from "@/lib/format";
import type { Job, StudentProfile } from "@/types";

type Tab = "todas" | "estudiante" | "empresa";

interface Props {
  jobs: Job[];
  students: StudentProfile[];
}

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

        <div className="flex items-center gap-3 pr-10">
          {job.company?.logo_url ? (
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
            {job.modality}
          </span>
          {job.category && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {job.category}
            </span>
          )}
        </div>

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
            <p className="text-xs text-muted-foreground">Zona</p>
            <p className="font-semibold text-foreground">{job.zone}</p>
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

function StudentModal({ student, onClose }: { student: StudentProfile; onClose: () => void }) {
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
      </div>
    </div>
  );
}

export function MainTabsSection({ jobs, students }: Props) {
  const [tab, setTab] = useState<Tab>("todas");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  const filteredJobs = search.trim()
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.description?.toLowerCase().includes(search.toLowerCase()),
      )
    : jobs;

  return (
    <>
      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
      {selectedStudent && <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="flex flex-wrap gap-3">
          {(["todas", "estudiante", "empresa"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                tab === t
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              {t === "todas" && "Todas las ofertas"}
              {t === "estudiante" && "Soy estudiante"}
              {t === "empresa" && "Soy empresa"}
            </button>
          ))}
        </div>

        {tab !== "empresa" && (
          <div className="relative mt-6">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Busca por puesto o descripción…"
              className="w-full rounded-2xl border border-border bg-background py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        )}

        {tab !== "empresa" && (
          <div className="mt-6">
            {filteredJobs.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredJobs.map((job) =>
                  job.is_featured ? (
                    <article
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className="relative cursor-pointer overflow-hidden rounded-3xl border border-amber-300 bg-linear-to-br from-amber-50 to-card p-6 shadow-sm transition hover:shadow-md dark:border-amber-700/60 dark:from-amber-950/25 dark:to-card"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500" />
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {job.company?.logo_url ? (
                            <img
                              src={`${ASSET_BASE_URL}${job.company.logo_url}`}
                              alt={job.company.company_name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted" />
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {job.company?.company_name}
                            </p>
                            <p className="text-xs text-muted-foreground">{job.zone}</p>
                          </div>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                          <Star className="size-3 fill-amber-500" />
                          Destacado
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-foreground">{job.title}</h3>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">{formatSalary(job)}</span>
                        <span className="text-xs text-muted-foreground">
                          {job.vacancies} vacante{job.vacancies === 1 ? "" : "s"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">Toca para ver contacto →</p>
                    </article>
                  ) : (
                    <article
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className="cursor-pointer rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        {job.company?.logo_url ? (
                          <img
                            src={`${ASSET_BASE_URL}${job.company.logo_url}`}
                            alt={job.company.company_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {job.company?.company_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{job.zone}</p>
                        </div>
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-foreground">{job.title}</h3>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">{formatSalary(job)}</span>
                        <span className="text-xs text-muted-foreground">
                          {job.vacancies} vacante{job.vacancies === 1 ? "" : "s"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">Toca para ver contacto →</p>
                    </article>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {search ? `No se encontraron ofertas para "${search}".` : "Pronto publicaremos nuevas ofertas."}
              </p>
            )}
          </div>
        )}

        {tab === "empresa" && (
          <div className="mt-6">
            {students.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {students.map((s) => (
                  <article
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className={`flex cursor-pointer flex-col gap-4 rounded-3xl border p-5 shadow-sm transition hover:shadow-md ${
                      s.is_featured
                        ? "border-amber-300 bg-linear-to-br from-amber-50 to-card dark:border-amber-700/60 dark:from-amber-950/25"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {s.profile_photo ? (
                        <img
                          src={`${ASSET_BASE_URL}${s.profile_photo}`}
                          alt={`${s.first_name} ${s.last_name}`}
                          className="h-12 w-12 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                          {s.first_name?.[0] ?? "E"}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold text-foreground">
                            {s.first_name} {s.last_name}
                          </p>
                          {s.is_featured && (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                              <Star className="size-3 fill-amber-500" />
                              Destacado
                            </span>
                          )}
                        </div>
                        {s.zone && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3 shrink-0" />
                            {s.zone}
                          </p>
                        )}
                      </div>
                    </div>

                    {s.career && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="mt-0.5 size-4 shrink-0" />
                        <span>{s.career}{s.semester ? ` · Sem. ${s.semester}` : ""}</span>
                      </div>
                    )}

                    {s.bio && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{s.bio}</p>
                    )}

                    <p className="mt-auto text-xs text-muted-foreground">Toca para ver contacto →</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aún no hay estudiantes disponibles en el directorio.
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
