"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { CenterCardSkeleton } from "@/components/skeleton/CenterCardSkeleton";

// CMS type — replace fetch logic with your CMS client
export type Center = {
  id: string;
  name: string;
  address: string;
  image: string;
  slug: string;
};

function CenterCard({ center }: { center: Center }) {
  return (
    <a
      href={`/locations/${center.slug}`}
      className="group relative block rounded-xl overflow-hidden aspect-4/3 bg-gray-900"
    >
      {/* Background image */}
      <img
        src={center.image}
        alt={center.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors duration-300" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <h3 className="font-semibold text-lg leading-snug">{center.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-300">
          <MapPin size={12} className="shrink-0" />
          {center.address}
        </p>
      </div>
    </a>
  );
}

async function fetchCenters(): Promise<Center[]> {
  // TODO: replace with CMS fetch, e.g. await client.fetch(groq`*[_type == "center"]`)
  return [
    {
      id: "1",
      name: "OAUTHC Main Campus",
      address: "Ile-Ife, Osun State",
      image: "/images/centers/ife-unit.png",
      slug: "main-campus",
    },
    {
      id: "2",
      name: "Wesley Guild Hospital",
      address: "Ilesa, Osun State",
      image: "/images/centers/ife-unit.png",
      slug: "wesley-guild",
    },
    {
      id: "3",
      name: "Urban Comprehensive Health Centre",
      address: "Ile-Ife, Osun State",
      image: "/images/centers/ife-unit.png",
      slug: "urban-health-centre",
    },
    {
      id: "4",
      name: "Dental Centre",
      address: "Ile-Ife, Osun State",
      image: "/images/centers/ife-unit.png",
      slug: "dental-centre",
    },
  ];
}

export default function CentersSection() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCenters().then((data) => {
      setCenters(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="w-full bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="text-center">
          <p className="text-green-900 uppercase text-xl font-semibold tracking-wide">
            Places we can be found
          </p>
          <h2 className="text-red-600 text-3xl md:text-5xl font-semibold font-yeseva mt-2">
            Our Centers of Excellence
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <CenterCardSkeleton key={i} />
              ))
            : centers.map((center) => (
                <CenterCard key={center.id} center={center} />
              ))}
        </div>
      </div>
    </section>
  );
}
