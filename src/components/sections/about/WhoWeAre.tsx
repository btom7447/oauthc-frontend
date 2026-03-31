"use client";

const FALLBACK = "/logo.png";

export default function WhoWeAreSection() {
  return (
    <section className="w-full bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">

        {/* LEFT: Image */}
        <div className="relative w-full">
          <img
            src="/images/about-section/who-we-are.png"
            alt="OAUTHC Medical Team"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
            className="w-full rounded-2xl object-cover aspect-4/5 shadow-md"
          />
          {/* Floating accent badge */}
          <div className="absolute bottom-6 -right-4 bg-green-900 text-white px-5 py-4 rounded-xl shadow-lg hidden md:flex flex-col gap-0.5">
            <span className="text-3xl font-bold">30+</span>
            <span className="text-xs text-green-300 uppercase tracking-wide">Years of Excellence</span>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-green-900 uppercase text-xl font-semibold tracking-wide">
              Who We Are
            </p>
            <h2 className="text-red-600 text-3xl md:text-5xl font-semibold font-yeseva mt-2 leading-tight">
              Transforming Healthcare in Nigeria
            </h2>
            <p className="mt-4 text-gray-600 text-base leading-relaxed">
              The Obafemi Awolowo University Teaching Hospitals Complex (OAUTHC)
              is one of Nigeria's foremost tertiary health institutions. Established
              to deliver world-class clinical care, medical training, and research,
              OAUTHC has served millions of patients across Osun State and beyond.
              We combine cutting-edge medical technology with a deeply human approach
              to healthcare — ensuring every patient is treated with dignity,
              compassion, and clinical excellence.
            </p>
          </div>

          {/* Sub-section 1 */}
          <div className="flex flex-col gap-2 border-l-4 border-green-900 pl-5">
            <h3 className="text-xl font-bold text-gray-900">
              Top Rankings for Quality Care
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              OAUTHC consistently ranks among Nigeria's highest-rated tertiary
              hospitals for clinical outcomes, patient safety, and service delivery.
              Our accreditation spans over 30 specialties, and our multidisciplinary
              teams are trained to handle the most complex medical cases — from
              neurosurgery and cardiology to oncology and paediatric medicine.
            </p>
          </div>

          {/* Sub-section 2 */}
          <div className="flex flex-col gap-2 border-l-4 border-red-500 pl-5">
            <h3 className="text-xl font-bold text-gray-900">
              A Legacy of Research & Education
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              As a teaching hospital affiliated with Obafemi Awolowo University,
              we are at the forefront of medical education and clinical research in
              West Africa. We train hundreds of resident doctors, nurses, and allied
              health professionals annually — shaping the next generation of
              healthcare leaders committed to advancing medicine across the continent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
