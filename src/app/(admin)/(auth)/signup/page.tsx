"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import AuthLayout from "@/components/admin/AuthLayout";
import { User, Mail, Lock, Eye, EyeOff, Building2, ChevronDown, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score, label: "Fair", color: "bg-amber-500" };
  if (score === 3) return { score, label: "Good", color: "bg-blue-500" };
  return { score, label: "Strong", color: "bg-green-600" };
}

const inputCls = "w-full border border-gray-200 rounded-xl bg-gray-50 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", role: "", department: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = getStrength(form.password);
  const mismatch = form.confirm.length > 0 && form.password !== form.confirm;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (strength.score < 2) { setError("Please choose a stronger password."); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-6">
          <div className="w-14 h-14 rounded-2xl bg-green-900/10 flex items-center justify-center">
            <CheckCircle size={26} strokeWidth={1.5} className="text-green-900" />
          </div>
          <div>
            <h2 className="text-gray-900 text-2xl font-bold tracking-tight">Request submitted</h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Your account request has been sent for review. An Administrator will approve and assign your role. You&apos;ll receive an email once your account is activated.
            </p>
          </div>
          <Link href="/login" className="w-full flex items-center justify-center gap-2 bg-green-900 hover:bg-green-800 text-white font-semibold py-2.5 rounded-xl text-sm transition active:scale-95">
            Back to Sign In <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-gray-900 text-2xl font-bold tracking-tight">Request access</h2>
          <p className="text-gray-500 text-sm mt-1">Fill in your details. An Administrator will review and activate your account.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={15} strokeWidth={1.5} className="shrink-0" />{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input name="name" value={form.name} onChange={handleChange} placeholder="Dr. Jane Doe" className={`${inputCls} pl-9 pr-4`} required autoComplete="name" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@oauthc.gov.ng" className={`${inputCls} pl-9 pr-4`} required autoComplete="email" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Role</label>
              <div className="relative">
                <select name="role" value={form.role} onChange={handleChange} className={`${inputCls} pl-3 pr-8 appearance-none`} required>
                  <option value="">Select…</option>
                  <option value="staff">Staff</option>
                  <option value="doctor">Doctor</option>
                </select>
                <ChevronDown size={13} strokeWidth={1.5} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">Department</label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
                <input name="department" value={form.department} onChange={handleChange} placeholder="e.g. Cardiology" className={`${inputCls} pl-8 pr-3`} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input name="password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="Min. 8 characters" className={`${inputCls} pl-9 pr-10`} required autoComplete="new-password" />
              <button type="button" onClick={() => setShowPw((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                {showPw ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
            {form.password.length > 0 && (
              <div className="flex flex-col gap-1 mt-0.5">
                <div className="flex gap-1">
                  {[1,2,3,4].map((step) => (
                    <div key={step} className={`h-1 flex-1 rounded-full transition-all duration-300 ${step <= strength.score ? strength.color : "bg-gray-100"}`} />
                  ))}
                </div>
                <p className={`text-[11px] font-semibold ${strength.score <= 1 ? "text-red-500" : strength.score === 2 ? "text-amber-600" : strength.score === 3 ? "text-blue-600" : "text-green-700"}`}>{strength.label} password</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Confirm Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input name="confirm" type={showConfirm ? "text" : "password"} value={form.confirm} onChange={handleChange} placeholder="Re-enter your password" className={`${inputCls} pl-9 pr-10 ${mismatch ? "border-red-300 focus:ring-red-400" : ""}`} required autoComplete="new-password" />
              <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                {showConfirm ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
            {mismatch && <p className="text-[11px] text-red-500 font-medium">Passwords do not match.</p>}
          </div>

          <button type="submit" disabled={loading || mismatch} className="w-full mt-1 flex items-center justify-center gap-2 bg-green-900 hover:bg-green-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition active:scale-95">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting…</>
            ) : (
              <>Request Access <ArrowRight size={14} strokeWidth={2} /></>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-green-900 font-semibold hover:underline underline-offset-2">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
