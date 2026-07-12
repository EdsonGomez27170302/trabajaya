"use client";

import type { Job, StudentProfile } from "@/types";
import { JobModal } from "./job-modal";
import { StudentModal } from "./student-modal";
import { TabSwitcher } from "./tab-switcher";
import { JobsSearchPanel } from "./jobs-search-panel";
import { StudentsPanel } from "./students-panel";
import { useMainTabs } from "./use-main-tabs";

interface Props {
  jobs: Job[];
  students: StudentProfile[];
}

export function MainTabsSection({ jobs, students }: Props) {
  const {
    tab,
    setTab,
    search,
    setSearch,
    selectedJob,
    setSelectedJob,
    selectedStudent,
    setSelectedStudent,
    filteredJobs,
  } = useMainTabs(jobs);

  return (
    <>
      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
      {selectedStudent && <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <TabSwitcher tab={tab} onChange={setTab} />

        {tab !== "empresa" && (
          <JobsSearchPanel
            search={search}
            onSearchChange={setSearch}
            jobs={filteredJobs}
            onSelectJob={setSelectedJob}
          />
        )}

        {tab === "todas" && (
          <StudentsPanel students={students} onSelectStudent={setSelectedStudent} />
        )}

        {tab === "empresa" && <StudentsPanel students={students} onSelectStudent={setSelectedStudent} />}
      </section>
    </>
  );
}
