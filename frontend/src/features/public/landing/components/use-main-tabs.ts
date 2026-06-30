"use client";

import { useState } from "react";

import type { Job, StudentProfile } from "@/types";
import type { Tab } from "./tabs-section-types";

export function useMainTabs(jobs: Job[]) {
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

  return {
    tab,
    setTab,
    search,
    setSearch,
    selectedJob,
    setSelectedJob,
    selectedStudent,
    setSelectedStudent,
    filteredJobs,
  };
}
