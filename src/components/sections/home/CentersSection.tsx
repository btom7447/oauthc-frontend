"use client";

import { useEffect, useState } from "react";
import { MapPin, Building2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { CenterCardSkeleton } from "@/components/skeleton/CenterCardSkeleton";

type APILocation = {
  id: string;
  name: string;
  slug: string;
  image: string;
  address: string;
  type: "main" | "department" | "centre";
};

function CenterCard({ loc }: { loc: APILocation }) {
  return (
    <a
      href={`/locations`}
      className="group relative block rounded-xl overflow-hidden aspect-4/3 bg-gray-900"
    >
      {/* Background image */}
      {loc.image ? (
        <img
          src={loc.image}
          alt={loc.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-800" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors duration-300" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <h3 className="font-semibold text-lg leading-snug">{loc.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-300">
          <MapPin size={12} className="shrink-0" />
          {loc.address}
        </p>
      </div>
    </a>
  );
}

export default function CentersSection() {
  const [centers, setCenters] = useState<APILocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api.get<APILocation[]>("/cms/locations?limit=100", { auth: false });
      if (res.ok && res.data) {
        // Exclude department type — only main campuses and centres
        setCenters(res.data.filter((l) => l.type !== "department"));
      }
      setLoading(false);
    })();
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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <CenterCardSkeleton key={i} />
            ))}
          </div>
        ) : centers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <Building2 size={24} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm">Our centres and locations are being updated. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {centers.map((loc) => (
              <CenterCard key={loc.id} loc={loc} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
