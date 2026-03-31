"use client";

import Image from "next/image";

export default function WelcomeSection() {
  return (
    <section className="w-full bg-white py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Subtitle */}
        <p className="font-work-sans text-green-900 text-md lg:text-2xl text-center font-semibold uppercase tracking-wide">
          Welcome to OAUTHC
        </p>

        {/* Title */}
        <h2 className="font-yeseva text-red-600 text-2xl lg:text-5xl text-center font-semibold leading-tight">
          Your Quality Healthcare is Guaranteed Here
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-md text-center font-work-sans mb-10">
          {/* You’ll replace this */}
          We are a leading healthcare institution committed to delivery quality
          healthcare to our patients, unwavering in using industry standard
          methodologies to produce highly competent health professionals, and
          actively contributing to build a healthier community.
        </p>
      </div>
      {/* IMAGE (LANDSCAPE POSTER) */}
      <div className="w-full">
        <div className="relative w-full h-45 md:h-90 rounded-lg overflow-hidden shadow-md">
          <Image
            src="/images/welcome-section/poster-one.png"
            alt="OAUTHC Poster"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>
    </section>
  );
}