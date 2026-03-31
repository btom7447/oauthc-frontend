"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Siren,
  Heart,
  Baby,
  Scissors,
  Microscope,
  ScanLine,
  FlaskConical,
  Pill,
  Activity,
  Brain,
  SmilePlus,
  Eye,
  LucideIcon,
} from "lucide-react";
import type { HealthServiceItem } from "@/lib/health-services-data";

const ICON_MAP: Record<string, LucideIcon> = {
  siren: Siren,
  heart: Heart,
  baby: Baby,
  scissors: Scissors,
  microscope: Microscope,
  "scan-line": ScanLine,
  "flask-conical": FlaskConical,
  pill: Pill,
  activity: Activity,
  brain: Brain,
  "smile-plus": SmilePlus,
  eye: Eye,
};

type Props = {
  services: HealthServiceItem[];
};

export default function HealthServiceSidebar({ services }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
        <div className="bg-green-900 px-5 py-4">
          <p className="text-white font-semibold text-sm uppercase tracking-wide">
            Health Services
          </p>
        </div>

        <nav className="flex flex-col divide-y divide-gray-100">
          {services.map((service) => {
            const Icon = ICON_MAP[service.iconKey] ?? Activity;
            const isActive =
              pathname === `/health-services/${service.slug}`;

            return (
              <Link
                key={service.slug}
                href={`/health-services/${service.slug}`}
                className={`flex items-center gap-3 px-5 py-3.5 transition group ${
                  isActive
                    ? "bg-green-900 text-white"
                    : "text-gray-700 hover:bg-gray-50 hover:text-green-900"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition ${
                    isActive
                      ? "bg-white/15"
                      : "bg-green-900/10 group-hover:bg-green-900/15"
                  }`}
                >
                  <Icon
                    size={15}
                    strokeWidth={1.5}
                    className={isActive ? "text-white" : "text-green-900"}
                  />
                </div>
                <span className="text-sm font-medium leading-snug">
                  {service.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
