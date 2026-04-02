"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth, type Role } from "@/lib/admin-auth";
import Image from "next/image";
import {
  LayoutDashboard,
  CalendarDays,
  UserCircle,
  Users,
  FileText,
  Megaphone,
  Stethoscope,
  Building2,
  HeartPulse,
  ChevronDown,
  LogOut,
  X,
  Activity,
  FlaskConical,
  MapPin,
  GraduationCap,
  Radio,
  Inbox,
  Mail,
  BookOpen,
  UserCog,
  Clock,
  CalendarOff,
  Banknote,
  BookMarked,
  ClipboardCheck,
  Newspaper,
} from "lucide-react";

type NavChild = {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
  comingSoon?: boolean;
};

type NavItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  roles: Role[];
  comingSoon?: boolean;
  group?: string; // expandable group key
  children?: NavChild[];
};

const NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["admin", "staff", "doctor"],
  },

  // ── User management (admin only) ─────────────────────────────────────────
  {
    label: "User Management",
    href: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },

  // ── CMS group ────────────────────────────────────────────────────────────
  {
    label: "CMS",
    icon: FileText,
    group: "cms",
    roles: ["admin", "staff"],
    children: [
      { label: "Announcements",     href: "/admin/cms/announcements",      icon: Megaphone,     roles: ["admin", "staff"] },
      { label: "Doctors",           href: "/admin/cms/doctors",            icon: Stethoscope,   roles: ["admin", "staff"] },
      { label: "Departments",       href: "/admin/cms/departments",        icon: Building2,     roles: ["admin", "staff"] },
      { label: "Health Services",   href: "/admin/cms/health-services",    icon: HeartPulse,    roles: ["admin"] },
      { label: "Diseases & Symptoms", href: "/admin/cms/diseases-symptoms", icon: Activity,        roles: ["admin"] },
      { label: "Tests & Procedures",  href: "/admin/cms/tests-procedures",  icon: FlaskConical, roles: ["admin"] },
      { label: "Locations",           href: "/admin/cms/locations",         icon: MapPin,       roles: ["admin", "staff"] },
      { label: "Schools",             href: "/admin/cms/schools",           icon: GraduationCap, roles: ["admin"] },
      { label: "Marquee",             href: "/admin/cms/marquee",           icon: Radio,        roles: ["admin", "staff"] },
    ],
  },

  // ── Inbox group ──────────────────────────────────────────────────────────
  {
    label: "Inbox",
    icon: Inbox,
    group: "inbox",
    roles: ["admin", "staff"],
    children: [
      { label: "Contact Forms",     href: "/admin/inbox/contact",           icon: Mail,      roles: ["admin", "staff"] },
      { label: "Newsletter",        href: "/admin/inbox/newsletter",        icon: Newspaper, roles: ["admin", "staff"] },
      { label: "Research Ethics",   href: "/admin/inbox/research-ethics",   icon: BookOpen,  roles: ["admin", "staff"] },
    ],
  },

  // ── Appointments ─────────────────────────────────────────────────────────
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: CalendarDays,
    roles: ["admin", "staff", "doctor"],
  },

  // ── Staff management group (admin only, all coming soon) ─────────────────
  {
    label: "Staff Management",
    icon: UserCog,
    group: "staff-mgmt",
    roles: ["admin"],
    children: [
      { label: "Shifts",               href: "/admin/staff/shifts",       icon: Clock,          roles: ["admin"], comingSoon: true },
      { label: "Leave Management",     href: "/admin/staff/leave",        icon: CalendarOff,    roles: ["admin"], comingSoon: true },
      { label: "Payroll",              href: "/admin/staff/payroll",      icon: Banknote,       roles: ["admin"], comingSoon: true },
      { label: "Training & Dev.",      href: "/admin/staff/training",     icon: BookMarked,     roles: ["admin"], comingSoon: true },
      { label: "Performance Reviews",  href: "/admin/staff/performance",  icon: ClipboardCheck, roles: ["admin"], comingSoon: true },
    ],
  },

  // ── My schedule (staff + doctor, coming soon) ─────────────────────────────
  {
    label: "My Shifts",
    href: "/admin/my/shifts",
    icon: Clock,
    roles: ["staff", "doctor"],
    comingSoon: true,
  },
  {
    label: "My Leave",
    href: "/admin/my/leave",
    icon: CalendarOff,
    roles: ["staff", "doctor"],
    comingSoon: true,
  },

  // ── Profile (all roles) ─────────────────────────────────────────────────
  {
    label: "My Profile",
    href: "/admin/profile",
    icon: UserCircle,
    roles: ["admin", "staff", "doctor"],
  },
];

type Props = { open: boolean; onClose: () => void };

export default function AdminSidebar({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => ({
    cms: pathname.startsWith("/admin/cms"),
    inbox: pathname.startsWith("/admin/inbox"),
    "staff-mgmt": pathname.startsWith("/admin/staff"),
  }));

  if (!user) return null;

  const toggleGroup = (key: string) =>
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const handleComingSoon = () => {
    toast("Coming soon! This feature is under development.", {
      icon: "🚧",
      style: { fontSize: "13px" },
    });
  };

  const visibleNav = NAV.filter((item) => item.roles.includes(user.role));

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30 flex flex-col transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100 shrink-0">
          <div className="w-8 h-8 relative shrink-0">
            <Image src="/logo.png" alt="OAUTHC" fill sizes="32px" className="object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 font-bold text-sm leading-tight truncate">OAUTHC</p>
            <p className="text-gray-400 text-[10px] truncate">Admin Portal</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 lg:hidden">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
          {visibleNav.map((item) => {
            // ── Expandable group ──────────────────────────────────────────
            if (item.children) {
              const key = item.group!;
              const isOpen = expandedGroups[key];
              const visibleChildren = item.children.filter((c) => c.roles.includes(user.role));
              if (visibleChildren.length === 0) return null;

              const groupActive = visibleChildren.some(
                (c) => !c.comingSoon && isActive(c.href)
              );

              return (
                <div key={key}>
                  <button
                    onClick={() => toggleGroup(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                      ${groupActive ? "bg-green-900/10 text-green-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                    <item.icon size={16} strokeWidth={1.5} className="shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-gray-100 pl-3">
                      {visibleChildren.map((child) => {
                        if (child.comingSoon) {
                          return (
                            <button
                              key={child.label}
                              onClick={handleComingSoon}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-50 transition w-full text-left"
                            >
                              <child.icon size={14} strokeWidth={1.5} className="shrink-0" />
                              <span className="flex-1">{child.label}</span>
                              <span className="text-[9px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Soon</span>
                            </button>
                          );
                        }
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition
                              ${isActive(child.href)
                                ? "bg-green-900 text-white font-semibold"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                          >
                            <child.icon size={14} strokeWidth={1.5} className="shrink-0" />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // ── Coming soon top-level item ────────────────────────────────
            if (item.comingSoon) {
              return (
                <button
                  key={item.label}
                  onClick={handleComingSoon}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-50 transition w-full text-left"
                >
                  <item.icon size={16} strokeWidth={1.5} className="shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wide bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Soon</span>
                </button>
              );
            }

            // ── Regular link ──────────────────────────────────────────────
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                  ${isActive(item.href!)
                    ? "bg-green-900 text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <item.icon size={16} strokeWidth={1.5} className="shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="shrink-0 border-t border-gray-100 p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-900/10 flex items-center justify-center shrink-0">
                <span className="text-green-900 text-xs font-bold">{user.name.charAt(0)}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-xs font-semibold truncate">{user.name}</p>
              <p className="text-gray-400 text-[10px] truncate capitalize">{user.role}</p>
            </div>
            <button onClick={logout} title="Sign out" className="text-gray-400 hover:text-red-600 transition">
              <LogOut size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
