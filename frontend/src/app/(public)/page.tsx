import { ForCompaniesSection } from "@/features/public/landing/components/for-companies-section";
import { ForStudentsSection } from "@/features/public/landing/components/for-students-section";
import { HeroSection } from "@/features/public/landing/components/hero-section";
import { LatestJobsSection } from "@/features/public/landing/components/latest-jobs-section";
import { StatsSection } from "@/features/public/landing/components/stats-section";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <LatestJobsSection />
      <section className="border-t border-border bg-muted">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-2 lg:px-8">
          <ForStudentsSection />
          <ForCompaniesSection />
        </div>
      </section>
    </>
  );
}
