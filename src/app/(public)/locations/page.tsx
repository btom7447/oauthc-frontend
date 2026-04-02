"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { api } from "@/lib/api-client";
import PageBreadcrumb from "@/components/shared/breadcrumb";
import LocationCard, { type Location } from "@/components/cards/LocationCard";
import LocationCardSkeleton from "@/components/skeleton/LocationCardSkeleton";
import type { LocationPin } from "@/components/sections/contact/LeafletMap";

const LeafletMap = dynamic(() => import("@/components/sections/contact/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <MapPin size={32} className="text-gray-300" strokeWidth={1.5} />
    </div>
  ),
});

type APILocation = Location & {
  id: string;
  type: "main" | "department" | "centre";
  status: "active" | "inactive";
  lat: number;
  lng: number;
};

function toPinType(t: APILocation["type"]): LocationPin["type"] {
  if (t === "main") return "hospital";
  if (t === "centre") return "center";
  return "department";
}

export default function LocationsPage() {
  const [allLocations, setAllLocations] = useState<APILocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api.get<APILocation[]>("/cms/locations?limit=100", { auth: false });
      if (res.ok && res.data) setAllLocations(res.data);
      setIsLoading(false);
    })();
  }, []);

  // Cards: exclude department type
  const cardLocations = useMemo(
    () => allLocations.filter((l) => l.type !== "department"),
    [allLocations]
  );

  // Map pins: all locations with coordinates
  const pins: LocationPin[] = useMemo(
    () =>
      allLocations
        .filter((l) => l.lat && l.lng)
        .map((l) => ({
          name: l.name,
          type: toPinType(l.type),
          address: l.address,
          mapsQuery: l.mapsQuery,
          lat: l.lat,
          lng: l.lng,
        })),
    [allLocations]
  );

  return (
    <>
      <PageBreadcrumb
        bgImage="/images/breadcrumb/contact.jpg"
        title="Our Locations"
        links={[{ label: "Locations" }]}
      />

      {/* Map */}
      <div className="h-105 w-full border-b border-gray-200 shadow-sm">
        {isLoading ? (
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

      <section className="w-full bg-gray-50 py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-14">
          {/* Intro paragraph */}
          <div className="max-w-3xl flex flex-col gap-4">
            <p className="text-green-900 uppercase text-xl font-semibold tracking-wide">
              Find Us
            </p>
            <h2 className="text-red-600 text-3xl md:text-4xl font-semibold font-yeseva leading-snug">
              Where to Find Us
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Our hospital is committed to providing quality healthcare to
              patients in various locations. We have multiple units spread
              across the region, each equipped with state-of-the-art facilities
              and staffed by experienced healthcare professionals. Whether
              you&apos;re in need of emergency care, routine check-ups, or
              specialized treatment, our hospitals are conveniently located to
              serve you.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              From urban centers to rural areas, our hospitals are easily
              accessible by car or public transportation. We understand the
              importance of timely medical attention, which is why we&apos;ve
              strategically positioned our units to minimize travel time and
              maximize care. Browse our list of locations to find the hospital
              nearest you, and rest assured that you&apos;ll receive the same high
              standard of care at any of our facilities.
            </p>
          </div>

          {/* Locations list */}
          <div className="flex flex-col divide-y divide-gray-200">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <LocationCardSkeleton key={i} />
                ))
              : cardLocations.map((loc) => (
                  <LocationCard key={loc.id} loc={loc} />
                ))}
          </div>
        </div>
      </section>
    </>
  );
}
