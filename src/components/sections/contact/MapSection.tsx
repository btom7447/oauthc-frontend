"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { api } from "@/lib/api-client";
import type { LocationPin } from "./LeafletMap";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <MapPin size={32} className="text-gray-300" strokeWidth={1.5} />
    </div>
  ),
});

type APILocation = {
  id: string;
  name: string;
  address: string;
  mapsQuery: string;
  type: "main" | "department" | "centre";
  lat: number;
  lng: number;
};

/** Map backend type to pin color type */
function toPinType(t: APILocation["type"]): LocationPin["type"] {
  if (t === "main") return "hospital";
  if (t === "centre") return "center";
  return "department";
}

const TYPE_STYLES = {
  hospital: { dot: "bg-red-600", badge: "bg-red-50 text-red-700 border border-red-100", label: "Hospital" },
  department: { dot: "bg-green-700", badge: "bg-green-50 text-green-800 border border-green-100", label: "Department" },
  center: { dot: "bg-blue-600", badge: "bg-blue-50 text-blue-700 border border-blue-100", label: "Centre" },
} satisfies Record<LocationPin["type"], { dot: string; badge: string; label: string }>;

export default function MapSection() {
  const [pins, setPins] = useState<LocationPin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api.get<APILocation[]>("/cms/locations?limit=200", { auth: false });
      if (res.ok && res.data) {
        setPins(
          res.data
            .filter((l) => l.lat && l.lng)
            .map((l) => ({
              name: l.name,
              type: toPinType(l.type),
              address: l.address,
              mapsQuery: l.mapsQuery,
              lat: l.lat,
              lng: l.lng,
            }))
        );
      }
      setLoading(false);
    })();
  }, []);

  return (
    <section className="w-full bg-gray-50 pt-20">
      {/* Header + legend constrained */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-8 mb-12">
        <div className="text-center">
          <p className="text-green-900 uppercase text-xl font-semibold tracking-wide">
            Find Us
          </p>
          <h2 className="text-red-600 text-3xl md:text-5xl font-semibold font-yeseva mt-2">
            Our Locations
          </h2>
          <p className="mt-3 text-gray-500 text-base max-w-xl mx-auto">
            OAUTHC operates across multiple campuses, departments, and specialist
            centres across Osun State.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {(Object.values(TYPE_STYLES)).map(({ dot, badge, label }) => (
            <span
              key={label}
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Full-bleed map */}
      <div className="h-130 w-full border-y border-gray-200 shadow-sm">
        {loading ? (
          <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
            <MapPin size={32} className="text-gray-300" strokeWidth={1.5} />
          </div>
        ) : pins.length > 0 ? (
          <LeafletMap locations={pins} />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <p className="text-gray-400 text-sm">No locations with coordinates found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
