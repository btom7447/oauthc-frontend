import PageBreadcrumb from "@/components/shared/breadcrumb";
import HealthServiceSidebar from "@/components/sections/health-service/HealthServiceSidebar";
import HealthServiceHero from "@/components/sections/health-service/HealthServiceHero";
import HealthServiceOverview from "@/components/sections/health-service/HealthServiceOverview";
import HealthServiceKeyPoints from "@/components/sections/health-service/HealthServiceKeyPoints";
import HealthServiceApproach from "@/components/sections/health-service/HealthServiceApproach";
import HealthServiceWhatToExpect from "@/components/sections/health-service/HealthServiceWhatToExpect";
import HealthServiceCTA from "@/components/sections/health-service/HealthServiceCTA";
import { ALL_HEALTH_SERVICES, getHealthServiceDetail } from "@/lib/health-services-data";

export default async function HealthServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getHealthServiceDetail(slug);

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/health-services.jpg"
        title={service.name}
        links={[
          { label: "Health Services", href: "/health-services" },
          { label: service.name },
        ]}
      />

      <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-12">
            <HealthServiceHero
              name={service.name}
              tagline={service.tagline}
              image={service.image}
            />
            <HealthServiceOverview paragraphs={service.overview} />
            <HealthServiceKeyPoints points={service.keyPoints} />
            <HealthServiceApproach paragraphs={service.additionalInfo} />
            <HealthServiceWhatToExpect steps={service.whatToExpect} />
          </div>

          {/* Sidebar */}
          <HealthServiceSidebar services={ALL_HEALTH_SERVICES} />
        </div>
      </section>
    </>
  );
}
