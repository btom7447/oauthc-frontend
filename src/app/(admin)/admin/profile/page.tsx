"use client";

import { useState } from "react";
import { useAuth, roleLabel } from "@/lib/admin-auth";
import {
  User, Mail, Phone, BookOpen, Building2, FileText,
  Save, CheckCircle, Lock, Eye, EyeOff, Languages,
  Stethoscope, Globe,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

const labelCls = "block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5";
const inputCls = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition bg-white";

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-green-600"];
  return { score, label: labels[score] ?? "", color: colors[score] ?? "" };
}

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return <ProfileForm />;
}

function ProfileForm() {
  const { user, updateUser } = useAuth();
  const isDoctor = user?.role === "doctor";
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedPassword, setSavedPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    image: user?.avatar ?? "",
    // Doctor-only
    specialty: user?.specialty ?? "",
    department: user?.department ?? "",
    center: "",
    yearsOfExperience: "",
    qualifications: "",
    languages: "",
    bio: "",
    expertise: "",
    socialLinkedin: "",
    socialFacebook: "",
    socialInstagram: "",
  });

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const strength = getStrength(pw.next);
  const mismatch = pw.confirm.length > 0 && pw.next !== pw.confirm;

  const handleProfile = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: profile.name, avatar: profile.image || undefined });
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 3000);
  };

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) return;
    setSavedPassword(true);
    setPw({ current: "", next: "", confirm: "" });
    setTimeout(() => setSavedPassword(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-gray-900 text-xl font-bold">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">
          {isDoctor
            ? <>Changes here will reflect on the public <span className="text-green-900 font-medium">/doctors</span> page.</>
            : `Update your account details as ${roleLabel(user!.role)}.`}
        </p>
      </div>

      {/* ── Profile form ─────────────────────────────────── */}
      <form onSubmit={submitProfile} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Account Details</p>

        <ImageUpload
          value={profile.image}
          onChange={(url) => setProfile((p) => ({ ...p, image: url }))}
          label="Profile Photo"
          aspectRatio="square"
          folder={isDoctor ? "oauthc/doctors" : "oauthc/staff"}
        />

        {savedProfile && (
          <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 text-green-800 text-sm rounded-lg px-4 py-3">
            <CheckCircle size={15} strokeWidth={1.5} className="shrink-0" />
            Profile saved successfully.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input name="name" value={profile.name} onChange={handleProfile} className={`${inputCls} pl-9`} required />
            </div>
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input name="email" type="email" value={profile.email} readOnly className={`${inputCls} pl-9 bg-gray-50 text-gray-500 cursor-not-allowed`} />
            </div>
          </div>
        </div>

        <div>
          <label className={labelCls}>Phone</label>
          <div className="relative">
            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
            <input name="phone" value={profile.phone} onChange={handleProfile} placeholder="+234 8xx xxx xxxx" className={`${inputCls} pl-9`} />
          </div>
        </div>

        {/* Doctor-only fields */}
        {isDoctor && (
          <>
            <hr className="border-gray-100" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Professional Details</p>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Specialty</label>
                <div className="relative">
                  <Stethoscope size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                  <input name="specialty" value={profile.specialty} onChange={handleProfile} placeholder="e.g. Cardiology" className={`${inputCls} pl-9`} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Department</label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                  <input name="department" value={profile.department} onChange={handleProfile} placeholder="Department" className={`${inputCls} pl-9`} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Centre / Hospital</label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                  <input name="center" value={profile.center} onChange={handleProfile} placeholder="OAUTHC Main Campus" className={`${inputCls} pl-9`} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Years of Experience</label>
                <div className="relative">
                  <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                  <input name="yearsOfExperience" type="number" min="0" value={profile.yearsOfExperience} onChange={handleProfile} placeholder="e.g. 10" className={`${inputCls} pl-9`} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Qualifications <span className="normal-case font-normal">(comma-separated)</span></label>
              <div className="relative">
                <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                <input name="qualifications" value={profile.qualifications} onChange={handleProfile} placeholder="MBBS, FWACP, FRCP" className={`${inputCls} pl-9`} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Languages <span className="normal-case font-normal">(comma-separated)</span></label>
              <div className="relative">
                <Languages size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                <input name="languages" value={profile.languages} onChange={handleProfile} placeholder="English, Yoruba" className={`${inputCls} pl-9`} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Bio <span className="normal-case font-normal">(one paragraph per line)</span></label>
              <div className="relative">
                <FileText size={14} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                <textarea name="bio" value={profile.bio} onChange={handleProfile} rows={4} placeholder={"Paragraph 1\nParagraph 2"} className={`${inputCls} pl-9 resize-none`} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Areas of Expertise <span className="normal-case font-normal">(one per line)</span></label>
              <div className="relative">
                <FileText size={14} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                <textarea name="expertise" value={profile.expertise} onChange={handleProfile} rows={3} placeholder={"Interventional Cardiology\nHeart Failure"} className={`${inputCls} pl-9 resize-none`} />
              </div>
            </div>

            <hr className="border-gray-100" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Social Links</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: "socialLinkedin", label: "LinkedIn" },
                { name: "socialFacebook", label: "Facebook" },
                { name: "socialInstagram", label: "Instagram" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className={labelCls}>{label}</label>
                  <div className="relative">
                    <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                    <input name={name} value={(profile as Record<string, string>)[name] ?? ""} onChange={handleProfile} placeholder="https://…" className={`${inputCls} pl-9`} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <hr className="border-gray-100" />
        <button type="submit" className="flex items-center gap-2 w-fit bg-green-900 hover:bg-green-800 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition active:scale-95">
          <Save size={14} strokeWidth={1.5} />
          Save Profile
        </button>
      </form>

      {/* ── Change password ───────────────────────────────── */}
      <form onSubmit={submitPassword} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex flex-col gap-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Change Password</p>

        {savedPassword && (
          <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 text-green-800 text-sm rounded-lg px-4 py-3">
            <CheckCircle size={15} strokeWidth={1.5} className="shrink-0" />
            Password updated successfully.
          </div>
        )}

        <div>
          <label className={labelCls}>Current Password</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
            <input type={showCurrent ? "text" : "password"} value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} className={`${inputCls} pl-9 pr-10`} required />
            <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
              {showCurrent ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>New Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input type={showNew ? "text" : "password"} value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} className={`${inputCls} pl-9 pr-10`} required />
              <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                {showNew ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
            {pw.next.length > 0 && (
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= strength.score ? strength.color : "bg-gray-100"}`} />
                  ))}
                </div>
                <p className={`text-[11px] font-semibold ${strength.score <= 1 ? "text-red-500" : strength.score === 2 ? "text-amber-600" : strength.score === 3 ? "text-blue-600" : "text-green-700"}`}>{strength.label}</p>
              </div>
            )}
          </div>
          <div>
            <label className={labelCls}>Confirm Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input type={showConfirm ? "text" : "password"} value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} className={`${inputCls} pl-9 pr-10 ${mismatch ? "border-red-300 focus:ring-red-400" : ""}`} required />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                {showConfirm ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
            {mismatch && <p className="text-xs text-red-500 font-medium mt-1">Passwords do not match.</p>}
          </div>
        </div>

        <hr className="border-gray-100" />
        <button type="submit" disabled={mismatch || !pw.current || !pw.next} className="flex items-center gap-2 w-fit bg-green-900 hover:bg-green-800 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition active:scale-95">
          <Lock size={14} strokeWidth={1.5} />
          Update Password
        </button>
      </form>
    </div>
  );
}
