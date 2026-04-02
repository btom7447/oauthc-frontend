"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import {
  User,
  Users,
  Phone,
  Mail,
  CalendarDays,
  Clock,
  ClipboardList,
  Upload,
  ChevronDown,
  Send,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";
import { api } from "@/lib/api-client";
import toast from "react-hot-toast";

type FormState = {
  patientType: string;
  gender: string;
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
  date: string;
  time: string;
  notes: string;
  referralNote: string;
};

const INITIAL: FormState = {
  patientType: "",
  gender: "",
  phone: "",
  firstName: "",
  lastName: "",
  email: "",
  date: "",
  time: "",
  notes: "",
  referralNote: "",
};

const labelCls = "block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/10 backdrop-blur-sm px-4 py-3 pl-11 text-lg text-white placeholder-gray-400 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition";

const selectCls =
  "w-full appearance-none rounded-lg border border-white/10 bg-white/10 backdrop-blur-sm px-4 py-3 pl-11 pr-10 text-lg text-white [&>option]:text-black outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition";

function Field({ children }: { children: React.ReactNode }) {
  return <div className="relative flex flex-col">{children}</div>;
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3 top-[2.35rem] text-gray-300">
      {children}
    </span>
  );
}

function SelectArrow() {
  return (
    <span className="pointer-events-none absolute right-3 top-[2.35rem] text-gray-300">
      <ChevronDown size={16} />
    </span>
  );
}

export default function BookAppointmentForm() {
  const [form, setForm] = useState<FormState>({ ...INITIAL });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isReferred = form.patientType === "referred";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReferred && !form.referralNote) {
      toast.error("Please upload your referral note.");
      return;
    }
    setSubmitting(true);

    const payload = {
      patient: `${form.firstName.trim()} ${form.lastName.trim()}`,
      patientPhone: form.phone,
      patientEmail: form.email,
      patientType: form.patientType,
      gender: form.gender,
      date: form.date,
      time: form.time,
      notes: form.notes || undefined,
      referralNote: form.referralNote || undefined,
    };

    const res = await api.post("/appointments", payload, { auth: false });
    if (res.ok) {
      toast.success("Appointment submitted! You will receive confirmation within 24-48 hours.");
      setForm({ ...INITIAL });
    } else {
      toast.error(res.error || "Failed to submit appointment. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <section id="bookingForm" className="relative w-full py-20 px-6 md:px-12 overflow-hidden bg-[url('/images/booking-form/form-poster.png')] bg-cover bg-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-950/70" />

      <div className="relative max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="text-center">
          <p className="text-red-500 uppercase text-xl font-semibold tracking-wide">
            Schedule a Visit
          </p>
          <h2 className="text-white text-3xl md:text-5xl font-semibold font-yeseva mt-2">
            Book an Appointment
          </h2>
          <p className="mt-3 text-gray-400 text-lg">
            Ready to schedule your visit? Booking an appointment at our teaching
            hospital is easy and convenient. Simply give us a call or use our
            online booking system. We look forward to providing you with
            exceptional care during your visit.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Row: Patient Type + Gender */}
          <div className="grid md:grid-cols-2 gap-6">
            <Field>
              <label className={labelCls}>Patient Type</label>
              <Icon>
                <Users size={16} />
              </Icon>
              <select
                name="patientType"
                value={form.patientType}
                onChange={handleChange}
                className={selectCls}
                required
              >
                <option value="">Select patient type</option>
                <option value="new">New Patient</option>
                <option value="returning">Returning Patient</option>
                <option value="referred">Referred Patient</option>
              </select>
              <SelectArrow />
            </Field>

            <Field>
              <label className={labelCls}>Gender</label>
              <Icon>
                <User size={16} />
              </Icon>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={selectCls}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <SelectArrow />
            </Field>
          </div>

          {/* Row: Names */}
          <div className="grid md:grid-cols-2 gap-6">
            <Field>
              <label className={labelCls}>First Name</label>
              <Icon>
                <User size={16} />
              </Icon>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                className={inputCls}
                required
              />
            </Field>

            <Field>
              <label className={labelCls}>Last Name</label>
              <Icon>
                <User size={16} />
              </Icon>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className={inputCls}
                required
              />
            </Field>
          </div>

          {/* Row: Contact */}
          <div className="grid md:grid-cols-2 gap-6">
            <Field>
              <label className={labelCls}>Phone</label>
              <Icon>
                <Phone size={16} />
              </Icon>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+234 000 000 0000"
                className={inputCls}
                required
              />
            </Field>

            <Field>
              <label className={labelCls}>Email</label>
              <Icon>
                <Mail size={16} />
              </Icon>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={inputCls}
                required
              />
            </Field>
          </div>

          {/* Row: Date + Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <Field>
              <label className={labelCls}>Preferred Date</label>
              <Icon>
                <CalendarDays size={16} className="text-white" />
              </Icon>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={new Date().toISOString().slice(0, 10)}
                className={inputCls}
                required
              />
            </Field>

            <Field>
              <label className={labelCls}>Preferred Time</label>
              <Icon>
                <Clock size={16} className="text-white" />
              </Icon>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className={inputCls}
                required
              />
            </Field>
          </div>

          {/* Notes */}
          <Field>
            <label className={labelCls}>Additional Notes</label>
            <Icon>
              <ClipboardList size={16} />
            </Icon>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Anything you'd like the doctor to know..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* Referral Upload — Cloudinary */}
          {isReferred && (
            <Field>
              <label className={labelCls}>
                Referral Note{" "}
                <span className="text-red-500 normal-case">*required</span>
              </label>
              {form.referralNote ? (
                <div className="flex items-center gap-3 rounded-lg border border-green-400/30 bg-green-900/20 backdrop-blur-sm px-5 py-4">
                  <CheckCircle size={18} className="shrink-0 text-green-400" />
                  <span className="text-sm text-green-200 flex-1 truncate">Referral document uploaded</span>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, referralNote: "" }))}
                    className="text-gray-400 hover:text-red-400 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "ml_default"}
                  options={{ folder: "oauthc/referrals", maxFiles: 1, resourceType: "auto", clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "pdf"] }}
                  onOpen={() => setUploading(true)}
                  onClose={() => setUploading(false)}
                  onSuccess={(result) => {
                    setUploading(false);
                    if (result.event === "success" && typeof result.info === "object" && result.info) {
                      setForm((prev) => ({ ...prev, referralNote: (result.info as { secure_url: string }).secure_url }));
                    }
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      disabled={uploading}
                      className="flex items-center gap-3 cursor-pointer rounded-lg border-2 border-dashed border-white/20 bg-white/10 backdrop-blur-sm px-5 py-4 hover:border-green-400 hover:bg-white/15 transition disabled:opacity-60"
                    >
                      {uploading ? (
                        <Loader2 size={18} className="shrink-0 text-gray-400 animate-spin" />
                      ) : (
                        <Upload size={18} className="shrink-0 text-green-400" />
                      )}
                      <span className="text-sm text-gray-300">
                        {uploading ? "Uploading…" : "Click to upload referral document (PDF or image)"}
                      </span>
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </Field>
          )}

          {/* Divider */}
          <hr className="border-white/10" />

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 w-full md:w-fit md:px-12 py-3.5 bg-green-900 hover:bg-green-800 active:scale-95 disabled:opacity-60 text-white font-semibold rounded-lg transition"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send size={16} />
                Submit Appointment
              </>
            )}
          </button>

          <p className="mt-3 text-gray-400 text-center text-lg">
            Your booking is confirmed after{" "}
            <strong className="text-red-500">PAYMENT</strong>; please be
            patient, as{" "}
            <strong className="text-red-500">CONFIRMATION PROCESS</strong> takes{" "}
            <strong className="text-red-500">24-48 Hours</strong>
          </p>
        </form>
      </div>
    </section>
  );
}
