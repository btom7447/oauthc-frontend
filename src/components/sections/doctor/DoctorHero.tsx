"use client";

import { MapPin } from "lucide-react";
import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";

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

export default function DoctorHero({ doctor }: Props) {
  const imageSrc =
    doctor.image ||
    (doctor.gender === "female"
      ? "/images/doctors/female-doctor.png"
      : "/images/doctors/male-doctor.png");

  return (
    <section className="bg-green-900 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 items-center">
        {/* Doctor image */}
        <img
          src={imageSrc}
          alt={doctor.name}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
          className="w-48 h-48 rounded-full object-cover object-top border-4 border-white/20 shadow-xl shrink-0"
        />

        {/* Details */}
        <div className="flex flex-col gap-3">
          <p className="text-green-300 text-sm">
            {doctor.qualifications.join(", ")}
          </p>

          <h1 className="text-white text-3xl md:text-5xl font-bold font-yeseva leading-tight">
            {doctor.name}
          </h1>

          <p className="text-red-400 text-lg font-semibold">{doctor.specialty}</p>

          <span className="flex items-center gap-1.5 text-green-200 text-sm">
            <MapPin size={14} className="shrink-0" />
            {doctor.center}
          </span>

          <p className="text-green-200 text-sm">
            {doctor.yearsOfExperience} years of clinical experience
          </p>

          {/* Language chips */}
          <div className="flex flex-wrap gap-2">
            {doctor.languages.map((lang) => (
              <span
                key={lang}
                className="bg-white/10 text-white text-xs px-2 py-1 rounded-full"
              >
                {lang}
              </span>
            ))}
          </div>

          {/* Social icons */}
          {doctor.social && (
            <div className="flex items-center gap-2">
              {doctor.social.linkedin && (
                <a
                  href={doctor.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn size={14} />
                </a>
              )}
              {doctor.social.facebook && (
                <a
                  href={doctor.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={14} />
                </a>
              )}
              {doctor.social.instagram && (
                <a
                  href={doctor.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
                  aria-label="Instagram"
                >
                  <FaInstagram size={14} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
