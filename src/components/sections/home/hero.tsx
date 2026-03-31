"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  CalendarDays,
  StethoscopeIcon,
  GraduationCap,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { showComingSoon } from "@/lib/toast";

const slides = [
  {
    id: 1,
    image: "/images/hero-carousel/image-one.png",
    title: "Leading the Way in Medical Excellence",
    subtitle: "Caring for Life",
    cta: {
      label: "Book Appointment",
      href: "/#bookingForm",
      icon: CalendarDays,
    },
  },
  {
    id: 2,
    image: "/images/hero-carousel/image-two.png",
    title: "Advanced Healthcare Solutions",
    subtitle: "Trusted by Patients",
    cta: {
      label: "Explore Services",
      href: "/health-services",
      icon: StethoscopeIcon,
    },
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="relative">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => {
            const Icon = slide.cta.icon;

            return (
              <div
                key={slide.id}
                className="relative min-w-full h-[75vh] flex items-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Content (LEFT ALIGNED) */}
                <div className="relative z-10 text-left text-white max-w-2xl px-6 md:px-12">
                  <h5 className="text-sm md:text-base opacity-80">
                    {slide.subtitle}
                  </h5>

                  <h1 className="text-3xl md:text-5xl font-bold mt-4 leading-tight">
                    {slide.title}
                  </h1>

                  <div className="mt-6">
                    <Link
                      href={slide.cta.href}
                      className="bg-green-900 text-white hover:bg-green-700 transition px-6 py-3 rounded-md flex items-center gap-2 w-fit"
                    >
                      <Icon size={18} />
                      {slide.cta.label}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating CTA Bar (ABOVE carousel) */}
      <div className="absolute bottom-0 left-0 w-full z-20 translate-y-1/2">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-4">
          <Link
            href="/#bookingForm"
            className="flex items-center gap-3 bg-green-900 text-white p-5 rounded-md shadow-lg hover:bg-green-800 transition"
          >
            <Calendar size={40} strokeWidth={1} />
            <span className="font-medium">Book an Appointment</span>
          </Link>

          <Link
            href="/diseases-symptoms"
            className="flex items-center gap-3 bg-green-900 text-white p-5 rounded-md shadow-lg hover:bg-green-800 transition"
          >
            <StethoscopeIcon size={40} strokeWidth={1} />
            <span className="font-medium">Diseases & Symptoms</span>
          </Link>

          <button
            onClick={() => showComingSoon("Student Portal")}
            className="flex items-center gap-3 bg-green-900 text-white p-5 rounded-md shadow-lg hover:bg-green-800 transition"
          >
            <GraduationCap size={40} strokeWidth={1} />
            Student Portal
          </button>
        </div>
      </div>
    </section>
  );
}
