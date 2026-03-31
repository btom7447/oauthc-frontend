"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/admin-auth";
import {
  Search, CalendarDays, Clock, User, Stethoscope,
  CheckCircle, XCircle, RefreshCw, Building2, ChevronDown, X,
} from "lucide-react";

type Status = "pending" | "confirmed" | "cancelled" | "rescheduled";

type Appointment = {
  id: string;
  patient: string;
  patientPhone?: string;
  date: string;
  time: string;
  department: string;
  doctor: string;
  doctorId: string;
  status: Status;
  notes?: string;
};

const DOCTORS = [
  { id: "3", name: "Dr. Adewale Ojo", department: "Cardiology" },
  { id: "4", name: "Dr. Ngozi Chukwu", department: "Radiology" },
  { id: "5", name: "Dr. Tunde Lawal", department: "Neurology" },
  { id: "6", name: "Dr. Kemi Adeyinka", department: "Ophthalmology" },
  { id: "7", name: "Dr. Yetunde Abiola", department: "Oncology" },
];

const DEPARTMENTS = [
  "Cardiology", "Radiology", "Neurology", "Ophthalmology",
  "Oncology", "Paediatrics", "Orthopaedics", "Obstetrics & Gynaecology",
];

const INITIAL: Appointment[] = [
  { id: "1", patient: "John Adeyemi", patientPhone: "+234 801 234 5678", date: "2026-04-01", time: "09:00", department: "Cardiology", doctor: "Dr. Adewale Ojo", doctorId: "3", status: "confirmed" },
  { id: "2", patient: "Fatima Bello", patientPhone: "+234 802 345 6789", date: "2026-04-01", time: "10:30", department: "Radiology", doctor: "Dr. Ngozi Chukwu", doctorId: "4", status: "pending" },
  { id: "3", patient: "Emeka Obi", date: "2026-04-01", time: "11:00", department: "Cardiology", doctor: "Dr. Adewale Ojo", doctorId: "3", status: "confirmed" },
  { id: "4", patient: "Aisha Mohammed", patientPhone: "+234 803 456 7890", date: "2026-04-02", time: "08:30", department: "Neurology", doctor: "Dr. Tunde Lawal", doctorId: "5", status: "pending" },
  { id: "5", patient: "Chinwe Eze", date: "2026-04-02", time: "09:45", department: "Cardiology", doctor: "Dr. Adewale Ojo", doctorId: "3", status: "cancelled" },
  { id: "6", patient: "Segun Olatunji", date: "2026-04-02", time: "14:00", department: "Ophthalmology", doctor: "Dr. Kemi Adeyinka", doctorId: "6", status: "confirmed" },
  { id: "7", patient: "Blessing Nwosu", patientPhone: "+234 805 678 9012", date: "2026-04-03", time: "10:00", department: "Cardiology", doctor: "Dr. Adewale Ojo", doctorId: "3", status: "pending" },
  { id: "8", patient: "Ibrahim Musa", date: "2026-04-03", time: "11:30", department: "Oncology", doctor: "Dr. Yetunde Abiola", doctorId: "7", status: "confirmed" },
];

const STATUS_STYLES: Record<Status, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-100",
  confirmed: "bg-green-50 text-green-800 border border-green-100",
  cancelled: "bg-red-50 text-red-700 border border-red-100",
  rescheduled: "bg-blue-50 text-blue-700 border border-blue-100",
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<Appointment | null>(null);

  // Panel sub-state
  const [assignDoctor, setAssignDoctor] = useState("");
  const [assignDept, setAssignDept] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [notes, setNotes] = useState("");
  const [panel, setPanel] = useState<"view" | "reschedule" | "assign" | "cancel">("view");
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleNote, setRescheduleNote] = useState("");

  if (!user) return null;

  const source =
    user.role === "doctor"
      ? appointments.filter((a) => a.doctorId === user.id)
      : appointments;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filtered = useMemo(
    () =>
      source.filter((a) => {
        const matchesSearch =
          a.patient.toLowerCase().includes(search.toLowerCase()) ||
          a.department.toLowerCase().includes(search.toLowerCase()) ||
          a.doctor.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || a.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [source, search, statusFilter]
  );

  const selectAppointment = (a: Appointment) => {
    setSelected(a);
    setAssignDoctor(a.doctorId);
    setAssignDept(a.department);
    setRescheduleDate(a.date);
    setRescheduleTime(a.time);
    setNotes(a.notes ?? "");
    setCancelReason("");
    setRescheduleNote("");
    setPanel("view");
  };

  const update = (id: string, patch: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    setSelected((prev) => prev ? { ...prev, ...patch } : null);
  };

  const confirm = () => update(selected!.id, { status: "confirmed" });
  const confirmCancel = () => {
    if (!cancelReason.trim()) return;
    update(selected!.id, { status: "cancelled", notes: cancelReason.trim() });
    setCancelReason("");
    setPanel("view");
  };

  const saveReschedule = () => {
    if (!rescheduleDate || !rescheduleTime || !rescheduleNote.trim()) return;
    update(selected!.id, { date: rescheduleDate, time: rescheduleTime, status: "rescheduled", notes: rescheduleNote.trim() });
    setRescheduleNote("");
    setPanel("view");
  };

  const isPending = selected?.status === "pending";

  const saveAssign = () => {
    const needsReason = !isPending;
    if (needsReason && !notes.trim()) return;
    const doc = DOCTORS.find((d) => d.id === assignDoctor);
    update(selected!.id, {
      doctor: doc?.name ?? selected!.doctor,
      doctorId: assignDoctor || selected!.doctorId,
      department: assignDept || selected!.department,
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    });
    setPanel("view");
  };

  const pendingCount = appointments.filter((a) => a.status === "pending").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-gray-900 text-xl font-bold">
          {user.role === "doctor" ? "My Appointments" : "Appointments"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {pendingCount} pending · {appointments.length} total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search patient, doctor, department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent bg-white shadow-sm transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "confirmed", "rescheduled", "cancelled"] as const).map((s) => (
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

      <div className="grid lg:grid-cols-5 gap-4 items-start">
        {/* Table — left */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date & Time</th>
                  {user.role !== "doctor" && (
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Doctor</th>
                  )}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={user.role !== "doctor" ? 4 : 3} className="text-center text-gray-400 text-sm py-12">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => selectAppointment(a)}
                      className={`cursor-pointer transition ${
                        selected?.id === a.id ? "bg-green-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <User size={13} strokeWidth={1.5} className="text-gray-500" />
                          </div>
                          <span className="text-gray-900 font-medium truncate max-w-[120px]">{a.patient}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 text-gray-700 text-xs">
                            <CalendarDays size={11} strokeWidth={1.5} className="text-gray-400" />
                            {new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                            <Clock size={11} strokeWidth={1.5} />
                            {a.time}
                          </span>
                        </div>
                      </td>
                      {user.role !== "doctor" && (
                        <td className="px-4 py-3.5">
                          <span className="text-gray-600 text-xs truncate max-w-[130px] block">{a.doctor}</span>
                          <span className="text-gray-400 text-[10px]">{a.department}</span>
                        </td>
                      )}
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[a.status]}`}>
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

        {/* Detail panel — right */}
        {selected ? (
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">Appointment Details</p>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={15} strokeWidth={1.5} />
              </button>
            </div>

            {panel === "view" && (
              <div className="p-5 flex flex-col gap-4">
                {/* Patient info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-900/10 flex items-center justify-center shrink-0">
                    <User size={16} strokeWidth={1.5} className="text-green-900" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">{selected.patient}</p>
                    {selected.patientPhone && (
                      <p className="text-gray-400 text-xs">{selected.patientPhone}</p>
                    )}
                  </div>
                  <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-semibold capitalize shrink-0 ${STATUS_STYLES[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-col gap-2 text-xs text-gray-600">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={12} strokeWidth={1.5} className="text-gray-400" />
                    {new Date(selected.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} — {selected.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <Building2 size={12} strokeWidth={1.5} className="text-gray-400" />
                    {selected.department}
                  </span>
                  <span className="flex items-center gap-2">
                    <Stethoscope size={12} strokeWidth={1.5} className="text-gray-400" />
                    {selected.doctor}
                  </span>
                </div>

                {selected.notes && (
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-gray-600 text-xs leading-relaxed">{selected.notes}</p>
                  </div>
                )}

                {/* Actions */}
                {user.role !== "doctor" && (
                  <div className="flex flex-col gap-2 pt-1 border-t border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Actions</p>

                    <div className="grid grid-cols-2 gap-2">
                      {selected.status !== "confirmed" && selected.status !== "cancelled" && (
                        <button
                          onClick={confirm}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 border border-green-100 text-green-800 text-xs font-semibold rounded-lg hover:bg-green-100 transition"
                        >
                          <CheckCircle size={13} strokeWidth={1.5} />
                          Confirm
                        </button>
                      )}
                      {selected.status !== "cancelled" && (
                        <button
                          onClick={() => { setCancelReason(""); setPanel("cancel"); }}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-100 transition"
                        >
                          <XCircle size={13} strokeWidth={1.5} />
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => setPanel("reschedule")}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 transition"
                      >
                        <RefreshCw size={13} strokeWidth={1.5} />
                        Reschedule
                      </button>
                      <button
                        onClick={() => { setNotes(""); setPanel("assign"); }}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-100 transition"
                      >
                        <Stethoscope size={13} strokeWidth={1.5} />
                        {selected.status === "pending" ? "Assign" : "Reassign"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {panel === "reschedule" && (
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setPanel("view")} className="text-gray-400 hover:text-gray-600 transition">
                    <X size={14} strokeWidth={1.5} />
                  </button>
                  <p className="text-sm font-semibold text-gray-800">Reschedule Appointment</p>
                </div>
                <p className="text-xs text-gray-500">Patient: <span className="font-medium text-gray-700">{selected.patient}</span></p>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">New Date</label>
                    <div className="relative">
                      <CalendarDays size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        min={new Date().toISOString().slice(0, 10)}
                        className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-white transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">New Time</label>
                    <div className="relative">
                      <Clock size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="time"
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-white transition"
                      />
                    </div>
                  </div>
                </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                      Reason for Reschedule <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={rescheduleNote}
                      onChange={(e) => setRescheduleNote(e.target.value)}
                      rows={3}
                      placeholder="Explain why this appointment is being rescheduled…"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 resize-none bg-white transition"
                    />
                    {rescheduleNote.trim() === "" && (
                      <p className="text-[11px] text-red-500 mt-1">A reason is required to reschedule.</p>
                    )}
                  </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={saveReschedule}
                    disabled={!rescheduleDate || !rescheduleTime || !rescheduleNote.trim()}
                    className="flex-1 bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-lg transition"
                  >
                    Save Reschedule
                  </button>
                  <button
                    onClick={() => setPanel("view")}
                    className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {panel === "cancel" && (
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setPanel("view")} className="text-gray-400 hover:text-gray-600 transition">
                    <X size={14} strokeWidth={1.5} />
                  </button>
                  <p className="text-sm font-semibold text-gray-800">Cancel Appointment</p>
                </div>
                <p className="text-xs text-gray-500">Patient: <span className="font-medium text-gray-700">{selected.patient}</span></p>

                <div className="flex flex-col gap-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-0.5">
                    Reason for Cancellation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={4}
                    placeholder="Explain why this appointment is being cancelled…"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-400 resize-none bg-white transition"
                  />
                  {cancelReason.trim() === "" && (
                    <p className="text-[11px] text-red-500">A reason is required to cancel.</p>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={confirmCancel}
                    disabled={!cancelReason.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-lg transition"
                  >
                    Confirm Cancellation
                  </button>
                  <button
                    onClick={() => setPanel("view")}
                    className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {panel === "assign" && (
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setPanel("view")} className="text-gray-400 hover:text-gray-600 transition">
                    <X size={14} strokeWidth={1.5} />
                  </button>
                  <p className="text-sm font-semibold text-gray-800">{isPending ? "Assign Appointment" : "Reassign Appointment"}</p>
                </div>
                <p className="text-xs text-gray-500">Patient: <span className="font-medium text-gray-700">{selected.patient}</span></p>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Department</label>
                    <div className="relative">
                      <Building2 size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select
                        value={assignDept}
                        onChange={(e) => setAssignDept(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg pl-9 pr-8 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-white appearance-none transition"
                      >
                        <option value="">— Select department —</option>
                        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown size={12} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Doctor</label>
                    <div className="relative">
                      <Stethoscope size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <select
                        value={assignDoctor}
                        onChange={(e) => setAssignDoctor(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg pl-9 pr-8 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-700 bg-white appearance-none transition"
                      >
                        <option value="">— Select doctor —</option>
                        {DOCTORS.map((d) => (
                          <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
                        ))}
                      </select>
                      <ChevronDown size={12} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  {!isPending && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                        Reason for Reassignment <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Explain why this appointment is being reassigned…"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 resize-none bg-white transition"
                      />
                      {notes.trim() === "" && (
                        <p className="text-[11px] text-red-500 mt-1">A reason is required to reassign.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={saveAssign}
                    disabled={!isPending && !notes.trim()}
                    className="flex-1 bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-lg transition"
                  >
                    {isPending ? "Assign" : "Save Reassignment"}
                  </button>
                  <button
                    onClick={() => setPanel("view")}
                    className="px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <CalendarDays size={20} strokeWidth={1.5} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Select an appointment to view details and take action.</p>
          </div>
        )}
      </div>
    </div>
  );
}
