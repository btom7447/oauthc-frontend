"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

export type LocationPin = {
  name: string;
  type: "hospital" | "department" | "center";
  address: string;
  lat: number;
  lng: number;
  mapsQuery?: string;
};

/** Fit map bounds to all markers */
function FitBounds({ locations }: { locations: LocationPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length === 0) return;
    const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [map, locations]);
  return null;
}

const PIN_COLORS: Record<LocationPin["type"], string> = {
  hospital: "#dc2626",
  department: "#14532d",
  center: "#1d4ed8",
};

function makeIcon(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <ellipse cx="14" cy="34" rx="5" ry="2" fill="rgba(0,0,0,0.18)"/>
      <path d="M14 0C8.48 0 4 4.48 4 10c0 7.5 10 26 10 26S24 17.5 24 10c0-5.52-4.48-10-10-10z"
        fill="${color}" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.25))"/>
      <circle cx="14" cy="10" r="5.5" fill="white" opacity="0.95"/>
      <circle cx="14" cy="10" r="3" fill="${color}"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  });
}

const tooltipStyles = `
  .leaflet-tooltip.map-tooltip {
    background: #111827;
    color: #f9fafb;
    border: none;
    border-radius: 8px;
    padding: 5px 11px;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 14px rgba(0,0,0,0.22);
    white-space: nowrap;
  }
  .leaflet-tooltip.map-tooltip::before {
    border-top-color: #111827;
  }
`;

type Props = { locations: LocationPin[] };

export default function LeafletMap({ locations }: Props) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({ iconUrl: "", shadowUrl: "" });

    // Inject tooltip styles once
    if (!document.getElementById("map-tooltip-styles")) {
      const style = document.createElement("style");
      style.id = "map-tooltip-styles";
      style.textContent = tooltipStyles;
      document.head.appendChild(style);
    }
  }, []);

  const fallbackCenter: [number, number] = [
    locations.reduce((s, l) => s + l.lat, 0) / locations.length,
    locations.reduce((s, l) => s + l.lng, 0) / locations.length,
  ];

  const openGoogleMaps = (loc: LocationPin) => {
    const query = loc.mapsQuery || `${loc.lat},${loc.lng}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, "_blank");
  };

  return (
    <MapContainer
      center={fallbackCenter}
      zoom={13}
      className="w-full h-full"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds locations={locations} />
      {locations.map((loc) => (
        <Marker
          key={loc.name}
          position={[loc.lat, loc.lng]}
          icon={makeIcon(PIN_COLORS[loc.type])}
          eventHandlers={{ click: () => openGoogleMaps(loc) }}
        >
          <Tooltip
            permanent
            direction="top"
            offset={[0, -38]}
            opacity={1}
            className="map-tooltip"
          >
            {loc.name}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
