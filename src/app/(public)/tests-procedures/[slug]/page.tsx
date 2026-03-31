import PageBreadcrumb from "@/components/shared/breadcrumb";
import TestOverview from "@/components/sections/test/TestOverview";
import TestGallery from "@/components/sections/test/TestGallery";
import TestWhyItsDone from "@/components/sections/test/TestWhyItsDone";
import TestHowToPrepare from "@/components/sections/test/TestHowToPrepare";
import TestWhatToExpect from "@/components/sections/test/TestWhatToExpect";
import TestResults from "@/components/sections/test/TestResults";
import TestLimitations from "@/components/sections/test/TestLimitations";
import { getTestDetail } from "@/lib/tests-data";
import { ClipboardList } from "lucide-react";

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = getTestDetail(slug);

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
          <TestOverview
            name={test.name}
            category={test.category}
            paragraphs={test.overview}
          />

          <TestGallery images={test.images} name={test.name} />

          <TestWhyItsDone points={test.whyItsDone} />

          <TestHowToPrepare steps={test.howToPrepare} />

          <TestWhatToExpect points={test.whatToExpect} />

          <TestResults points={test.results} />

          {test.limitations.length > 0 && (
            <TestLimitations points={test.limitations} />
          )}

          {/* CTA */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-900/10 flex items-center justify-center shrink-0">
                <ClipboardList size={18} className="text-green-900" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-base">
                  Need to book a {test.name}?
                </p>
                <p className="text-gray-500 text-sm">
                  Schedule an appointment with our diagnostic team at OAUTHC.
                </p>
              </div>
            </div>
            <a
              href="/#bookingForm"
              className="shrink-0 bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-6 py-3 rounded-lg transition"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
