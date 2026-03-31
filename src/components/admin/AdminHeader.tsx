"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, roleLabel } from "@/lib/admin-auth";
import Image from "next/image";
import { Menu, Bell, ChevronDown, User, LogOut, X } from "lucide-react";

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

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "New appointment request", message: "Fatima Bello requested an appointment for Radiology.", time: "10 min ago", read: false },
  { id: "2", title: "Contact form received", message: "A new contact form was submitted by Emeka Obi.", time: "25 min ago", read: false },
  { id: "3", title: "Ethics application submitted", message: "Dr. Kola Fashola submitted a research ethics application.", time: "1 hour ago", read: false },
  { id: "4", title: "Newsletter subscriber", message: "New subscriber: ibrahim.m@email.com", time: "3 hours ago", read: true },
  { id: "5", title: "CMS update", message: "Dr. Adewale Ojo's profile was updated.", time: "Yesterday", read: true },
];

type Props = { onMenuClick: () => void };

export default function AdminHeader({ onMenuClick }: Props) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label = BREADCRUMB_MAP[path];
    if (label) crumbs.push({ label, href: path });
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

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
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
              className="relative p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <Bell size={18} strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[11px] text-green-900 font-medium hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">No notifications.</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${!n.read ? "bg-blue-50/40" : ""}`}
                      >
                        <div className="flex items-start gap-2.5">
                          {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                          <div className={!n.read ? "" : "pl-4.5"}>
                            <p className={`text-xs leading-tight ${!n.read ? "text-gray-900 font-semibold" : "text-gray-600"}`}>{n.title}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{n.message}</p>
                            <p className="text-[10px] text-gray-300 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              {user.avatar ? (
                <Image src={user.avatar} alt={user.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-900/10 flex items-center justify-center">
                  <span className="text-green-900 text-xs font-bold">{user.name.charAt(0)}</span>
                </div>
              )}
              <div className="hidden sm:block text-right">
                <p className="text-gray-900 text-xs font-semibold leading-tight">{user.name}</p>
                <p className="text-gray-400 text-[10px]">{roleLabel(user.role)}</p>
              </div>
              <ChevronDown size={12} strokeWidth={1.5} className="text-gray-400 hidden sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                <button
                  onClick={() => { setProfileOpen(false); router.push("/admin/profile"); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <User size={14} strokeWidth={1.5} className="text-gray-400" />
                  My Profile
                </button>
                <hr className="border-gray-100" />
                <button
                  onClick={() => { setProfileOpen(false); logout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
