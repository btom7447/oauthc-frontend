"use client";

const FALLBACK = "/logo.png";

export default function PeopleAndCultureSection() {
  return (
    <section className="w-full bg-gray-100">
      <div className="flex flex-col lg:flex-row min-h-150">

        {/* LEFT: Image — full height, half width on desktop */}
        <div className="relative w-full lg:w-1/2 min-h-72 lg:min-h-full">
          <img
            src="/images/about-section/people-culture.png"
            alt="OAUTHC Medical Professional"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* Subtle right-side fade into the content on desktop */}
          <div className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-linear-to-r from-transparent to-white" />
        </div>

        {/* RIGHT: Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center gap-8 px-8 md:px-16 py-16 lg:py-24">
          {/* Label */}
          <p className="text-green-900 uppercase text-xl font-semibold tracking-wide">
            People & Culture
          </p>

          {/* Title */}
          <h2 className="text-red-600 text-3xl md:text-5xl font-semibold font-yeseva leading-tight">
            People Who Make the Difference
          </h2>

          {/* Paragraphs */}
          <div className="flex flex-col gap-5 text-gray-600 text-base leading-relaxed">
            <p>
              At OAUTHC, our greatest asset is our people. From the consultant
              neurosurgeon to the ward nurse, from the laboratory scientist to
              the hospital porter — every individual plays a vital role in
              delivering the standard of care our patients deserve. We believe
              that excellence in healthcare begins with people who are
              passionate, skilled, and deeply committed to the well-being of
              others.
            </p>
            <p>
              Our culture is built on mutual respect, continuous learning, and
              a shared sense of purpose. We invest in the growth of our staff
              through ongoing training, specialist development programmes, and
              an environment that encourages innovation. We celebrate
              diversity — drawing strength from the wide range of backgrounds,
              experiences, and perspectives that our workforce brings to the
              table every single day.
            </p>
            <p>
              We hold ourselves to a high standard — not just clinically, but
              in how we treat one another and the communities we serve. At
              OAUTHC, compassion is not just a value on a wall; it is woven
              into the fabric of everything we do. Our people are the heartbeat
              of this institution, and it is their dedication that continues to
              drive our mission forward, year after year.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
