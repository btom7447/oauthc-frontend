"use client";

import { useState } from "react";
import { useAuth } from "@/lib/admin-auth";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Building2,
  FileText,
  Save,
  CheckCircle,
  ShieldOff,
} from "lucide-react";

const labelCls = "block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5";
const inputCls =
  "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition bg-white";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  if (user.role !== "doctor") {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldOff size={24} strokeWidth={1.5} className="text-red-500" />
        </div>
        <div>
          <p className="text-gray-900 font-semibold">Access Restricted</p>
          <p className="text-gray-500 text-sm mt-1">
            Profile editing is only available to doctors.
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

  return <ProfileForm />;
}

function ProfileForm() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "+234 800 000 0000",
    specialty: user?.specialty ?? "",
    department: user?.department ?? "",
    qualifications: "MBBS, FWACP",
    bio: "Experienced specialist in cardiovascular medicine with over 10 years of clinical practice at OAUTHC.",
    languages: "English, Yoruba",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: persist to CMS/backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-gray-900 text-xl font-bold">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">
          Changes here will reflect on the public{" "}
          <span className="text-green-900 font-medium">/doctors</span> page.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 text-green-800 text-sm rounded-lg px-4 py-3">
          <CheckCircle size={15} strokeWidth={1.5} className="shrink-0" />
          Profile saved successfully.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-5"
      >
        {/* Name + Email */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input name="name" value={form.name} onChange={handleChange} className={`${inputCls} pl-9`} required />
            </div>
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input name="email" type="email" value={form.email} onChange={handleChange} className={`${inputCls} pl-9`} required />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className={labelCls}>Phone</label>
          <div className="relative">
            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
            <input name="phone" value={form.phone} onChange={handleChange} className={`${inputCls} pl-9`} />
          </div>
        </div>

        {/* Specialty + Department */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Specialty</label>
            <div className="relative">
              <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input name="specialty" value={form.specialty} onChange={handleChange} className={`${inputCls} pl-9`} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Department</label>
            <div className="relative">
              <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input name="department" value={form.department} onChange={handleChange} className={`${inputCls} pl-9`} />
            </div>
          </div>
        </div>

        {/* Qualifications */}
        <div>
          <label className={labelCls}>Qualifications</label>
          <div className="relative">
            <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
            <input name="qualifications" value={form.qualifications} onChange={handleChange} placeholder="e.g. MBBS, FWACP" className={`${inputCls} pl-9`} />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className={labelCls}>Bio</label>
          <div className="relative">
            <FileText size={14} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" strokeWidth={1.5} />
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Brief professional biography…"
              className={`${inputCls} pl-9 resize-none`}
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        <button
          type="submit"
          className="flex items-center gap-2 w-fit bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition active:scale-95"
        >
          <Save size={14} strokeWidth={1.5} />
          Save Changes
        </button>
      </form>
    </div>
  );
}
