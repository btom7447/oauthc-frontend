"use client";

import { useAuth, roleLabel } from "@/lib/admin-auth";
import {
  CalendarDays,
  Users,
  FileText,
  UserCircle,
  ArrowRight,
  Megaphone,
  Stethoscope,
  Building2,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";

type StatCard = {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bg: string;
};

const STATS_BY_ROLE = {
  admin: [
    { label: "Today's Appointments", value: "34", icon: CalendarDays, color: "text-blue-700", bg: "bg-blue-50" },
    { label: "Active Doctors", value: "61", icon: Stethoscope, color: "text-green-900", bg: "bg-green-900/10" },
    { label: "Announcements", value: "8", icon: Megaphone, color: "text-red-600", bg: "bg-red-50" },
    { label: "CMS Items", value: "120", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
  ],
  staff: [
    { label: "Today's Appointments", value: "34", icon: CalendarDays, color: "text-blue-700", bg: "bg-blue-50" },
    { label: "Contact Forms", value: "5", icon: FileText, color: "text-green-900", bg: "bg-green-900/10" },
    { label: "Ethics Applications", value: "3", icon: ClipboardCheck, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Newsletter Subscribers", value: "8", icon: Users, color: "text-red-600", bg: "bg-red-50" },
  ],
  doctor: [
    { label: "My Appointments Today", value: "6", icon: CalendarDays, color: "text-blue-700", bg: "bg-blue-50" },
    { label: "Total Appointments", value: "142", icon: ClipboardCheck, color: "text-green-900", bg: "bg-green-900/10" },
    { label: "Pending", value: "3", icon: CalendarDays, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Profile Status", value: "Live", icon: UserCircle, color: "text-red-600", bg: "bg-red-50" },
  ],
} satisfies Record<string, StatCard[]>;

const QUICK_LINKS_BY_ROLE = {
  admin: [
    { label: "View Appointments", href: "/admin/appointments", icon: CalendarDays },
    { label: "Announcements", href: "/admin/cms/announcements", icon: Megaphone },
    { label: "Manage Doctors", href: "/admin/cms/doctors", icon: Stethoscope },
    { label: "Departments", href: "/admin/cms/departments", icon: Building2 },
  ],
  staff: [
    { label: "View Appointments", href: "/admin/appointments", icon: CalendarDays },
    { label: "Contact Forms", href: "/admin/inbox/contact", icon: FileText },
    { label: "Ethics Applications", href: "/admin/inbox/research-ethics", icon: ClipboardCheck },
  ],
  doctor: [
    { label: "My Appointments", href: "/admin/appointments", icon: CalendarDays },
    { label: "Edit My Profile", href: "/admin/profile", icon: UserCircle },
  ],
};

export default function AdminDashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const stats = STATS_BY_ROLE[user.role] ?? STATS_BY_ROLE["admin"];
  const quickLinks = QUICK_LINKS_BY_ROLE[user.role] ?? QUICK_LINKS_BY_ROLE["admin"];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <div>
        <h1 className="text-gray-900 text-2xl font-bold">
          {greeting()}, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here&apos;s what&apos;s happening across OAUTHC today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-4 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
              <s.icon size={18} strokeWidth={1.5} className={s.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-gray-900 text-sm font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm hover:border-green-900 hover:shadow-md transition"
            >
              <div className="w-9 h-9 rounded-lg bg-green-900/10 flex items-center justify-center shrink-0">
                <link.icon size={16} strokeWidth={1.5} className="text-green-900" />
              </div>
              <span className="text-gray-800 text-sm font-medium flex-1">{link.label}</span>
              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="text-gray-300 group-hover:text-green-900 transition"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Role badge */}
      <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <p className="text-gray-500 text-sm">
          Signed in as{" "}
          <span className="font-semibold text-gray-900">
            {roleLabel(user.role)}
          </span>
          {user.specialty && (
            <> · <span className="text-gray-400">{user.specialty}</span></>
          )}
        </p>
      </div>
    </div>
  );
}
