import { getAvailableStudents, getLatestJobs } from "@/features/public/landing/actions/get-landing-data";
import { HeroSection } from "@/features/public/landing/components/hero-section";
import { MainTabsSection } from "@/features/public/landing/components/main-tabs-section";
import { StatsSection } from "@/features/public/landing/components/stats-section";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [jobs, students] = await Promise.all([
    getLatestJobs(),
    getAvailableStudents(),
  ]);

  return (
    <>
      <HeroSection />
      <StatsSection />
      <MainTabsSection jobs={jobs} students={students} />
    </>
  );
}
