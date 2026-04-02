import { notFound } from "next/navigation";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import TestOverview from "@/components/sections/test/TestOverview";
import TestGallery from "@/components/sections/test/TestGallery";
import TestWhyItsDone from "@/components/sections/test/TestWhyItsDone";
import TestHowToPrepare from "@/components/sections/test/TestHowToPrepare";
import TestWhatToExpect from "@/components/sections/test/TestWhatToExpect";
import TestResults from "@/components/sections/test/TestResults";
import TestLimitations from "@/components/sections/test/TestLimitations";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

type APITest = {
  name: string;
  slug: string;
  category: string;
  overview: string[];
  images: string[];
  whyItsDone: string[];
  howToPrepare: string[];
  whatToExpect: string[];
  results: string[];
  limitations: string[];
};

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`${API}/cms/tests/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) notFound();

  const json = await res.json();
  const test: APITest = json.data;

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/tests-procedures.jpg"
        title={test.name}
        links={[
          { label: "Tests & Procedures", href: "/tests-procedures" },
          { label: test.name },
        ]}
      />

      <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-14">
          {test.overview?.length > 0 && (
            <TestOverview
              name={test.name}
              category={test.category}
              paragraphs={test.overview}
            />
          )}

          {test.images?.length > 0 && (
            <TestGallery images={test.images} name={test.name} />
          )}

          {test.whyItsDone?.length > 0 && (
            <TestWhyItsDone points={test.whyItsDone} />
          )}

          {test.howToPrepare?.length > 0 && (
            <TestHowToPrepare steps={test.howToPrepare} />
          )}

          {test.whatToExpect?.length > 0 && (
            <TestWhatToExpect points={test.whatToExpect} />
          )}

          {test.results?.length > 0 && (
            <TestResults points={test.results} />
          )}

          {test.limitations?.length > 0 && (
            <TestLimitations points={test.limitations} />
          )}
        </div>
      </section>
    </>
  );
}
