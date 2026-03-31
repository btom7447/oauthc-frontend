"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/admin-auth";
import { Search, CalendarDays, Clock, User, Stethoscope } from "lucide-react";

type Status = "pending" | "confirmed" | "cancelled";

type Appointment = {
  id: string;
  patient: string;
  date: string;
  time: string;
  department: string;
  doctor: string;
  doctorId: string;
  status: Status;
  notes?: string;
};

const ALL_APPOINTMENTS: Appointment[] = [
  { id: "1", patient: "John Adeyemi", date: "2026-04-01", time: "09:00", department: "Cardiology", doctor: "Dr. Adewale Ojo", doctorId: "3", status: "confirmed" },
  { id: "2", patient: "Fatima Bello", date: "2026-04-01", time: "10:30", department: "Radiology", doctor: "Dr. Ngozi Chukwu", doctorId: "4", status: "pending" },
  { id: "3", patient: "Emeka Obi", date: "2026-04-01", time: "11:00", department: "Cardiology", doctor: "Dr. Adewale Ojo", doctorId: "3", status: "confirmed" },
  { id: "4", patient: "Aisha Mohammed", date: "2026-04-02", time: "08:30", department: "Neurology", doctor: "Dr. Tunde Lawal", doctorId: "5", status: "pending" },
  { id: "5", patient: "Chinwe Eze", date: "2026-04-02", time: "09:45", department: "Cardiology", doctor: "Dr. Adewale Ojo", doctorId: "3", status: "cancelled" },
  { id: "6", patient: "Segun Olatunji", date: "2026-04-02", time: "14:00", department: "Ophthalmology", doctor: "Dr. Kemi Adeyinka", doctorId: "6", status: "confirmed" },
  { id: "7", patient: "Blessing Nwosu", date: "2026-04-03", time: "10:00", department: "Cardiology", doctor: "Dr. Adewale Ojo", doctorId: "3", status: "pending" },
  { id: "8", patient: "Ibrahim Musa", date: "2026-04-03", time: "11:30", department: "Oncology", doctor: "Dr. Yetunde Abiola", doctorId: "7", status: "confirmed" },
];

const STATUS_STYLES: Record<Status, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-100",
  confirmed: "bg-green-50 text-green-800 border border-green-100",
  cancelled: "bg-red-50 text-red-700 border border-red-100",
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  if (!user) return null;

  const source =
    user.role === "doctor"
      ? ALL_APPOINTMENTS.filter((a) => a.doctorId === user.id)
      : ALL_APPOINTMENTS;  // admin + staff see all

  const filtered = useMemo(() => {
    return source.filter((a) => {
      const matchesSearch =
        a.patient.toLowerCase().includes(search.toLowerCase()) ||
        a.department.toLowerCase().includes(search.toLowerCase()) ||
        a.doctor.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [source, search, statusFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-gray-900 text-xl font-bold">
          {user.role === "doctor" ? "My Appointments" : "All Appointments"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {filtered.length} appointment{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="Search patient, doctor, department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent bg-white shadow-sm transition"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition ${
                statusFilter === s
                  ? "bg-green-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-green-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Patient
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Date & Time
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Department
                </th>
                {user.role !== "doctor" && (
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Doctor
                  </th>
                )}
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={user.role !== "doctor" ? 5 : 4}
                    className="text-center text-gray-400 text-sm py-12"
                  >
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <User size={13} strokeWidth={1.5} className="text-gray-500" />
                        </div>
                        <span className="text-gray-900 font-medium">{a.patient}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5 text-gray-700">
                          <CalendarDays size={12} strokeWidth={1.5} className="text-gray-400" />
                          {new Date(a.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <Clock size={11} strokeWidth={1.5} />
                          {a.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{a.department}</td>
                    {user.role !== "doctor" && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Stethoscope size={13} strokeWidth={1.5} className="text-gray-400" />
                          {a.doctor}
                        </div>
                      </td>
                    )}
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[a.status]}`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
