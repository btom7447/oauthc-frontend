"use client";

import Link from "next/link";
import Image from "next/image";
import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

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

export function ProfessionalCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-white">
      <Skeleton className="w-full h-72" />
      <div className="bg-green-900/10 p-4 flex flex-col gap-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-3 mt-1">
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="w-7 h-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function CardBody({ prof }: { prof: Professional }) {
  return (
    <div className="rounded-lg overflow-hidden bg-white">
      {/* Image */}
      <div className="relative w-full h-80">
        <Image
          src={prof.image}
          alt={prof.name}
          fill
          className="object-cover object-top group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Info */}
      <div className="bg-green-900 text-white p-4 flex flex-col justify-center items-center gap-3">
        <div>
          <h3 className="font-semibold text-center text-xl leading-tight">{prof.name}</h3>
          <p className="text-lg text-center text-white">{prof.role}</p>
        </div>

        {/* Social Icons */}
        {prof.social && (
          <div className="flex gap-2">
            {prof.social.linkedin && (
              <a
                href={prof.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <FaLinkedinIn size={13} />
              </a>
            )}
            {prof.social.facebook && (
              <a
                href={prof.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <FaFacebookF size={13} />
              </a>
            )}
            {prof.social.instagram && (
              <a
                href={prof.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <FaInstagram size={13} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfessionalCard({
  prof,
  clickable = true,
}: {
  prof: Professional;
  clickable?: boolean;
}) {
  if (!clickable) {
    return (
      <div className="group">
        <CardBody prof={prof} />
      </div>
    );
  }

  return (
    <Link href={`/doctors/${prof.slug}`} className="block group">
      <CardBody prof={prof} />
    </Link>
  );
}
