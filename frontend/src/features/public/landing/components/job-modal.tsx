"use client";

import { X } from "lucide-react";

import type { Job } from "@/types";
import { JobModalHeader } from "./job-modal-header";
import { JobModalDetails } from "./job-modal-details";
import { JobModalContact } from "./job-modal-contact";

export function JobModal({ job, onClose }: { job: Job; onClose: () => void }) {
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

        <JobModalHeader job={job} />

        <h2 className="mt-4 text-2xl font-black text-foreground">{job.title}</h2>

        <JobModalDetails job={job} />
        <JobModalContact job={job} />
      </div>
    </div>
  );
}
