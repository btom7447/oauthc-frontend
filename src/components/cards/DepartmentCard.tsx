"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const FALLBACK = "/logo.png";

type DepartmentCardProps = {
  name: string;
  slug: string;
  image: string;
};

export default function DepartmentCard({ name, slug, image }: DepartmentCardProps) {
  return (
    <Link
      href={"/departments-centers/" + slug}
      className="rounded-xl overflow-hidden relative group cursor-pointer block"
    >
      {/* Image container */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={image || FALLBACK}
          alt={name}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* White strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <span className="text-gray-900 font-semibold text-sm">{name}</span>
          <ChevronRight size={16} className="text-green-700 flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}
