"use client";

import { MapPin, Phone } from "lucide-react";

const FALLBACK = "/logo.png";

export type Location = {
  name: string;
  image: string;
  address: string;
  mapsQuery: string;
  contacts: { label?: string; number: string }[];
};

function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export default function LocationCard({ loc }: { loc: Location }) {
  const hasImage = loc.image.trim().length > 0;

  return (
    <div className="flex flex-col md:flex-row gap-6 py-8 first:pt-0 last:pb-0">
      {/* Image / Fallback */}
      <div className="shrink-0 w-full md:w-64 h-44 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
        {hasImage ? (
          <img
            src={loc.image}
            alt={loc.name}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK; }}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={FALLBACK}
            alt="OAUTHC"
            className="w-24 h-24 object-contain opacity-40"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 justify-center flex-1">
        <h3 className="text-gray-900 text-xl font-bold leading-snug">
          {loc.name}
        </h3>

        {/* Address — clickable to Google Maps */}
        <a
          href={mapsUrl(loc.mapsQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2 text-green-700 hover:text-green-900 text-sm transition group w-fit"
        >
          <MapPin
            size={15}
            className="shrink-0 mt-0.5 text-green-700 group-hover:text-green-900 transition"
          />
          <span className="underline underline-offset-2 decoration-green-700/40 group-hover:decoration-green-900 transition leading-relaxed">
            {loc.address}
          </span>
        </a>

        {/* Contact numbers */}
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {loc.contacts.map((c, j) => (
            <a
              key={j}
              href={`tel:${c.number.replace(/\s+/g, "")}`}
              className="flex items-center gap-1.5 text-gray-600 hover:text-green-900 text-sm transition"
            >
              <Phone size={13} className="shrink-0" />
              {c.label && (
                <span className="text-gray-400 text-xs">{c.label}:</span>
              )}
              {c.number}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
