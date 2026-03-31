"use client";

import Link from "next/link";
import { CalendarCheck } from "lucide-react";

export default function AppointmentPoster() {
  return (
    <div>
      <section className="w-full bg-gray-100 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text */}
          <div className="flex flex-col gap-4 max-w-2xl text-center md:text-left">
            <p className="uppercase text-xl font-semibold tracking-widest text-green-900">
              Expert Care, On Your Schedule
            </p>
            <h2 className="text-green-900 text-3xl md:text-5xl font-semibold font-yeseva leading-tight">
              Ready to See a <span className="text-red-500">Doctor?</span>
            </h2>
            <p className="text-green-900 text-xl leading-relaxed">
              Our team of specialists is available to provide you with the best
              care. Book your appointment today and take the first step towards
              better health.
            </p>
          </div>

          {/* CTA */}
          <div className="shrink-0">
            <Link
              href="/#bookingForm"
              className="inline-flex items-center gap-2 bg-green-900 hover:bg-green-800 active:scale-95 text-white px-8 py-4 rounded-lg font-semibold text-base transition"
            >
              <CalendarCheck size={18} />
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Demarcation between poster and footer */}
      <div className="w-full h-1 bg-white" />
    </div>
  );
}
