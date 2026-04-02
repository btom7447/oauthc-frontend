import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import HealthServiceSidebar from "@/components/sections/health-service/HealthServiceSidebar";
import HealthServiceHero from "@/components/sections/health-service/HealthServiceHero";
import HealthServiceOverview from "@/components/sections/health-service/HealthServiceOverview";
import HealthServiceKeyPoints from "@/components/sections/health-service/HealthServiceKeyPoints";
import HealthServiceApproach from "@/components/sections/health-service/HealthServiceApproach";
import HealthServiceWhatToExpect from "@/components/sections/health-service/HealthServiceWhatToExpect";
import type { HealthServiceItem } from "@/lib/health-services-data";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

type APIService = {
  id: string;
  title: string;
  slug: string;
  image: string;
  tagline: string;
  iconKey: string;
  overview: string[];
  keyPoints: string[];
  additionalInfo: string[];
  whatToExpect: { title: string; detail: string }[];
};

function toItem(s: APIService): HealthServiceItem {
  return { name: s.title, slug: s.slug, image: s.image || "", tagline: s.tagline || "", iconKey: s.iconKey || "" };
}

export default async function HealthServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [detailRes, listRes] = await Promise.all([
    fetch(`${API}/cms/health-services/${slug}`, { next: { revalidate: 60 } }),
    fetch(`${API}/cms/health-services?limit=200`, { next: { revalidate: 60 } }),
  ]);

  if (!detailRes.ok) notFound();

  const detailJson = await detailRes.json();
  const service: APIService = detailJson.data;

  const listJson = listRes.ok ? await listRes.json() : { data: [] };
  const allServices: HealthServiceItem[] = (listJson.data || []).map(toItem);

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/health-services.jpg"
        title={service.title}
        links={[
          { label: "Health Services", href: "/health-services" },
          { label: service.title },
        ]}
      />

      <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-12">
            <HealthServiceHero
              name={service.title}
              tagline={service.tagline}
              image={service.image}
            />
            {service.overview?.length > 0 && (
              <HealthServiceOverview paragraphs={service.overview} />
            )}
            {service.keyPoints?.length > 0 && (
              <HealthServiceKeyPoints points={service.keyPoints} />
            )}
            {service.additionalInfo?.length > 0 && (
              <HealthServiceApproach paragraphs={service.additionalInfo} />
            )}
            {service.whatToExpect?.length > 0 && (
              <HealthServiceWhatToExpect steps={service.whatToExpect} />
            )}
          </div>

          {/* Sidebar */}
          <HealthServiceSidebar services={allServices} />
        </div>
      </section>
    </>
  );
}
