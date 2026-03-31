import PageBreadcrumb from "@/components/shared/breadcrumb";
import DiseaseOverview from "@/components/sections/disease/DiseaseOverview";
import DiseaseGallery from "@/components/sections/disease/DiseaseGallery";
import DiseaseSymptoms from "@/components/sections/disease/DiseaseSymptoms";
import DiseaseCauses from "@/components/sections/disease/DiseaseCauses";
import DiseaseWhenToSeeDoctor from "@/components/sections/disease/DiseaseWhenToSeeDoctor";
import DiseaseTreatment from "@/components/sections/disease/DiseaseTreatment";
import DiseasePrevention from "@/components/sections/disease/DiseasePrevention";
import { getDiseaseDetail } from "@/lib/diseases-data";
import { ClipboardList } from "lucide-react";

export default async function DiseaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const disease = getDiseaseDetail(slug);

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
          <DiseaseOverview
            name={disease.name}
            category={disease.category}
            paragraphs={disease.overview}
          />

          <DiseaseGallery images={disease.images} name={disease.name} />
          <DiseaseSymptoms symptoms={disease.symptoms} />
          <DiseaseCauses causes={disease.causes} />
          <DiseaseWhenToSeeDoctor points={disease.whenToSeeDoctor} />
          <DiseaseTreatment points={disease.treatment} />
          <DiseasePrevention points={disease.prevention} />
        </div>
      </section>
    </>
  );
}
