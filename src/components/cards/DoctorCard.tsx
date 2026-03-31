"use client";

import Link from "next/link";
import { MapPin, ArrowRight, GraduationCap } from "lucide-react";

const FALLBACK = "/logo.png";

type Doctor = {
  name: string;
  slug: string;
  image?: string;
  gender: "male" | "female";
  specialty: string;
  yearsOfExperience: number;
  languages: string[];
  center: string;
  qualifications: string[];
  bio?: string[];
  expertise?: string[];
  education?: { degree: string; institution: string; year: string }[];
  social?: { linkedin?: string; facebook?: string; instagram?: string };
};

type Props = {
  doctor: Doctor;
};

export default function DoctorCard({ doctor }: Props) {
  const imageSrc =
    doctor.image ||
    (doctor.gender === "female"
      ? "/images/doctors/female-doctor.png"
      : "/images/doctors/male-doctor.png");

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 ">
      <div className="flex gap-4">
        {/* Left: avatar */}
        <img
          src={imageSrc}
          alt={doctor.name}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
          className="w-20 h-20 rounded-full object-cover object-top shrink-0 border-2 border-green-900/20"
        />

        {/* Right: details */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <p className="font-bold text-gray-900 text-base leading-snug">
            {doctor.name}
          </p>
          <p className="text-green-700 text-sm font-medium">
            {doctor.specialty}
          </p>
          <p className="text-gray-500 text-xs">
            {doctor.yearsOfExperience} years experience
          </p>
          <p className="text-gray-400 text-xs">
            {doctor.languages.join(" · ")}
          </p>
        </div>
      </div>
      <hr className="border-gray-100 my-2" />

      {/* Bottom row */}
      <div className="">
        {/* Left col: center + qualifications */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="flex items-center gap-1 text-gray-500 text-xs">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{doctor.center}</span>
          </span>
          <span className="flex items-center gap-1 text-gray-500 text-xs">
            <GraduationCap size={12} className="shrink-0" />
            <span className="truncate">
              {doctor.qualifications.join(", ")}
            </span>
          </span>
        </div>

        <div>
          {/* Right: profile link */}
          <Link
            href={`/doctors/${doctor.slug}`}
            className="text-xs font-semibold text-white bg-green-900 hover:bg-green-800 px-3 py-1.5 rounded-lg transition flex items-center gap-1 shrink-0 w-fit mt-3"
          >
            View Profile
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
