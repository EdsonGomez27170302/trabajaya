import { formatSalary } from "@/lib/format";
import type { Job } from "@/types";

export function LatestJobCardFooter({ job }: { job: Job }) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <span className="text-sm font-semibold text-foreground">{formatSalary(job)}</span>
      <span className="text-xs text-muted-foreground">
        {job.vacancies} vacante{job.vacancies === 1 ? "" : "s"}
      </span>
    </div>
  );
}
