"use client";

import { usePathname } from "next/navigation";
import { useAuth, roleLabel } from "@/lib/admin-auth";
import { Menu, Bell } from "lucide-react";

const BREADCRUMB_MAP: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "User Management",
  "/admin/appointments": "Appointments",
  "/admin/profile": "My Profile",
  "/admin/my": "My",
  "/admin/my/shifts": "My Shifts",
  "/admin/my/leave": "My Leave",
  // CMS
  "/admin/cms": "CMS",
  "/admin/cms/announcements": "Announcements",
  "/admin/cms/doctors": "Doctors",
  "/admin/cms/departments": "Departments",
  "/admin/cms/health-services": "Health Services",
  "/admin/cms/diseases-symptoms": "Diseases & Symptoms",
  "/admin/cms/tests-procedures": "Tests & Procedures",
  "/admin/cms/research-ethics": "Research & Ethics",
  "/admin/cms/locations": "Locations",
  "/admin/cms/schools": "Schools",
  "/admin/cms/marquee": "Marquee",
  // Inbox
  "/admin/inbox": "Inbox",
  "/admin/inbox/contact": "Contact Forms",
  "/admin/inbox/newsletter": "Newsletter",
  "/admin/inbox/research-ethics": "Research Ethics",
  // Staff management
  "/admin/staff": "Staff Management",
  "/admin/staff/shifts": "Shifts",
  "/admin/staff/leave": "Leave Management",
  "/admin/staff/payroll": "Payroll",
  "/admin/staff/training": "Training & Dev.",
  "/admin/staff/performance": "Performance Reviews",
};

type Props = { onMenuClick: () => void };

export default function AdminHeader({ onMenuClick }: Props) {
  const { user } = useAuth();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label = BREADCRUMB_MAP[path];
    if (label) crumbs.push({ label, href: path });
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-800 transition">
          <Menu size={20} strokeWidth={1.5} />
        </button>

        <nav className="flex items-center gap-1.5 text-sm">
          {crumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-gray-300">/</span>}
              <span className={i === crumbs.length - 1 ? "text-gray-900 font-semibold" : "text-gray-400"}>
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <button className="relative text-gray-400 hover:text-gray-700 transition">
            <Bell size={18} strokeWidth={1.5} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-green-900/10 flex items-center justify-center">
              <span className="text-green-900 text-xs font-bold">{user.name.charAt(0)}</span>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-gray-900 text-xs font-semibold leading-tight">{user.name}</p>
              <p className="text-gray-400 text-[10px]">{roleLabel(user.role)}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
