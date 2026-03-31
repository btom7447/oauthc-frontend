"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Testimonial = {
  name: string;
  role?: string;
  text: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    name: "John Doe",
    role: "Patient",
    text: "The care I received was exceptional. The staff was professional and very attentive throughout my visit.",
    rating: 5,
  },
  {
    name: "Sarah Williams",
    role: "Patient",
    text: "Booking an appointment was seamless and the doctors were very knowledgeable and kind.",
    rating: 4,
  },
  {
    name: "Michael Brown",
    role: "Patient",
    text: "Highly recommend this clinic. Great service and a very clean environment.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  const current = testimonials[index];

  return (
    <section className="w-full bg-gray-100 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="text-center">
          <p className="text-green-900 uppercase text-xl font-semibold tracking-wide">
            Testimonials
          </p>
          <h2 className="text-red-600 text-3xl md:text-5xl font-semibold font-yeseva mt-2">
            What Our Patients Say
          </h2>
        </div>

        {/* Card */}
        <div className="relative w-full">
          {/* Quote icon */}
          <Quote
            size={48}
            className="text-green-900/10 absolute -top-4 left-0 rotate-180"
            strokeWidth={1}
          />

          <div className="flex flex-col gap-6 px-2 md:px-10 pt-6 ml-10">
            {/* Stars */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < current.rating
                      ? "fill-amber-500 text-amber-500"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>

            {/* Text */}
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
              &ldquo;{current.text}&rdquo;
            </p>

            {/* Author + Nav row */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              {/* Author */}
              <div>
                <p className="font-semibold text-gray-900">{current.name}</p>
                {current.role && (
                  <p className="text-sm text-gray-400">{current.role}</p>
                )}
              </div>

              {/* Arrow buttons */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white hover:border-green-900 hover:text-green-900 transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-green-900 text-white hover:bg-green-800 transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
