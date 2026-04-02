import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import DiseaseOverview from "@/components/sections/disease/DiseaseOverview";
import DiseaseGallery from "@/components/sections/disease/DiseaseGallery";
import DiseaseSymptoms from "@/components/sections/disease/DiseaseSymptoms";
import DiseaseCauses from "@/components/sections/disease/DiseaseCauses";
import DiseaseWhenToSeeDoctor from "@/components/sections/disease/DiseaseWhenToSeeDoctor";
import DiseaseTreatment from "@/components/sections/disease/DiseaseTreatment";
import DiseasePrevention from "@/components/sections/disease/DiseasePrevention";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

type APIDisease = {
  name: string;
  slug: string;
  category: string;
  overview: string[];
  images: string[];
  symptoms: string[];
  causes: string[];
  whenToSeeDoctor: string[];
  treatment: string[];
  prevention: string[];
};

export default async function DiseaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`${API}/cms/diseases/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) notFound();

  const json = await res.json();
  const disease: APIDisease = json.data;

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/diseases-symptoms.jpg"
        title={disease.name}
        links={[
          { label: "Diseases & Symptoms", href: "/diseases-symptoms" },
          { label: disease.name },
        ]}
      />

      <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-14">
          {disease.overview?.length > 0 && (
            <DiseaseOverview
              name={disease.name}
              category={disease.category}
              paragraphs={disease.overview}
            />
          )}

          {disease.images?.length > 0 && (
            <DiseaseGallery images={disease.images} name={disease.name} />
          )}

          {disease.symptoms?.length > 0 && (
            <DiseaseSymptoms symptoms={disease.symptoms} />
          )}

          {disease.causes?.length > 0 && (
            <DiseaseCauses causes={disease.causes} />
          )}

          {disease.whenToSeeDoctor?.length > 0 && (
            <DiseaseWhenToSeeDoctor points={disease.whenToSeeDoctor} />
          )}

          {disease.treatment?.length > 0 && (
            <DiseaseTreatment points={disease.treatment} />
          )}

          {disease.prevention?.length > 0 && (
            <DiseasePrevention points={disease.prevention} />
          )}
        </div>
      </section>
    </>
  );
}
