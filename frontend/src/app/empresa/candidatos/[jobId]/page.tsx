import { CandidatesView } from "@/features/empresa/candidatos/components/candidates-view";

export default async function Page({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  return <CandidatesView jobId={jobId} />;
}
