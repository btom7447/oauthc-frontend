"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";
import ProfessionalCard, { ProfessionalCardSkeleton } from "./ProfessionalCard";
import { api } from "@/lib/api-client";

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

type DoctorAPI = {
  id: string;
  name: string;
  slug: string;
  image: string;
  specialty: string;
  social?: { linkedin?: string; facebook?: string; instagram?: string };
};

export default function ProfessionalsSection() {
  const [data, setData] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  useEffect(() => {
    (async () => {
      const res = await api.get<DoctorAPI[]>("/cms/doctors?limit=8", { auth: false });
      if (res.ok && res.data) {
        setData(
          res.data.map((d) => ({
            name: d.name,
            role: d.specialty,
            slug: d.slug,
            image: d.image || "/images/doctors/test-doctor.png",
            social: d.social,
          }))
        );
      }
      setLoading(false);
    })();
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProfessionalCardSkeleton key={i} />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <Stethoscope size={24} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm">Our doctor profiles are being updated. Check back soon.</p>
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
