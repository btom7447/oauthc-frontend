"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/admin-auth";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";
import {
  Search, CalendarDays, Clock, User, Stethoscope,
  CheckCircle, XCircle, RefreshCw, Building2, ChevronDown, X, FileText,
} from "lucide-react";

type Status = "pending" | "confirmed" | "cancelled" | "rescheduled";

type Appointment = {
  id: string;
  patient: string;
  patientPhone?: string;
  patientEmail?: string;
  patientType: "new" | "returning" | "referred";
  gender: "male" | "female";
  referralNote?: string;
  date: string;
  time: string;
  department: string;
  doctor?: string;
  doctorId?: string;
  status: Status;
  notes?: string;
  cancelReason?: string;
  cancelledBy?: string;
  rescheduleReason?: string;
  rescheduledBy?: string;
  assignNotes?: string;
};

type DoctorOption = { id: string; name: string; department: string };
type DeptOption = { id: string; name: string };

const STATUS_STYLES: Record<Status, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-100",
  confirmed: "bg-green-50 text-green-800 border border-green-100",
  cancelled: "bg-red-50 text-red-700 border border-red-100",
  rescheduled: "bg-blue-50 text-blue-700 border border-blue-100",
};

const PATIENT_TYPE_LABELS: Record<string, string> = {
  new: "New Patient",
  returning: "Returning",
  referred: "Referred",
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [departments, setDepartments] = useState<DeptOption[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Panel sub-state
  const [assignDoctor, setAssignDoctor] = useState("");
  const [assignDept, setAssignDept] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [notes, setNotes] = useState("");
  const [panel, setPanel] = useState<"view" | "reschedule" | "assign" | "cancel">("view");
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleNote, setRescheduleNote] = useState("");

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);

    const res = await api.get<Appointment[]>(`/appointments?${params.toString()}`);
    if (res.ok && res.data) setAppointments(res.data);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // Fetch doctors + departments for assign panel
  useEffect(() => {
    (async () => {
      const [docRes, deptRes] = await Promise.all([
        api.get<any[]>("/cms/doctors?limit=200", { auth: false }),
        api.get<DeptOption[]>("/cms/departments?limit=100", { auth: false }),
      ]);
      if (docRes.ok && docRes.data) {
        setDoctors(docRes.data.map((d) => ({ id: d.id, name: d.name, department: d.department })));
      }
      if (deptRes.ok && deptRes.data) setDepartments(deptRes.data);
    })();
  }, []);

  if (!user) return null;

  const selectAppointment = (a: Appointment) => {
    setSelected(a);
    setAssignDoctor(a.doctorId ?? "");
    setAssignDept(a.department);
    setRescheduleDate(a.date);
    setRescheduleTime(a.time);
    setNotes(a.assignNotes ?? "");
    setCancelReason("");
    setRescheduleNote("");
    setPanel("view");
  };

  const updateLocal = (id: string, patch: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    setSelected((prev) => prev && prev.id === id ? { ...prev, ...patch } : prev);
  };

  const confirm = async () => {
    if (!selected) return;
    setActionLoading(true);
    const res = await api.patch<Appointment>(`/appointments/${selected.id}/confirm`);
    if (res.ok && res.data) {
      updateLocal(selected.id, res.data);
      toast.success("Appointment confirmed");
    } else {
      toast.error(res.error || "Failed to confirm");
    }
    setActionLoading(false);
  };

  const confirmCancel = async () => {
    if (!selected || !cancelReason.trim()) return;
    setActionLoading(true);
    const res = await api.patch<Appointment>(`/appointments/${selected.id}/cancel`, { reason: cancelReason.trim() });
    if (res.ok && res.data) {
      updateLocal(selected.id, res.data);
      toast.success("Appointment cancelled");
      setCancelReason("");
      setPanel("view");
    } else {
      toast.error(res.error || "Failed to cancel");
    }
    setActionLoading(false);
  };

  const saveReschedule = async () => {
    if (!selected || !rescheduleDate || !rescheduleTime || !rescheduleNote.trim()) return;
    setActionLoading(true);
    const res = await api.patch<Appointment>(`/appointments/${selected.id}/reschedule`, {
      date: rescheduleDate,
      time: rescheduleTime,
      reason: rescheduleNote.trim(),
    });
    if (res.ok && res.data) {
      updateLocal(selected.id, res.data);
      toast.success("Appointment rescheduled");
      setRescheduleNote("");
      setPanel("view");
    } else {
      toast.error(res.error || "Failed to reschedule");
    }
    setActionLoading(false);
  };

  const isFirstAssign = !selected?.doctorId;

  const saveAssign = async () => {
    if (!selected) return;
    const needsReason = !isFirstAssign;
    if (needsReason && !notes.trim()) return;
    setActionLoading(true);

    const doc = doctors.find((d) => d.id === assignDoctor);
    const res = await api.patch<Appointment>(`/appointments/${selected.id}/assign`, {
      doctorId: assignDoctor,
      department: assignDept,
      doctor: doc?.name,
      notes: notes.trim() || undefined,
    });
    if (res.ok && res.data) {
      updateLocal(selected.id, res.data);
      toast.success(isFirstAssign ? "Doctor assigned" : "Appointment reassigned");
      setPanel("view");
    } else {
      toast.error(res.error || "Failed to assign");
    }
    setActionLoading(false);
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
            placeholder="Search patient, department…"
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
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-200" />
                          <div className="flex flex-col gap-1">
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                            <div className="h-2 w-16 bg-gray-100 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          <div className="h-3 w-20 bg-gray-200 rounded" />
                          <div className="h-2 w-12 bg-gray-100 rounded" />
                        </div>
                      </td>
                      {user.role !== "doctor" && (
                        <td className="px-4 py-3.5">
                          <div className="h-3 w-28 bg-gray-200 rounded" />
                          <div className="h-2 w-16 bg-gray-100 rounded mt-1" />
                        </td>
                      )}
                      <td className="px-4 py-3.5">
                        <div className="h-5 w-16 bg-gray-200 rounded-full" />
                      </td>
                    </tr>
                  ))
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan={user.role !== "doctor" ? 4 : 3} className="text-center text-gray-400 text-sm py-12">
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
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
                          <div>
                            <span className="text-gray-900 font-medium truncate max-w-[120px] block">{a.patient}</span>
                            <span className="text-gray-400 text-[10px] capitalize">{PATIENT_TYPE_LABELS[a.patientType] ?? a.patientType}</span>
                          </div>
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
                          <span className="text-gray-600 text-xs truncate max-w-[130px] block">{a.doctor || "Unassigned"}</span>
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
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="capitalize">{selected.gender}</span>
                      <span>·</span>
                      <span>{PATIENT_TYPE_LABELS[selected.patientType] ?? selected.patientType}</span>
                    </div>
                    {selected.patientPhone && (
                      <p className="text-gray-400 text-xs">{selected.patientPhone}</p>
                    )}
                    {selected.patientEmail && (
                      <p className="text-gray-400 text-xs">{selected.patientEmail}</p>
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
                    {selected.doctor || "Unassigned"}
                  </span>
                </div>

                {/* Referral note link */}
                {selected.referralNote && (
                  <a
                    href={selected.referralNote}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 hover:bg-blue-100 transition"
                  >
                    <FileText size={13} strokeWidth={1.5} />
                    View Referral Note
                  </a>
                )}

                {selected.notes && (
                  <div>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-gray-600 text-xs leading-relaxed">{selected.notes}</p>
                  </div>
                )}

                {selected.status === "cancelled" && selected.cancelReason && (
                  <div>
                    <p className="text-[11px] font-semibold text-red-400 uppercase tracking-wide mb-1">
                      Cancellation Reason
                      {selected.cancelledBy && <span className="normal-case text-gray-400 font-normal"> — by {selected.cancelledBy}</span>}
                    </p>
                    <p className="text-gray-600 text-xs leading-relaxed">{selected.cancelReason}</p>
                  </div>
                )}

                {selected.status === "rescheduled" && selected.rescheduleReason && (
                  <div>
                    <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide mb-1">
                      Reschedule Reason
                      {selected.rescheduledBy && <span className="normal-case text-gray-400 font-normal"> — by {selected.rescheduledBy}</span>}
                    </p>
                    <p className="text-gray-600 text-xs leading-relaxed">{selected.rescheduleReason}</p>
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
                          disabled={actionLoading}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 border border-green-100 text-green-800 text-xs font-semibold rounded-lg hover:bg-green-100 disabled:opacity-50 transition"
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
                        {selected.doctorId ? "Reassign" : "Assign"}
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
                    disabled={!rescheduleDate || !rescheduleTime || !rescheduleNote.trim() || actionLoading}
                    className="flex-1 bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-lg transition"
                  >
                    {actionLoading ? "Saving…" : "Save Reschedule"}
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
                    disabled={!cancelReason.trim() || actionLoading}
                    className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-lg transition"
                  >
                    {actionLoading ? "Cancelling…" : "Confirm Cancellation"}
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
                  <p className="text-sm font-semibold text-gray-800">{isFirstAssign ? "Assign Appointment" : "Reassign Appointment"}</p>
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
                        {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
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
                        {doctors
                          .filter((d) => !assignDept || d.department === assignDept)
                          .map((d) => (
                            <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
                          ))}
                      </select>
                      <ChevronDown size={12} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  {!isFirstAssign && (
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
                    disabled={(!isFirstAssign && !notes.trim()) || actionLoading}
                    className="flex-1 bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-lg transition"
                  >
                    {actionLoading ? "Saving…" : isFirstAssign ? "Assign" : "Save Reassignment"}
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
