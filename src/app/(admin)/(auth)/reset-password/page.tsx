"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/admin/AuthLayout";
import { Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const strength = getStrength(password);
  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
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
            <h2 className="text-gray-900 text-2xl font-bold tracking-tight">Password reset</h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">Your password has been updated. You can now sign in with your new password.</p>
          </div>
          <button onClick={() => router.push("/login")} className="w-full flex items-center justify-center gap-2 bg-green-900 hover:bg-green-800 text-white font-semibold py-2.5 rounded-xl text-sm transition active:scale-95">
            Go to Sign In <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-7">
        <div>
          <h2 className="text-gray-900 text-2xl font-bold tracking-tight">Reset your password</h2>
          <p className="text-gray-500 text-sm mt-1">Choose a new password for your account. Make it strong.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={15} strokeWidth={1.5} className="shrink-0" />{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">New Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" className={`${inputCls} pl-9 pr-10`} required autoComplete="new-password" />
              <button type="button" onClick={() => setShowPw((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                {showPw ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="flex gap-1">
                  {[1,2,3,4].map((step) => (
                    <div key={step} className={`h-1 flex-1 rounded-full transition-all duration-300 ${step <= strength.score ? strength.color : "bg-gray-100"}`} />
                  ))}
                </div>
                <p className={`text-xs font-semibold ${strength.score <= 1 ? "text-red-500" : strength.score === 2 ? "text-amber-600" : strength.score === 3 ? "text-blue-600" : "text-green-700"}`}>{strength.label} password</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Confirm Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" strokeWidth={1.5} />
              <input type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter your password" className={`${inputCls} pl-9 pr-10 ${mismatch ? "border-red-300 focus:ring-red-400" : ""}`} required autoComplete="new-password" />
              <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" tabIndex={-1}>
                {showConfirm ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>
            {mismatch && <p className="text-xs text-red-500 font-medium">Passwords do not match.</p>}
          </div>

          <ul className="flex flex-col gap-1">
            {[
              { label: "At least 8 characters", met: password.length >= 8 },
              { label: "One uppercase letter", met: /[A-Z]/.test(password) },
              { label: "One number", met: /[0-9]/.test(password) },
              { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
            ].map(({ label, met }) => (
              <li key={label} className="flex items-center gap-2 text-xs">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${met ? "bg-green-100" : "bg-gray-100"}`}>
                  {met && <CheckCircle size={9} className="text-green-700" strokeWidth={2.5} />}
                </span>
                <span className={met ? "text-gray-700" : "text-gray-400"}>{label}</span>
              </li>
            ))}
          </ul>

          <button type="submit" disabled={loading || mismatch} className="w-full flex items-center justify-center gap-2 bg-green-900 hover:bg-green-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition active:scale-95">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Resetting…</>
            ) : (
              <>Reset Password <ArrowRight size={14} strokeWidth={2} /></>
            )}
          </button>
        </form>

        <Link href="/login" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft size={14} strokeWidth={1.5} />Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
