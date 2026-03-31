"use client";

import { useAuth } from "@/lib/admin-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Megaphone, Stethoscope, Building2, HeartPulse, ArrowRight, ShieldOff } from "lucide-react";

const CMS_SECTIONS = [
  {
    label: "Announcements",
    href: "/admin/cms/announcements",
    icon: Megaphone,
    description: "Create and manage hospital announcements shown on the public site.",
    count: "8 active",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    label: "Doctors",
    href: "/admin/cms/doctors",
    icon: Stethoscope,
    description: "Manage doctor profiles, specialties, and availability.",
    count: "61 profiles",
    color: "text-green-900",
    bg: "bg-green-900/10",
  },
  {
    label: "Departments & Centres",
    href: "/admin/cms/departments",
    icon: Building2,
    description: "Edit department pages, contacts, and descriptions.",
    count: "24 departments",
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  {
    label: "Health Services",
    href: "/admin/cms/health-services",
    icon: HeartPulse,
    description: "Update health service listings and detail pages.",
    count: "12 services",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export default function CMSPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  if (user.role === "doctor") {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldOff size={24} strokeWidth={1.5} className="text-red-500" />
        </div>
        <div>
          <p className="text-gray-900 font-semibold">Access Restricted</p>
          <p className="text-gray-500 text-sm mt-1">
            CMS access is limited to Admin and Super Admin roles.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin")}
          className="text-sm text-green-900 font-semibold hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-gray-900 text-xl font-bold">Content Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the content displayed on the public-facing OAUTHC website.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {CMS_SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:border-green-900 hover:shadow-md transition flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${section.bg}`}>
                <section.icon size={20} strokeWidth={1.5} className={section.color} />
              </div>
              <ArrowRight
                size={16}
                strokeWidth={1.5}
                className="text-gray-300 group-hover:text-green-900 transition mt-1"
              />
            </div>
            <div>
              <h2 className="text-gray-900 font-semibold text-base">{section.label}</h2>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                {section.description}
              </p>
            </div>
            <p className={`text-xs font-semibold ${section.color}`}>{section.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
