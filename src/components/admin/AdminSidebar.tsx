"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  roles: Role[];
  children?: { label: string; href: string; icon: React.ElementType }[];
};

const NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["super-admin", "admin", "doctor"],
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: Users,
    roles: ["super-admin"],
  },
  {
    label: "CMS",
    icon: FileText,
    roles: ["super-admin", "admin"],
    children: [
      { label: "Announcements", href: "/admin/cms/announcements", icon: Megaphone },
      { label: "Doctors", href: "/admin/cms/doctors", icon: Stethoscope },
      { label: "Departments", href: "/admin/cms/departments", icon: Building2 },
      { label: "Health Services", href: "/admin/cms/health-services", icon: HeartPulse },
    ],
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: CalendarDays,
    roles: ["super-admin", "admin", "doctor"],
  },
  {
    label: "My Profile",
    href: "/admin/profile",
    icon: UserCircle,
    roles: ["doctor"],
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [cmsOpen, setCmsOpen] = useState(
    pathname.startsWith("/admin/cms")
  );

  if (!user) return null;

  const visibleNav = NAV.filter((item) => item.roles.includes(user.role));

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30 flex flex-col transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100 shrink-0">
          <div className="w-8 h-8 relative shrink-0">
            <Image src="/logo.png" alt="OAUTHC" fill className="object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-gray-900 font-bold text-sm leading-tight truncate">
              OAUTHC
            </p>
            <p className="text-gray-400 text-[10px] truncate">Admin Portal</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
          {visibleNav.map((item) => {
            if (item.children) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setCmsOpen((p) => !p)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                      ${pathname.startsWith("/admin/cms")
                        ? "bg-green-900/10 text-green-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <item.icon size={16} strokeWidth={1.5} className="shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className={`transition-transform ${cmsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {cmsOpen && (
                    <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-gray-100 pl-3">
                      {item.children.map((child) => (
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
                      ))}
                    </div>
                  )}
                </div>
              );
            }

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
            <div className="w-8 h-8 rounded-full bg-green-900/10 flex items-center justify-center shrink-0">
              <span className="text-green-900 text-xs font-bold">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-xs font-semibold truncate">{user.name}</p>
              <p className="text-gray-400 text-[10px] truncate capitalize">
                {user.role.replace("-", " ")}
              </p>
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="text-gray-400 hover:text-red-600 transition"
            >
              <LogOut size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
