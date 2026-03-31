"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { LocationPin } from "./LeafletMap";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <MapPin size={32} className="text-gray-300" strokeWidth={1.5} />
    </div>
  ),
});

const locations: LocationPin[] = [
  {
    name: "OAUTHC Main Campus",
    type: "hospital",
    address: "Ife-Ilesa Road, Ile-Ife, Osun State",
    lat: 7.4641,
    lng: 4.5521,
  },
  {
    name: "Wesley Guild Hospital",
    type: "hospital",
    address: "Ilesa, Osun State",
    lat: 7.6281,
    lng: 4.7366,
  },
  {
    name: "Accident & Emergency Unit",
    type: "department",
    address: "Main Campus, Ile-Ife, Osun State",
    lat: 7.4648,
    lng: 4.5515,
  },
  {
    name: "Radiology & Imaging Department",
    type: "department",
    address: "Main Campus, Ile-Ife, Osun State",
    lat: 7.4635,
    lng: 4.5528,
  },
  {
    name: "Cardiology Centre",
    type: "center",
    address: "Main Campus, Ile-Ife, Osun State",
    lat: 7.4644,
    lng: 4.5510,
  },
  {
    name: "Renal Dialysis Centre",
    type: "center",
    address: "Main Campus, Ile-Ife, Osun State",
    lat: 7.4638,
    lng: 4.5534,
  },
  {
    name: "Oncology Centre",
    type: "center",
    address: "Main Campus, Ile-Ife, Osun State",
    lat: 7.4651,
    lng: 4.5508,
  },
  {
    name: "Eye Centre",
    type: "center",
    address: "Main Campus, Ile-Ife, Osun State",
    lat: 7.4633,
    lng: 4.5542,
  },
];

const TYPE_STYLES = {
  hospital: { dot: "bg-red-600", badge: "bg-red-50 text-red-700 border border-red-100", label: "Hospital" },
  department: { dot: "bg-green-700", badge: "bg-green-50 text-green-800 border border-green-100", label: "Department" },
  center: { dot: "bg-blue-600", badge: "bg-blue-50 text-blue-700 border border-blue-100", label: "Centre" },
} satisfies Record<LocationPin["type"], { dot: string; badge: string; label: string }>;

export default function MapSection() {
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
        <LeafletMap locations={locations} />
      </div>
    </section>
  );
}
