"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Props = {
  name: string;
  slug: string;
  image: string;
  tagline: string;
};

const FALLBACK = "/logo.png";

export default function HealthServiceCard({ name, slug, image, tagline }: Props) {
  const src = image.trim() || FALLBACK;

  return (
    <Link
      href={"/health-services/" + slug}
      className="rounded-xl overflow-hidden relative group cursor-pointer block"
    >
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={src}
          alt={name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK;
          }}
          className={
            src === FALLBACK
              ? "w-24 h-24 object-contain opacity-40"
              : "object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          }
        />
        <div className="absolute inset-0 bg-linear-to-t from-green-950/70 via-transparent to-transparent" />
      </div>

      {/* White strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-gray-900 font-semibold text-sm block truncate">{name}</span>
            <span className="text-gray-400 text-xs truncate block">{tagline}</span>
          </div>
          <ChevronRight size={16} className="text-green-700 shrink-0" />
        </div>
      </div>
    </Link>
  );
}
