import { ASSET_BASE_URL } from "@/lib/config";
import type { Job } from "@/types";

export function LatestJobCardLogo({ job }: { job: Job }) {
  if (job.company?.logo_url) {
    return (
      <img
        src={`${ASSET_BASE_URL}${job.company.logo_url}`}
        alt={job.company.company_name}
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }
  return <div className="h-10 w-10 rounded-full bg-muted" />;
}
