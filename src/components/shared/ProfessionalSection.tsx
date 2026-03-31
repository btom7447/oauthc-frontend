"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import ProfessionalCard, { ProfessionalCardSkeleton } from "./ProfessionalCard";

type Professional = {
  name: string;
  role: string;
  slug: string;
  image: string;
  social?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
};

const mockProfessionals: Professional[] = [
  {
    name: "Dr. Sarah Johnson",
    role: "Cardiologist",
    slug: "dr-sarah-johnson",
    image: "/images/doctors/test-doctor.png",
    social: { linkedin: "#", facebook: "#", instagram: "#" },
  },
  {
    name: "Dr. Michael Lee",
    role: "Neurologist",
    slug: "dr-michael-lee",
    image: "/images/doctors/test-doctor.png",
    social: { linkedin: "#", facebook: "#", instagram: "#" },
  },
  {
    name: "Dr. Amina Bello",
    role: "Pediatrician",
    slug: "dr-amina-bello",
    image: "/images/doctors/test-doctor.png",
    social: { linkedin: "#", instagram: "#" },
  },
  {
    name: "Dr. Chukwuma Eze",
    role: "Orthopedic Surgeon",
    slug: "dr-chukwuma-eze",
    image: "/images/doctors/test-doctor.png",
    social: { linkedin: "#", facebook: "#" },
  },
];

export default function ProfessionalsSection() {
  const [data, setData] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockProfessionals);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="text-center">
          <p className="text-green-900 uppercase text-xl font-semibold tracking-wide">
            Trusted Health Professionals
          </p>
          <h2 className="text-red-600 text-3xl md:text-5xl font-semibold font-yeseva mt-2">
            Our Professionals
          </h2>
        </div>

        {/* Carousel */}
        {loading ? (
          // Skeleton grid mirrors carousel breakpoints
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProfessionalCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {data.map((prof) => (
                <div
                  key={prof.slug}
                  className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
                >
                  <ProfessionalCard prof={prof} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
